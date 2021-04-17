module.exports = (app) => {
  const movie = require("../controllers/movie.controller.js");
  const genre = require("../controllers/genre.controller.js");

  //? ======================================
  //! Api for Movie
  //? ======================================
  // Retrieve all movie
  app.get("/api/movie", movie.findAll);

  //? ======================================
  //! Api for Genre
  //? ======================================
  //Retrieve all genre
  app.get("/api/genre", genre.findAll);
  //Post new genre
  app.post("/api/genre", genre.create);
};
