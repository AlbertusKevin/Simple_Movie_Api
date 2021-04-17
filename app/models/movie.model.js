const sql = require("./../database/db_conn");

const Movie = function (movie) {
  (this.acc_rating = movie.acc_rating),
    (this.duration = movie.duration),
    (this.poster = movie.poster),
    (this.genre = movie.genre),
    (this.synopsis = movie.synopsis),
    (this.title = movie.title),
    (this.year = movie.year);
};

Movie.getAll = (result) => {
  sql.query("SELECT * FROM movie", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Movies: ", res);
    result(null, res);
  });
};

module.exports = Movie;
