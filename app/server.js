const express = require("express");
const app = express();
const port = 3000;

// parse requests of content-type: application/json
app.use(express.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Connected to server" });
});

require("./routes/route_api")(app);
// set port, listen for requests
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
