const sql = require("./../database/db_conn");

const Genre = function (genre) {
  this.genre = genre.genre;
};

Genre.getAll = (result) => {
  sql.query("SELECT * FROM genre", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
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

module.exports = Genre;
