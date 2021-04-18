const User = require("../models/userModel.js");
const bcrypt = require('bcrypt');

exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err)
            res.status(400).send({
                message: err.message || "Some error occurred while retrieving users.",
            });
        else
            res.status(201).send({
                status: "Success",
                message: "List of Users has been retrieved.",
                user: data,
            });
    });
};

exports.findUser = (req, res) => {
    User.findByUsername(req.params.username, (err, data) => {
        if (err) {
            if (err.message === "not_found") {
                res.status(404).send({
                    message: `Not found User with username ${req.params.username}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with username " + req.params.username
                });
            }
        } else {
            res.status(201).send({
                status: "Success",
                message: "User with username " + req.params.username + " has been retrieved.",
                user: data,
            });
        }
    });
};

exports.register = (req, res) => {


    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }

    const salt = bcrypt.genSaltSync(10);

    // Create a User
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, salt)
    });

    // Save Customer in the database
    User.insertUser(user, (err, data) => {
        if (err)
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error occurred while creating the user.",
            });
        else
            res.status(200).send({
                status: "Success",
                message: req.body.username + " Registered Successfully !",
                data,
            });

    });
};

exports.login = (req, res) => {

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    User.login(user,(err) => {
        if (err) {
            if (err.message === "login_failed") {
                res.status(401).send({
                    status: "Failed",
                    error: `Username or password is incorrect ! `
                });
            } else {
                res.status(500).send({
                    status: "Failed",
                    error: err.message || "Error retrieving User with username " + req.params.username
                });
            }
        } else {
            res.status(201).send({
                status: "Success",
                message: "Login Success !",
            });
        }
    });
};

exports.updateUser = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.updateByUsername(req.params.username, new User(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: "Failed",
                    message: `Not found User with username ${req.params.username}.`
                });
            } else {
                res.status(500).send({
                    status: "Failed",
                    message: "Error updating User with with " + req.params.username
                });
            }
        } else res.status(201).send({
            status: "Success",
            message: "User " + req.params.username + " Updated Successfully ! ",
            data
        });
    });
};


