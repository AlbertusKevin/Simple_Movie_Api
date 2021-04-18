const multer = require("multer");
const path = require("path");
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

// let storage = multer({
//   dest: "../../resources/img/movie",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

let uploadFile = multer({
  dest: "./../../resources/img/movie",
  fileFilter: imageFilter,
});
module.exports = uploadFile;
