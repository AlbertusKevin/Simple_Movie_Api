const sql = require("./../database/db_conn");

const Watchlist = function (rating) {
  (this.username = rating.username), (this.movie_id = rating.movie_id);
};

Watchlist.getAUserList = (username, result) => {
  sql.query(
    `SELECT movie.* FROM watchlist JOIN movie ON movie.movie_id = watchlist.movie_id where watchlist.username = "${username}"`,
    username,
    (err, res) => {
      console.log(res);
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

Watchlist.addToList = (watchlist, result) => {
  sql.query("INSERT INTO watchlist SET ?", watchlist, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Updated list: ", { ...watchlist });
    result(null, res);
  });
};

Watchlist.deleteFromList = (watchlist, result) => {
  sql.query(
    "DELETE FROM watchlist WHERE username = ? AND movie_id = ?",
    [watchlist.username, watchlist.movie_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(
        `Deleted: ${watchlist.id} from ${watchlist.username}'s watchlist`
      );
      result(null, res);
    }
  );
};

module.exports = Watchlist;
