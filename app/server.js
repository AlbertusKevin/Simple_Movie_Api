const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// parse requests of content-type: application/json
app.use(express.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Connected to server! See list of service that provided.",
    list_api: {
      movie: [
        "post: /api/movie",
        "get: /api/movie",
        "get: /api/movie/:movie_id",
        "put: /api/movie/:movie_id",
      ],
      genre: ["get: /api/genre", "post: /api/genre"],
      comment: ["post: /api/comment/:movie_id", "get: /api/comment/:movie_id"],
      rating: ["post: /api/rating/:movie_id", "put: /api/rating/:movie_id"],
      watched: [
        "get: /api/watched/:token",
        "post: /api/watched/:movie_id",
        "delete: /api/watched/:movie_id",
      ],
      watchlist: [
        "get: /api/watchlist/:token",
        "post: /api/watchlist/:movie_id",
        "delete: /api/watchlist/:movie_id",
      ],
      cast: [
        "post: /api/cast",
        "get: /api/cast",
        "get: /api/cast/:id",
        "put: /api/cast/:id",
      ],
      user: [
        "get: /api/user",
        "get: /api/user/:token",
        "post: /api/login",
        "post: /api/logout",
        "post: /api/register",
        "put: /api/user",
        "get: /api/areyoulogin/:username",
      ],
    },
  });
});

require("./routes/route_api")(app);
// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});
