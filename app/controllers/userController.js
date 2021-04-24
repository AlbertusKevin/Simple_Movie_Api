const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/authConfig");
const authToken = require("../middleware/authToken");

exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else
      res.status(201).send({
        status: "Success",
        message: "List of Users has been retrieved.",
        user: data,
      });
  });
};

exports.findUser = (req, res) => {
  User.getUsername(req.params.token, (err, data) => {
    if (err) {
      if (err.message === "not_found")
        return res.status(404).send({
          message: `Not found User with username ${username}.`,
        });
      else
        return res.status(500).send({
          status: "Failed",
          error: err.message || "Error retrieving token with from database",
        });
    } else {
      const username = JSON.parse(
        JSON.stringify(data)
      )[0].username.toLowerCase();
      authToken.authorizeToken(username, function (err, data) {
        if (err)
          if (err.message === "not_found")
            return res.status(404).send({
              message: `Not found User with username ${username}.`,
            });
          else
            return res.status(500).send({
              status: "Failed",
              error: err.message || "Error retrieving token with from database",
            });
        else if (data.valid) {
          User.findByUsername(username, (err, data) => {
            if (err) {
              if (err.message === "not_found") {
                res.status(404).send({
                  message: `Not found User with username ${username}.`,
                });
              } else {
                res.status(500).send({
                  message: "Error retrieving User with username " + username,
                });
              }
            } else {
              res.status(201).send({
                status: "Success",
                message:
                  "User with username " + username + " has been retrieved.",
                user: data,
              });
            }
          });
        } else {
          return res.status(401).send({
            status: "Failed",
            message: "Token expired or null. Please login !",
          });
        }
      });
    }
  });
};

exports.register = (req, res) => {
  const v = new Validator(req.body, {
    username: "required|minLength:6",
    email: "required|email",
    name: "required",
    password: "required|minLength:6",
  });

  v.check().then((matched) => {
    if (!matched) {
      console.log(v.errors);
      return res.status(422).send({
        status: "Failed",
        error: v.errors,
      });
    } else {
      const username = req.body.username.toLowerCase();
      const salt = bcrypt.genSaltSync(10);
      // Create a User
      const user = new User({
        username: username,
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, salt),
      });

      // Save Customer in the database
      User.insertUser(user, (err, data) => {
        if (err)
          if (err.message.includes("'PRIMARY'"))
            res.status(500).send({
              status: "Failed",
              message: "The username has been used.",
            });
          else
            res.status(500).send({
              status: "Failed",
              message:
                err.message || "Some error occurred while creating the user.",
            });
        else
          res.status(200).send({
            status: "Success",
            message: username + " Registered Successfully !",
            data,
          });
      });
    }
  });
};

exports.login = (req, res) => {
  const v = new Validator(req.body, {
    username: "required",
    password: "required",
  });

  v.check().then((matched) => {
    if (!matched) {
      console.log(v.errors);
      return res.status(422).send({
        status: "Failed",
        error: v.errors,
      });
    } else {
      const username = req.body.username.toLowerCase();
      const user = new User({
        username: username,
        password: req.body.password,
      });

      User.login(user, (err, data) => {
        if (err) {
          if (err.message === "login_failed")
            res.status(401).send({
              status: "Failed",
              error: `Username or password is incorrect ! `,
            });
          else
            res.status(500).send({
              status: "Failed",
              error:
                err.message ||
                "Error retrieving User with username " + req.params.username,
            });
        } else {
          let tokenValid = true;
          jwt.verify(data.token, config.secret, (err) => {
            if (err) {
              tokenValid = false;
            }
          });
          if (data.token == null || !tokenValid) {
            let token = jwt.sign({ username: username }, config.secret, {
              expiresIn: "24h", // 24 hours
            });

            User.login(user, (err, data) => {
              if (err) {
                if (err.message === "login_failed")
                  res.status(401).send({
                    status: "Failed",
                    error: `Username or password is incorrect ! `,
                  });
                else
                  res.status(500).send({
                    status: "Failed",
                    error:
                      err.message ||
                      "Error retrieving User with username " +
                        req.params.username,
                  });
              } else {
                let tokenValid = true;
                jwt.verify(data.token, config.secret, (err) => {
                  if (err) {
                    tokenValid = false;
                  }
                });
                if (data.token == null || !tokenValid) {
                  let token = jwt.sign({ username: username }, config.secret, {
                    expiresIn: "24h", // 24 hours
                  });
                  User.insertToken(username, token, (err) => {
                    if (err)
                      res.status(500).send({
                        status: "Failed",
                        error:
                          err.message || "Error Inserting Token to database.",
                      });
                  });
                  res.status(201).send({
                    status: "Success",
                    message:
                      "Login Success ! New Token has been added to database.",
                    token: token,
                  });
                } else {
                  res.status(201).send({
                    status: "Success",
                    message: "Login Success !",
                    token: data.token,
                  });
                }
              }
            });
          }
        }
      });
    }
  });
};

exports.updateUser = (req, res) => {
  User.getUsername(req.params.token, (err, data) => {
    if (err) {
      if (err.message === "not_found")
        return res.status(404).send({
          message: `Not found User with username ${username}.`,
        });
      else
        return res.status(500).send({
          status: "Failed",
          error: err.message || "Error retrieving token with from database",
        });
    } else {
      const username = JSON.parse(
        JSON.stringify(data)
      )[0].username.toLowerCase();
      authToken.authorizeToken(username, function (err, data) {
        if (err)
          if (err.message === "not_found")
            return res.status(404).send({
              message: `Not found User with username ${username}.`,
            });
          else
            res.status(500).send({
              status: "Failed",
              error: err.message || "Error retrieving token with from database",
            });
        else if (data.valid) {
          const v = new Validator(req.body, {
            email: "required|email",
            name: "required",
            password: "required|minLength:6",
          });
          v.check().then((matched) => {
            if (!matched) {
              console.log(v.errors);
              return res.status(422).send({
                status: "Failed",
                error: v.errors,
              });
            } else {
              User.findByUsername(username, (err, data) => {
                if (err) {
                  if (err.message === "not_found") {
                    res.status(404).send({
                      message: `Not found User with username ${username}.`,
                    });
                  } else {
                    res.status(500).send({
                      message:
                        "Error retrieving User with username " + username,
                    });
                  }
                } else {
                  let newUser = new User({
                    username: username,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                  });

                  if (req.body.name === undefined) newUser.name = data.name;
                  else newUser.name = req.body.name;

                  if (req.body.email === undefined) newUser.email = data.email;
                  else newUser.email = req.body.email;

                  User.updateByUsername(newUser, data.password, (err, data) => {
                    if (err) {
                      if (err.message === "not_found") {
                        res.status(404).send({
                          status: "Failed",
                          message: `Not found User with username ${username}.`,
                        });
                      } else {
                        res.status(500).send({
                          status: "Failed",
                          message: "Error updating User with with " + username,
                        });
                      }
                    } else
                      res.status(201).send({
                        status: "Success",
                        message:
                          "User " + username + " Updated Successfully ! ",
                        data,
                      });
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.checkToken = (req, res) => {
  const username = req.params.username.toLowerCase();

  authToken.authorizeToken(username, function (err, data) {
    if (err)
      if (err.message === "not_found")
        return res.status(404).send({
          message: `Not found User with username ${username}.`,
        });
      else
        return res.status(500).send({
          status: "Failed",
          error: err.message || "Error retrieving token from database",
        });
    else if (data.valid)
      return res.status(200).send({
        status: "Success",
        message: "Token is still valid!",
      });
    else
      return res.status(401).send({
        status: "Failed",
        message: "Token expired or null. Please login !",
      });
  });
};

exports.logout = (req, res) => {
  const username = req.body.username.toLowerCase();

  authToken.authorizeToken(username, function (err, data) {
    if (err)
      if (err.message === "not_found")
        return res.status(404).send({
          message: `Not found User with username ${username}.`,
        });
      else
        return res.status(500).send({
          status: "Failed",
          error: err.message || "Error retrieving token from database",
        });
    else if (data.valid) {
      User.nullToken(username, (err) => {
        if (err)
          res.status(500).send({
            status: "Failed",
            error: err.message || "Error Updating Token to database.",
          });
      });
      res.status(201).send({
        status: "Success",
        message: "Logout Success ! ",
      });
    } else
      return res.status(401).send({
        status: "Failed",
        message: "Logout failed because the user not login",
      });
  });
};
