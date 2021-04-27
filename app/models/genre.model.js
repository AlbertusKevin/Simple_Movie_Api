const sql = require("./../database/db_conn");

const Genre = function (genre) {
  this.genre = genre.genre;
};

Genre.getAll = (result) => {
  sql.query("SELECT * FROM genre", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Genre: ", res);
    result(null, res);
  });
};

Genre.create = (newGenre, result) => {
  sql.query("INSERT INTO genre SET ?", newGenre, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created genre: ", { id: res.insertId, ...newGenre });
    result(null, { id: res.insertId, ...newGenre });
  });
};

Genre.delete = (genre_id, result) => {
  sql.query("DELETE FROM genre WHERE id = ?", genre_id, (err, res) => {
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
  });
};

Genre.update = (genre, id, result) => {
  sql.query(
    "UPDATE genre SET genre = ?  WHERE id = ?",
    [genre.genre, id],
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

module.exports = Genre;
