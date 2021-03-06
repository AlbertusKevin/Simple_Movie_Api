const Comment = require("../models/comment.model.js");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel");

exports.getFromMovie = (req, res) => {
  Comment.getFromMovie(req.params.movie_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving list of comment from movie_id " +
            req.params.movie_id,
      });
    else
      res.status(200).send({
        status: "Success",
        message:
          "Comments from movie id " +
          req.params.movie_id +
          " has been retrieved.",
        comments: data,
      });
  });
};

exports.create = (req, res) => {
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
          // Validate request
          if (!req.body) {
            res.status(400).send({
              message: "Content can not be empty!",
            });
          }

          const comment = new Comment({
            username: username,
            movie_id: req.params.movie_id,
            comment: req.body.comment,
          });

          Comment.create(comment, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while saving comment.",
              });
            else
              res.status(201).send({
                status: "success",
                message: "Comment has been saved.",
              });
          });
        }
      });
    }
  });
};

exports.update = (req, res) => {
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
          const comment = new Comment({
            username: username,
            movie_id: req.params.movie_id,
            comment: req.body.comment,
          });

          Comment.update(comment, (err, data) => {
            if (err)
              if (err.kind === "not_found") {
                res.status(404).send({
                  status: "Empty",
                  message: `Not found Comment by ${username} on movie id ${req.params.movie_id}.`,
                });
              } else {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating comment.",
                });
              }
            else
              res.status(201).send({
                status: "success",
                message: "Comment has been updated.",
              });
          });
        }
      });
    }
  });
};

exports.delete = (req, res) => {
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
          Comment.delete(req.params.movie_id, username, (err, data) => {
            if (err)
              if (err.kind === "not_found") {
                res.status(404).send({
                  status: "Empty",
                  message: `Not found Comment by ${username} on movie id ${req.params.movie_id}.`,
                });
              } else {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while deleting comment.",
                });
              }
            else
              res.status(200).send({
                status: "success",
                message: "Comment has been deleted.",
              });
          });
        }
      });
    }
  });
};
