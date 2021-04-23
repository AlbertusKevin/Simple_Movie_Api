const Rating = require("../models/rating.model.js");

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
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a comment
  const rating = new Rating({
    username: req.params.username,
    movie_id: req.params.movie_id,
    stars: req.body.stars,
  });

  // Save Customer in the database
  Rating.create(rating, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || " Some error occurred while giving rating.",
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
          res
            .status(200)
            .send({ status: "success", message: "Rating has been given." });
      });
  });
};

exports.updateRating = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a comment
  const rating = new Rating({
    username: req.params.username,
    movie_id: req.params.movie_id,
    stars: req.body.stars,
  });

  Rating.updateRating(rating, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || " Some error occurred while updating rating.",
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
          res
            .status(200)
            .send({ status: "success", message: "Rating has been updated." });
      });
  });
};
