module.exports = (app) => {
  const uploadPoster = require("../middleware/uploadPoster");
  const uploadPhoto = require("../middleware/uploadPhoto");
  const movie = require("../controllers/movie.controller.js");
  const genre = require("../controllers/genre.controller.js");
  const comment = require("../controllers/comment.controller.js");
  const rating = require("../controllers/rating.controller.js");
  const watched = require("../controllers/watched.controller.js");
  const watchlist = require("../controllers/watchlist.controller.js");
  const cast = require("../controllers/cast.controller.js");
  const user = require("../controllers/userController.js");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //? ======================================
  //! Api for Movie
  //? ======================================
  // Post Movie
  app.post("/api/movie", uploadPoster.single("poster"), movie.create);
  // Retrieve all movie
  app.get("/api/movie", movie.findAll);
  // Retrieve a movie
  app.get("/api/movie/:movie_id", movie.findOne);
  // Update data movie
  app.put("/api/movie/:movie_id", uploadPoster.single("poster"), movie.update);

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

  //? ======================================
  //! Api for Watchlist
  //? ======================================
  // Melihat daftar watchlist
  app.get("/api/watchlist/:username", watchlist.getAUserList);
  // Menambahkan Movie ke daftar Watchlist
  app.post("/api/watchlist/:username/:movie_id", watchlist.addToList);
  // Menghapus Movie dari daftar watchlist
  app.delete("/api/watchlist/:username/:movie_id", watchlist.deleteFromList);

  //? ======================================
  //! Api for Cast
  //? ======================================
  app.post("/api/cast", uploadPhoto.single("photo"), cast.insertCast);
  app.get("/api/cast", cast.getAllCast);
  app.get("/api/cast/:id", cast.getCastDetail);
  app.put("/api/cast/:id", uploadPhoto.single("photo"), cast.updateData);

  //? ======================================
  //! Api for User
  //? ======================================
  app.get("/api/user", user.findAll);
  app.get("/api/user/:username", user.findUser);
  app.post("/api/login", user.login);
  app.post("/api/register", user.register);
  app.put("/api/user/update/:username", user.updateUser);
  app.get("/api/areyoulogin/:username", user.checkToken);
};
