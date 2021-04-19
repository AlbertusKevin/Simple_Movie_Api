const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");

verifyToken = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

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

const authToken = {
    verifyToken: verifyToken,
};
module.exports = authToken;
