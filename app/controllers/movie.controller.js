const Movie = require("../models/movie.model.js");

exports.findAll = (req, res) => {
  Movie.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving movies.",
      });
    else
      res.status(200).send({
        status: "Success",
        message: "List of Movie has been retrieved.",
        movie: data,
      });
  });
};
