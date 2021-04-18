const authToken  = require("../middleware/authToken");

module.exports = (app) => {
    const user = require("../controllers/userController.js");
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // User API
    app.get("/api/users", user.findAll, [authToken.verifyToken]);
    app.get("/api/user/:username", user.findUser, [authToken.verifyToken]);
    app.post("/api/login", user.login);
    app.post("/api/register", user.register);
    app.put("/api/user/update/:username", user.updateUser);
};
