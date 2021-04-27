const sql = require("./../database/db_conn");

const Cast = function (cast) {
  (this.id = cast.id),
    (this.name = cast.name),
    (this.photo = cast.photo),
    (this.dob = cast.dob),
    (this.hometown = cast.hometown),
    (this.link_profile = cast.link_profile),
    (this.miniBio = cast.miniBio),
    (this.role = cast.role);
};

Cast.getAllCast = (result) => {
  sql.query("SELECT photo, name, role FROM cast", (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Cast.getCastDetail = (id, result) => {
  sql.query(`SELECT * FROM cast WHERE id = ${id}`, (err, res) => {
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

    result({ kind: "not_found" }, null);
  });
};

Cast.insertNew = (cast, result) => {
  sql.query("INSERT INTO cast SET ?", cast, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Cast.updateData = (id, cast, result) => {
  sql.query("UPDATE cast SET ? WHERE id = ?", [cast, id], (err, res) => {
    if (err) {
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

module.exports = Cast;
