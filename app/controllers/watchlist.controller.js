const Watchlist = require("../models/watchlist.model.js");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel.js");

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
          Watchlist.getAUserList(username, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving " +
                    username +
                    " watchlist ",
              });
            else
              res.status(200).send({
                status: "Success",
                message: username + "'s watchlist List has been retrieved.",
                watchlist_list: data,
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
          const watchlist = new Watchlist({
            username: username,
            movie_id: req.params.movie_id,
          });

          Watchlist.addToList(watchlist, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while add a movie with " +
                    req.params.movie_id +
                    " to " +
                    username +
                    "'s watchlist ",
              });
            else
              res.status(200).send({
                status: "Success",
                message:
                  username +
                  "'s watchlist has been added a new movie (id: " +
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
          const watchlist = new Watchlist({
            username: username,
            movie_id: req.params.movie_id,
          });

          Watchlist.deleteFromList(watchlist, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while deleting a movie with " +
                    req.params.movie_id +
                    " from " +
                    username +
                    "'s watchlist ",
              });
            else
              res.status(200).send({
                status: "Success",
                message: `Movie with id: ${req.params.movie_id} has been deleted from ${username}'s watchlist.`,
              });
          });
        }
      });
    }
  });
};
