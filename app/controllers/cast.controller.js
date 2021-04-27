const Cast = require("./../models/cast.model");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel");

exports.insertCast = (req, res) => {
  User.getUsername(req.body.token, (err, data) => {
    if (err) {
      if (err.message === "not_found")
        return res.status(404).send({
          message: `Not found username with specified token.`,
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
      if (username === "admin1") {
        authToken.authorizeToken(username, function (err, data) {
          if (err) {
            if (err.message === "not_found")
              return res.status(404).send({
                message: `Not found User with username ${username}.`,
              });
            else
              return res.status(500).send({
                status: "Failed",
                error:
                  err.message || "Error retrieving token with from database",
              });
          } else if (!data.valid) {
            return res.status(403).send({
              status: "Forbidden Access",
              message: "must login first",
            });
          } else {
            // Validate request
            if (!req.body) {
              return res.status(400).send({
                message: "Content can not be empty!",
              });
            }

            // Upload file
            if (req.file == undefined) {
              return res
                .status(400)
                .send({ status: "failed", message: `You must select a file.` });
            }

            const file = req.file.path;

            if (!file) {
              return res.status(400).send({
                status: false,
                data: "No File is selected.",
              });
            }

            // ambil path
            const img = req.file.filename;
            let date = new Date(req.body.dob)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            const cast = new Cast({
              id: req.body.id,
              name: req.body.name,
              photo: img,
              miniBio: req.body.miniBio,
              link_profile: req.body.link_profile,
              dob: date,
              hometown: req.body.hometown,
              role: req.body.role,
            });

            Cast.insertNew(cast, (err, data) => {
              if (err) {
                res.status(500).send({
                  status: "error",
                  message: `${err.message}. Some problem occured when trying to insert new cast data.`,
                });
              } else {
                res.status(201).send({
                  status: "success",
                  message: "New cast has been inserted.",
                });
              }
            });
          }
        });
      } else {
        return res.status(403).send({
          status: "Forbidden Access",
          message: "Only admin can post!",
        });
      }
    }
  });
};

exports.getAllCast = (req, res) => {
  Cast.getAllCast((err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: `Some error occured while trying to get all cast. ${err.message}`,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Success get list of cast",
        cast: data,
      });
    }
  });
};

exports.getCastDetail = (req, res) => {
  Cast.getCastDetail(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found")
        return res.status(404).send({
          message: `Not found cast with id ${req.params.id}.`,
        });
      else
        res.status(500).send({
          status: "error",
          message: `${err.message} Some error occured while trying to get detal cast id ${req.params.id}`,
        });
    } else {
      res.status(200).send({
        status: "success",
        message: `Success get a detail of cast by id ${req.params.id}`,
        cast: data,
      });
    }
  });
};

exports.updateData = (req, res) => {
  User.getUsername(req.body.token, (err, data) => {
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
      if (username === "admin1") {
        authToken.authorizeToken(username, function (err, data) {
          if (err) {
            if (err.message === "not_found")
              return res.status(404).send({
                message: `Not found User with username ${username}.`,
              });
            else
              return res.status(500).send({
                status: "Failed",
                error:
                  err.message || "Error retrieving token with from database",
              });
          } else if (!data.valid) {
            return res.status(403).send({
              status: "Forbidden Access",
              message: "must login first",
            });
          } else {
            let img = "";

            if (Object.entries(req.body).length === 1) {
              return res
                .status(200)
                .send({ status: "ok", message: "No data updated." });
            }

            // Upload file
            if (req.file != undefined) {
              const file = req.file.path;

              if (!file) {
                return res.status(400).send({
                  status: false,
                  data: "No File is selected.",
                });
              }

              // ambil path
              img = req.file.filename;
            }

            let newCast = new Cast({
              id: req.params.id,
              name: req.body.name,
              photo: img,
              miniBio: req.body.miniBio,
              link_profile: req.body.link_profile,
              dob: req.body.dob,
              hometown: req.body.hometown,
              role: req.body.role,
            });

            if (newCast.dob != undefined) {
              let date = new Date(newCast.dob)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              newCast.dob = date;
            }

            Cast.getCastDetail(req.params.id, (err, data) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    status: "Empty",
                    message: `Not found cast with id ${req.params.id}.`,
                  });
                } else {
                  res.status(500).send({
                    status: "error",
                    message: `${err.message} Some error occured while trying to get old data cast by id ${req.params.id}`,
                  });
                }
              } else {
                const cast = JSON.parse(JSON.stringify(data));

                if (newCast.name == undefined) {
                  newCast.name = cast.name;
                }
                if (newCast.photo == "") {
                  newCast.photo = cast.photo;
                }
                if (newCast.miniBio == undefined) {
                  newCast.miniBio = cast.miniBio;
                }
                if (newCast.dob == undefined) {
                  newCast.dob = cast.dob;
                }

                if (newCast.hometown == undefined) {
                  newCast.hometown = cast.hometown;
                }
                if (newCast.link_profile == undefined) {
                  newCast.link_profile = cast.link_profile;
                }
                if (newCast.role == undefined) {
                  newCast.role = cast.role;
                }

                Cast.updateData(req.params.id, newCast, (err, data) => {
                  if (err) {
                    if (err.kind === "not_found") {
                      res.status(404).send({
                        status: "Empty",
                        message: `Not found Movie with id ${req.params.movie_id}.`,
                      });
                    } else {
                      res.status(500).send({
                        status: "error",
                        message: `${err.message}. Some error occured while trying to update data.`,
                      });
                    }
                  } else {
                    res.status(201).send({
                      status: "success",
                      message: "Data successfully updated",
                      new_data: newCast,
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        return res.status(403).send({
          status: "Forbidden Access",
          message: "Only admin can post!",
        });
      }
    }
  });
};
