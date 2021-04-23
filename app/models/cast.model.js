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
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Cast.getCastDetail = (id, result) => {
  sql.query(`SELECT * FROM cast WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Cast.insertNew = (cast, result) => {
  sql.query("INSERT INTO cast SET ?", cast, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Cast.updateData = (id, cast, result) => {
  sql.query("UPDATE cast SET ? WHERE id = ?", [cast, id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Cast;
