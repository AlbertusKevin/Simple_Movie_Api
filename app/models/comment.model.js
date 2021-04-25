const sql = require("./../database/db_conn");

const Comment = function (comment) {
  (this.username = comment.username),
    (this.movie_id = comment.movie_id),
    (this.comment = comment.comment);
};

Comment.getFromMovie = (movie_id, result) => {
  sql.query(
    "SELECT username, comment FROM comment where movie_id = ?",
    movie_id,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

Comment.create = (comment, result) => {
  sql.query("INSERT INTO comment SET ?", comment, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("saved comment: ", { ...comment });
    result(null, { ...comment });
  });
};

module.exports = Comment;
