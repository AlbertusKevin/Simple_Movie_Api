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
  //! Api for Movie (done req with token)
  //? ======================================
  app.post("/api/movie", uploadPoster.single("poster"), movie.create);
  app.get("/api/movie", movie.findAll);
  app.get("/api/movie/:movie_id", movie.findOne);
  app.put("/api/movie/:movie_id", uploadPoster.single("poster"), movie.update);

  //? ======================================
  //! Api for Genre (done req with token)
  //? ======================================
  app.get("/api/genre", genre.findAll);
  app.post("/api/genre", genre.create);

  //? ======================================
  //! Api for Comment (done req with token)
  //? ======================================
  app.post("/api/comment/:movie_id", comment.create);
  app.get("/api/comment/:movie_id", comment.getFromMovie);

  // ? ======================================
  // ! Api for Rating (done req with token)
  // ? ======================================
  app.post("/api/rating/:movie_id", rating.create);
  app.put("/api/rating/:movie_id", rating.updateRating);

  //? ======================================
  //! Api for Watched (done req with token)
  //? ======================================
  app.get("/api/watched/:token", watched.getAUserList);
  app.post("/api/watched/:movie_id", watched.addToList);
  app.delete("/api/watched/:movie_id", watched.deleteFromList);

  //? ======================================
  //! Api for Watchlist (done req with token)
  //? ======================================
  app.get("/api/watchlist/:token", watchlist.getAUserList);
  app.post("/api/watchlist/:movie_id", watchlist.addToList);
  app.delete("/api/watchlist/:movie_id", watchlist.deleteFromList);

  //? ======================================
  //! Api for Cast (done with req token)
  //? ======================================
  app.post("/api/cast", uploadPhoto.single("photo"), cast.insertCast);
  app.get("/api/cast", cast.getAllCast);
  app.get("/api/cast/:id", cast.getCastDetail);
  app.put("/api/cast/:id", uploadPhoto.single("photo"), cast.updateData);

  //? ======================================
  //! Api for User (done with req token)
  //? ======================================
  app.get("/api/user", user.findAll);
  app.get("/api/user/:token", user.findUser);
  app.post("/api/login", user.login);
  app.post("/api/logout", user.logout);
  app.post("/api/register", user.register);
  app.put("/api/user", user.updateUser);
  app.get("/api/areyoulogin/:username", user.checkToken);
};
