const Comment = require("../models/comment.model.js");

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
  const comment = new Comment({
    username: req.params.username,
    movie_id: req.params.movie_id,
    comment: req.body.comments,
  });

  // Save Customer in the database
  Comment.create(comment, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while saving comment.",
      });
    else
      res
        .status(200)
        .send({ status: "success", message: "Comment has been saved." });
  });
};
