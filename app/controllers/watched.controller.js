const Watched = require("../models/watched.model.js");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel");

exports.getAUserList = (req, res) => {
  User.getUsername(req.params.token, (err, data) => {
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
      authToken.authorizeToken(username, function (err, data) {
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
        } else if (!data.valid) {
          return res
            .status(403)
            .send({ status: "Forbidden Access", message: "must login first" });
        } else {
          Watched.getAUserList(username, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving " +
                    username +
                    " watched list ",
              });
            else
              res.status(200).send({
                status: "Success",
                message: username + "'s watched List has been retrieved.",
                watched_list: data,
              });
          });
        }
      });
    }
  });
};

exports.addToList = (req, res) => {
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
      authToken.authorizeToken(username, function (err, data) {
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
        } else if (!data.valid) {
          return res
            .status(403)
            .send({ status: "Forbidden Access", message: "must login first" });
        } else {
          const watched = new Watched({
            username: username,
            movie_id: req.params.movie_id,
          });

          Watched.addToList(watched, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while add a movie with " +
                    req.params.movie_id +
                    " to " +
                    req.params.vin +
                    "'s watched list ",
              });
            else
              res.status(201).send({
                status: "Success",
                message:
                  username +
                  "'s watched List has been added a new movie (id: " +
                  req.params.movie_id +
                  " ).",
              });
          });
        }
      });
    }
  });
};

exports.deleteFromList = (req, res) => {
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
      authToken.authorizeToken(username, function (err, data) {
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
        } else if (!data.valid) {
          return res
            .status(403)
            .send({ status: "Forbidden Access", message: "must login first" });
        } else {
          const watched = new Watched({
            username: username,
            movie_id: req.params.movie_id,
          });

          Watched.deleteFromList(watched, (err, data) => {
            if (err)
              if (err.kind === "not_found") {
                res.status(404).send({
                  status: "Empty",
                  message: `Not found Movie with id ${req.params.movie_id} on watchlist.`,
                });
              } else {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while deleting a movie with " +
                      req.params.movie_id +
                      " from " +
                      req.params.vin +
                      "'s watched list ",
                });
              }
            else
              res.status(200).send({
                status: "Success",
                message: `Movie with id: ${req.params.movie_id} has been deleted from ${username}'s watched List.`,
              });
          });
        }
      });
    }
  });
};
