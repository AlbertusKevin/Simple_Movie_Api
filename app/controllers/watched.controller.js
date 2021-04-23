const Watched = require("../models/watched.model.js");

exports.getAUserList = (req, res) => {
  Watched.getAUserList(req.params.username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving " +
            req.params.username +
            " watched list ",
      });
    else
      res.status(200).send({
        status: "Success",
        message: req.params.username + "'s watched List has been retrieved.",
        watched_list: data,
      });
  });
};

exports.addToList = (req, res) => {
  const watched = new Watched({
    username: req.params.username,
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
      res.status(200).send({
        status: "Success",
        message:
          req.params.username +
          "'s watched List has been added a new movie (id: " +
          req.params.movie_id +
          " ).",
      });
  });
};

exports.deleteFromList = (req, res) => {
  const watched = new Watched({
    username: req.params.username,
    movie_id: req.params.movie_id,
  });

  Watched.deleteFromList(watched, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while deleting a movie with " +
            req.params.movie_id +
            " from " +
            req.params.vin +
            "'s watched list ",
      });
    else
      res.status(200).send({
        status: "Success",
        message: `Movie with id: ${req.params.movie_id} has been deleted from ${req.params.username}'s watched List.`,
      });
  });
};
