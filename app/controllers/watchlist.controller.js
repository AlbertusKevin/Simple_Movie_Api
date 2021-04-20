const Watchlist = require("../models/watchlist.model.js");

exports.getAUserList = (req, res) => {
  Watchlist.getAUserList(req.params.username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving " +
            req.params.username +
            " watchlist ",
      });
    else
      res.status(200).send({
        status: "Success",
        message: req.params.username + "'s watchlist List has been retrieved.",
        watchlist_list: data,
      });
  });
};

exports.addToList = (req, res) => {
  const watchlist = new Watchlist({
    username: req.params.username,
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
            req.params.vin +
            "'s watchlist ",
      });
    else
      res.status(200).send({
        status: "Success",
        message:
          req.params.username +
          "'s watchlist has been added a new movie (id: " +
          req.params.movie_id +
          " ).",
      });
  });
};

exports.deleteFromList = (req, res) => {
  const watchlist = new Watchlist({
    username: req.params.username,
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
            req.params.vin +
            "'s watchlist ",
      });
    else
      res.status(200).send({
        status: "Success",
        message: `Movie with id: ${req.params.movie_id} has been deleted from ${req.params.username}'s watchlist.`,
      });
  });
};
