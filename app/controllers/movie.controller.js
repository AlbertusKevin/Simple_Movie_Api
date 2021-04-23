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

exports.findOne = (req, res) => {
  Movie.findById(req.params.movie_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: "Empty",
          message: `Not found Movie with id ${req.params.movie_id}.`,
        });
      } else {
        res.status(500).send({
          status: "error",
          error: err.message,
          message: "Error retrieving Movie with id " + req.params.movie_id,
        });
      }
    } else {
      const data_movie = data;
      let query =
        "SELECT cast.name, cast.hometown FROM cast JOIN movie_cast ON movie_cast.actor_id = cast.id WHERE movie_cast.movie_id = ?";
      Movie.getCast(query, req.params.movie_id, (err, data) => {
        if (err) {
          res.status(500).send({
            status: "error",
            error: err.message,
            message:
              "Error retrieving actors associated with movie with id " +
              req.params.movie_id,
          });
        } else {
          const data_actor = data;
          let query =
            "SELECT cast.name, cast.hometown FROM cast JOIN director ON director.director_id = cast.id WHERE director.movie_id = ?";
          Movie.getCast(query, req.params.movie_id, (err, data) => {
            if (err) {
              res.status(500).send({
                status: "error",
                error: err.message,
                message:
                  "Error retrieving directors associated with movie with id " +
                  req.params.movie_id,
              });
            } else {
              const data_director = [data];
              res.status(200).send({
                status: "success",
                message: "A Movie has been retrieved.",
                movie: data_movie,
                actors: data_actor,
                director: data_director,
              });
            }
          });
        }
      });
    }
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const movie = {
    duration: req.body.duration,
    genre: req.body.genre,
    synopsis: req.body.synopsis,
    title: req.body.title,
    year: req.body.year,
  };

  Movie.updateData(req.params.movie_id, movie, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: "empty",
          message: `Not found Movie with id ${req.params.movie_id}.`,
        });
      } else {
        res.status(500).send({
          status: "error",
          error: err.message,
          message: "Error updating movie with id " + req.params.movie_id,
        });
      }
    } else {
      res.status(200).send({
        status: "success",
        message: "A Movie has been updated.",
        movie: data,
      });
    }
  });
};

exports.updatePoster = (req, res) => {
  // Upload file
  if (req.file == undefined) {
    return res.status(400).send(`You must select a file.`);
  }

  const file = req.file.path;

  if (!file) {
    res.status(400).send({
      status: false,
      data: "No File is selected.",
    });
  }

  // ambil nama file
  const img = req.file.filename;

  Movie.updatePoster(req.params.movie_id, img, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "Failed",
        message: `${err.message}. Some error occured while trying update poster movie id ${req.params.id}`,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: `Poster movie with id ${req.params.movie_id} successfully updated.`,
      });
    }
  });
};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  try {
    // Upload file
    if (req.file == undefined) {
      return res.status(400).send(`You must select a file.`);
    }

    const file = req.file.path;

    if (!file) {
      res.status(400).send({
        status: false,
        data: "No File is selected.",
      });
    }
    // ambil path
    const img = req.file.filename;

    const movie = new Movie({
      title: req.body.title,
      duration: req.body.duration,
      acc_rating: 0,
      genre: req.body.genre,
      poster: img,
      synopsis: req.body.synopsis,
      year: req.body.year,
    });

    Movie.create(movie, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || " Some error occurred while inserting new movie.",
        });
      } else {
        Movie.getLastInserted((err, data) => {
          const id = data;
          if (err) {
            res.status(500).send({
              message:
                err.message ||
                " Some error occurred while get last inserted id movie.",
            });
          } else {
            let query = "INSERT INTO director (director_id, movie_id) VALUES ?";
            Movie.insertCast(query, id, req.body.director, (err) => {
              if (err) {
                res.status(500).send({
                  message:
                    err.message ||
                    " Some error occurred while inserted director database.",
                });
              } else {
                query = "INSERT INTO movie_cast (actor_id, movie_id) VALUES ?";
                Movie.insertCast(query, id, req.body.cast, (err) => {
                  if (err) {
                    res.status(500).send({
                      message:
                        err.message ||
                        " Some error occurred while inserted movie_cast database.",
                    });
                  }
                });
              }
            });

            res.status(200).send({
              status: "succes",
              message: "New movie has been added to database",
            });
          }
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || " Some error occurred while inserting new movie.",
    });
  }
};
