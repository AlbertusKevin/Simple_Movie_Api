const sql = require("./../database/db_conn");

const Watched = function (rating) {
  (this.username = rating.username), (this.movie_id = rating.movie_id);
};

Watched.getAUserList = (username, result) => {
  sql.query(
    `SELECT movie.* FROM watched JOIN movie ON movie.movie_id = watched.movie_id where watched.username = "${username}"`,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

Watched.addToList = (watched, result) => {
  sql.query("INSERT INTO watched SET ?", watched, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Updated list: ", { ...watched });
    result(null, res);
  });
};

Watched.deleteFromList = (watched, result) => {
  sql.query(
    "DELETE FROM watched WHERE username = ? AND movie_id = ?",
    [watched.username, watched.movie_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(
        `Deleted: ${watched.id} from ${watched.username}'s watched list`
      );
      result(null, res);
    }
  );
};

module.exports = Watched;
