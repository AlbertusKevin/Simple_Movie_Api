const sql = require("./../database/db_conn");

const User = function (user) {
    (this.username = user.username),
        (this.email = user.email),
        (this.name = user.name),
        (this.password = user.password);
};

User.getAll = (result) => {
    sql.query("SELECT * FROM users", (err, res) => {

        var queryResult;
        if (err) {
            console.log("error: ", err);
            queryResult = result(null, err);
        } else if (res.length){
            console.log("User ", res.length);
            queryResult = result(null, res);
        } else {
            console.log("User ", res);
            res.push("There is no record in database.")
            queryResult = result(null, res);
        }

        return queryResult;


    });
};

User.findByUsername = (username, result) => {
    sql.query(`SELECT * FROM users WHERE username = "${username}"`, (err, res) => {
        var queryResult;
        if (err) {
            console.log("error: ", err);
            queryResult = result(err, null);
        } else if (res.length) {
            console.log("found user: ", res[0]);
            queryResult = result(null, res[0]);
            return;
        } else {
            // not found Customer with the username
            queryResult = result({ message: "not_found" }, null);
        }

        return queryResult;


    });
};

User.login = (user, result) => {
    sql.query(`SELECT COUNT(*) AS 'count' FROM users WHERE username = "` + user.username + `" AND password = "` + user.password + `"`, (err, res) => {

        var queryResult;
        if (err) {
            console.log("error: ", err);
            queryResult = result(err, null);

        } else if (res[0].count == 1) {
            console.log("Username and Password Are Correct ! ");
            queryResult = result(null, res[0]);;
        } else {
            queryResult = result({ message: "login_failed" }, null);
        }

        return queryResult;


    });
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
    sql.query("UPDATE users SET email = ?, name = ?, password = ? WHERE username = ?", [user.email, user.name, user.password, username], (err, res) => {

        var queryResult;
        if (err) {
            console.log("error: ", err);
            queryResult = result(null, err);
            return;
        } else if (result.affectedRows > 0) {
            queryResult = result({kind: "not_found"}, null);
        } else {
            console.log("updated user: ", {username: username, ...user});
            queryResult = result(null, {username: username, ...user});
        }

        return queryResult;
    });
};

module.exports = User;
