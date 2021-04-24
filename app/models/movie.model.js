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

Movie.create = (movie, result) => {
  sql.query("INSERT INTO movie SET ?", movie, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Movie.getLastInserted = (result) => {
  sql.query(
    "SELECT movie_id FROM movie ORDER BY movie_id DESC LIMIT 1",
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      } else {
        result(null, res);
      }
    }
  );
};

Movie.deleteCast = (query, movie_id, result) => {
  sql.query(query, movie_id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Movie.insertCast = (query, movie_id, cast, result) => {
  const casts = cast.split(",");
  let rows = [];

  casts.forEach((id) => {
    rows.push([id, movie_id]);
  });

  sql.query(query, [rows], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Movie.getAll = (result) => {
  sql.query("SELECT * FROM movie", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Movie.findById = (movie_id, result) => {
  sql.query(`SELECT * FROM movie WHERE movie_id = ${movie_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found movie: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Movie.getCast = (query, movie_id, result) => {
  sql.query(query, movie_id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    } else {
      result(null, res);
    }
  });
};

Movie.updateData = (movie_id, movie, result) => {
  sql.query(
    "UPDATE movie SET ? WHERE movie_id = ?",
    [movie, movie_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated movies: ", { movie_id: movie_id, ...movie });
      result(null, { movie_id: movie_id, ...movie });
    }
  );
};

Movie.updatePoster = (movie_id, filename, result) => {
  sql.query(
    "UPDATE movie SET poster = ? WHERE movie_id = ?",
    [filename, movie_id],
    (err, res) => {
      if (err) {
        console.log(err);
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};

module.exports = Movie;
