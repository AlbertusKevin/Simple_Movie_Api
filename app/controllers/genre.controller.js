const Genre = require("../models/genre.model.js");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel");

exports.findAll = (req, res) => {
  Genre.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving list of genre.",
      });
    else
      res.status(200).send({
        status: "Success",
        message: "List of genre has been retrieved.",
        genre: data,
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
              res.status(400).send({
                message: "Content can not be empty!",
              });
            }

            // Create a Genre
            const genre = new Genre({
              genre: req.body.genre,
            });

            Genre.create(genre, (err, data) => {
              if (err)
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the genre.",
                });
              else
                res.status(201).send({ message: "genre created", genre: data });
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
