const Rating = require("../models/rating.model.js");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel");

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

          // Create a comment
          const rating = new Rating({
            username: username,
            movie_id: req.params.movie_id,
            stars: req.body.stars,
          });

          // Save Customer in the database
          Rating.create(rating, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || " Some error occurred while giving rating.",
              });
            else
              Rating.updateAccRating(data, rating.movie_id, (err, data) => {
                if (err)
                  res.status(500).send({
                    message:
                      err.message ||
                      " Rating has been saved, buat some error occurred while updating acc_rating movie with id " +
                        rating.movie_id +
                        ".",
                  });
                else
                  res.status(200).send({
                    status: "success",
                    message: "Rating has been given.",
                  });
              });
          });
        }
      });
    }
  });
};

exports.updateRating = (req, res) => {
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

          // Create a comment
          const rating = new Rating({
            username: username,
            movie_id: req.params.movie_id,
            stars: req.body.stars,
          });

          Rating.updateRating(rating, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || " Some error occurred while updating rating.",
              });
            else
              Rating.updateAccRating(data, rating.movie_id, (err, data) => {
                if (err)
                  res.status(500).send({
                    message:
                      err.message ||
                      " Rating has been updated, buat some error occurred while updating acc_rating movie with id " +
                        rating.movie_id +
                        ".",
                  });
                else
                  res.status(200).send({
                    status: "success",
                    message: "Rating has been updated.",
                  });
              });
          });
        }
      });
    }
  });
};
