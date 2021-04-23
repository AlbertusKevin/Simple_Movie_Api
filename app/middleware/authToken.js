const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const User = require("../models/userModel.js");

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"] || req.headers["x-access-token"] || '';
    if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (!token) {
        console.log('No Token');
        return res.status(403).send({
            status: "Failed",
            message: "No Token Provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log('Unauthorized');
            return res.status(401).send({
                status: "Failed",
                message: "Unauthorized!"
            });
        }

        req.username = decoded.username;
        next();
    });
};

function authorizeToken(username, callback) {
    User.getToken(username, (err, data) => {
        if (err) {
            console.log("error: ", err);
            return callback({message: "not_found"}, null);
        } else {
            let valid = false;
            if(data.token != null) {
                try {
                    jwt.verify(data.token, config.secret);
                    valid = true;
                    console.log('Token valid !');
                } catch (err) {
                    console.log('Token expired or null!');
                }

            }
            return callback(null, {valid: valid});
        }
    });
}

const authToken = {
    verifyToken: verifyToken,
    authorizeToken: authorizeToken
};

module.exports = authToken;
