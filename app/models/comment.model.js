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
        result(err, null);
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

Comment.update = (comment, result) => {
  sql.query(
    "UPDATE comment SET comment = ? WHERE movie_id = ? AND username = ?",
    [comment.comment, comment.movie_id, comment.username],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Updated comment: ", { ...comment });
      result(null, { ...comment });
    }
  );
};

Comment.delete = (id, username, result) => {
  console.log(username);
  console.log(id);
  sql.query(
    "DELETE FROM comment WHERE username = ? AND movie_id = ?",
    [username, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

module.exports = Comment;
