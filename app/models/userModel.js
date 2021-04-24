const sql = require("./../database/db_conn");
const bcrypt = require("bcrypt");

const User = function (user) {
  (this.username = user.username),
    (this.email = user.email),
    (this.name = user.name),
    (this.password = user.password);
};

User.getUsername = (token, result) => {
  sql.query(
    `SELECT username FROM users WHERE token = "${token}"`,
    (err, res) => {
      var queryResult;
      if (err) {
        queryResult = result(null, err);
      } else if (res.length) {
        queryResult = result(null, res);
      } else {
        res.push("There is no record in database.");
        queryResult = result(null, res);
      }

      return queryResult;
    }
  );
};

User.getAll = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    var queryResult;
    if (err) {
      console.log("error: ", err);
      queryResult = result(null, err);
    } else if (res.length) {
      console.log("User ", res.length);
      queryResult = result(null, res);
    } else {
      console.log("User ", res);
      res.push("There is no record in database.");
      queryResult = result(null, res);
    }

    return queryResult;
  });
};

User.findByUsername = (username, result) => {
  sql.query(
    `SELECT name, username, email FROM users WHERE username = "${username}"`,
    (err, res) => {
      var queryResult;
      if (err) {
        console.log("error: ", err);
        queryResult = result(err, null);
      } else if (res.length) {
        console.log("found user: ", res[0]);
        queryResult = result(null, res[0]);
      } else {
        // not found Customer with the username
        queryResult = result({ message: "not_found" }, null);
      }

      return queryResult;
    }
  );
};

User.login = (user, result) => {
  const username = user.username;
  sql.query(
    `SELECT password, token FROM users WHERE username = "${username}"`,
    (err, res) => {
      var queryResult;
      if (err) {
        console.log("error: ", err);
        queryResult = result(err, null);
      } else if (res.length) {
        const checkPassword = bcrypt.compareSync(
          user.password,
          res[0].password
        );
        if (checkPassword) {
          console.log("Username and Password Are Correct ! ");
          queryResult = result(null, res[0]);
        } else {
          queryResult = result({ message: "login_failed" }, null);
        }
      } else {
        queryResult = result({ message: "login_failed" }, null);
      }

      return queryResult;
    }
  );
};

User.insertUser = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { newUser });
    result(null, { newUser });
  });
};

User.updateByUsername = (username, user, result) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashedPassword;
  sql.query(
    "UPDATE users SET email = ?, name = ?, password = ? WHERE username = ?",
    [user.email, user.name, user.password, username],
    (err, res) => {
      var queryResult;
      if (err) {
        console.log("error: ", err);
        queryResult = result(null, err);
      } else if (result.affectedRows > 0) {
        queryResult = result({ message: "not_found" }, null);
      } else {
        console.log("updated user: ", { username: username, ...user });
        queryResult = result(null, { username: username, ...user });
      }

      return queryResult;
    }
  );
};

User.insertToken = (username, token, result) => {
  sql.query(
    `UPDATE users SET token = "${token}" WHERE username ="${username}"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      }

      console.log("Token Inserted to Database");
    }
  );
};

User.getToken = (username, result) => {
  sql.query(
    `SELECT token FROM users WHERE username ="${username}"`,
    (err, res) => {
      var queryResult;
      if (err) {
        console.log("error: ", err);
        queryResult = result(err, null);
      } else if (res.length) {
        console.log("found user: ", res[0]);
        queryResult = result(null, res[0]);
      } else {
        // not found the username in databse
        queryResult = result({ message: "not_found" }, null);
      }

      return queryResult;
    }
  );
};

module.exports = User;
