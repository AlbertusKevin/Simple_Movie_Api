const sql = require("./../database/db_conn");

const Rating = function (rating) {
  (this.username = rating.username),
    (this.movie_id = rating.movie_id),
    (this.stars = rating.stars);
};

// Rating.getFromMovie = (movie_id, result) => {
//   sql.query(
//     "SELECT * FROM comment where movie_id = ?",
//     movie_id,
//     (err, res) => {
//       if (err) {
//         result(null, err);
//         return;
//       }

//       result(null, res);
//     }
//   );
// };

Rating.create = (rating, result) => {
  sql.query("INSERT INTO rating SET ?", rating, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    sql.query(
      "SELECT AVG(stars) as avg_rating FROM rating WHERE movie_id = ?",
      rating.movie_id,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("saved rating: ", { ...rating });
        result(null, res);
      }
    );
  });
};

Rating.updateRating = (rating, result) => {
  sql.query(
    "UPDATE rating SET stars = ? WHERE username = ? AND movie_id = ?",
    [rating.stars, rating.username, rating.movie_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      sql.query(
        "SELECT AVG(stars) as avg_rating FROM rating WHERE movie_id = ?",
        rating.movie_id,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }

          console.log("Updated rating: ", { ...rating });
          result(null, res);
        }
      );
    }
  );
};

Rating.updateAccRating = (data, movie_id, result) => {
  const rating = JSON.parse(JSON.stringify(data))[0].avg_rating;
  sql.query(
    "UPDATE movie SET acc_rating = ? WHERE movie_id = ?",
    [rating, movie_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      } else {
        console.log("Updated rating: ");
        result(null, res);
      }
    }
  );
};

module.exports = Rating;
