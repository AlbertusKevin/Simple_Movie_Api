module.exports = (app) => {
  const upload = require("../middleware/upload");
  const movie = require("../controllers/movie.controller.js");
  const genre = require("../controllers/genre.controller.js");
  const comment = require("../controllers/comment.controller.js");
  const rating = require("../controllers/rating.controller.js");
  const watched = require("../controllers/watched.controller.js");

  //? ======================================
  //! Api for Movie
  //? ======================================
  // Post Movie
  app.post("/api/movie", upload.single("poster"), movie.create);
  // Retrieve all movie
  app.get("/api/movie", movie.findAll);
  // Retrieve a movie
  app.get("/api/movie/:movie_id", movie.findOne);
  // Update data movie
  app.put("/api/movie/:movie_id", movie.update);
  //? ======================================
  //! Api for Genre
  //? ======================================
  //Retrieve all genre
  app.get("/api/genre", genre.findAll);
  //Post new genre
  app.post("/api/genre", genre.create);
  //? ======================================
  //! Api for Comment
  //? ======================================
  // Memberikan komentar movie tertentu
  app.post("/api/comment/:movie_id/:username", comment.create);
  // Melihat komentar movie tertentu
  app.get("/api/comment/:movie_id", comment.getFromMovie);
  // ? ======================================
  // ! Api for Rating
  // ? ======================================
  // Memberikan Rating
  app.post("/api/rating/:movie_id/:username", rating.create);
  // Mengubah Rating
  app.put("/api/rating/:movie_id/:username", rating.updateRating);

  //? ======================================
  //! Api for Watched
  //? ======================================
  // Melihat daftar watched
  app.get("/api/watched/:username", watched.getAUserList);
  // Menambahkan Movie ke daftar Watched
  app.post("/api/watched/:username/:movie_id", watched.addToList);
  // Menghapus Movie dari daftar watched
  app.delete("/api/watched/:username/:movie_id", watched.deleteFromList);
};
