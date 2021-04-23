const Watchlist = require("../models/watchlist.model.js");
const authToken = require("../middleware/authToken");

exports.getAUserList = (req, res) => {
  const username = req.params.username.toLowerCase();
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
            message:
              req.params.username + "'s watchlist List has been retrieved.",
            watchlist_list: data,
          });
      });
    }
  });
};

exports.addToList = (req, res) => {
  const username = req.params.username.toLowerCase();
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
    }
  });
};

exports.deleteFromList = (req, res) => {
  const username = req.params.username.toLowerCase();
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
    }
  });
};
