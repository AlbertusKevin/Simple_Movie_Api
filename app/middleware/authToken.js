const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        console.log('No Token');
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log('Unauthorized');
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        else
            console.log('Token exists');

        req.username = decoded.username;
        next();
    });
};

const authToken = {
    verifyToken: verifyToken,
};
module.exports = authToken;
