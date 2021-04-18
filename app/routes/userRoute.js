module.exports = (app) => {
    const user = require("../controllers/userController.js");

    // User API
    app.get("/api/users", user.findAll);
    app.get("/api/user/:username", user.findUser);
    app.post("/api/login", user.login);
    app.post("/api/register", user.register);
    app.put("/api/user/update/:username", user.updateUser);
};
