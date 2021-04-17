const Genre = require("../models/genre.model.js");

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

  // Save Customer in the database
  Genre.create(genre, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the genre.",
      });
    else res.send(data);
  });
};
