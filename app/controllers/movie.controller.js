const Movie = require("../models/movie.model.js");
const authToken = require("../middleware/authToken");
const User = require("../models/userModel");

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
  User.getUsername(req.body.token, (err, data) => {
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
            let img = "";

            if (Object.entries(req.body).length === 0) {
              return res.status(200).send({ message: "No data updated." });
            }

            // Upload file
            if (req.file != undefined) {
              const file = req.file.path;

              if (!file) {
                return res.status(400).send({
                  status: false,
                  data: "No File is selected.",
                });
              }

              // ambil path
              img = req.file.filename;
            }

            // Jika ingin update list actor
            if (req.body.actor != undefined) {
              let query = "DELETE FROM movie_cast WHERE movie_id = ?";
              Movie.deleteCast(query, req.params.movie_id, (err) => {
                if (err) {
                  res.status(500).send({
                    message:
                      err.message ||
                      " Some error occurred while delete actor list associated with movie id " +
                        req.params.movie_id +
                        ".",
                  });
                } else {
                  query =
                    "INSERT INTO movie_cast (actor_id, movie_id) VALUES ?";
                  Movie.insertCast(
                    query,
                    req.params.movie_id,
                    req.body.actor,
                    (err) => {
                      if (err) {
                        res.status(500).send({
                          message:
                            err.message ||
                            " Some error occurred while updated actor list.",
                        });
                      }
                    }
                  );
                }
              });
            }

            // Jika ingin update list director
            if (req.body.director != undefined) {
              let query = "DELETE FROM director WHERE movie_id = ?";
              Movie.deleteCast(query, req.params.movie_id, (err) => {
                if (err) {
                  res.status(500).send({
                    message:
                      err.message ||
                      " Some error occurred while delete director list associated with movie id " +
                        req.params.movie_id +
                        ".",
                  });
                } else {
                  let query =
                    "INSERT INTO director (director_id, movie_id) VALUES ?";
                  Movie.insertCast(
                    query,
                    req.params.movie_id,
                    req.body.director,
                    (err) => {
                      if (err) {
                        res.status(500).send({
                          message:
                            err.message ||
                            " Some error occurred while updated director list.",
                        });
                      }
                    }
                  );
                }
              });
            }

            let movie = new Movie({
              acc_rating: 0,
              duration: req.body.duration,
              genre: req.body.genre,
              synopsis: req.body.synopsis,
              poster: img,
              title: req.body.title,
              year: req.body.year,
            });

            Movie.findById(req.params.movie_id, (err, data) => {
              if (err) {
                res.status(500).send({
                  status: "error",
                  error: err.message,
                  message:
                    "Error updating movie with id " + req.params.movie_id,
                });
              } else {
                const oldDataMovie = JSON.parse(JSON.stringify(data));

                if (movie.duration == undefined) {
                  movie.duration = oldDataMovie.duration;
                }

                if (movie.title == undefined) {
                  movie.title = oldDataMovie.title;
                }

                movie.acc_rating = oldDataMovie.acc_rating;

                if (movie.poster == "") {
                  movie.poster = oldDataMovie.poster;
                }

                if (movie.genre == undefined) {
                  movie.genre = oldDataMovie.genre;
                }
                if (movie.year == undefined) {
                  movie.year = oldDataMovie.year;
                }
                if (movie.synopsis == undefined) {
                  movie.synopsis = oldDataMovie.synopsis;
                }

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
                        message:
                          "Error updating movie with id " + req.params.movie_id,
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
              }
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

exports.create = (req, res) => {
  User.getUsername(req.body.token, (err, data) => {
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
    } else {
      // console.log(JSON.parse(JSON.stringify(data))[0].username);
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

            try {
              // Upload file
              if (req.file == undefined) {
                return res.status(400).send({
                  status: "error",
                  message: `You must select a file for poster.`,
                });
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
                      err.message ||
                      " Some error occurred while inserting new movie.",
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
                      let query =
                        "INSERT INTO director (director_id, movie_id) VALUES ?";
                      Movie.insertCast(
                        query,
                        JSON.parse(JSON.stringify(data))[0].id,
                        req.body.director,
                        (err) => {
                          if (err) {
                            res.status(500).send({
                              message:
                                err.message ||
                                " Some error occurred while inserted director database.",
                            });
                          } else {
                            query =
                              "INSERT INTO movie_cast (actor_id, movie_id) VALUES ?";
                            Movie.insertCast(
                              query,
                              id,
                              req.body.cast,
                              (err) => {
                                if (err) {
                                  res.status(500).send({
                                    message:
                                      err.message ||
                                      " Some error occurred while inserted movie_cast database.",
                                  });
                                }
                              }
                            );
                          }
                        }
                      );

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
                message:
                  err.message ||
                  " Some error occurred while inserting new movie.",
              });
            }
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
