const moment = require("moment");
const Cast = require("./../models/cast.model");

exports.insertCast = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Upload file
  if (req.file == undefined) {
    return res.status(400).send(`You must select a file.`);
  }

  const file = req.file.path;

  if (!file) {
    return res.status(400).send({
      status: false,
      data: "No File is selected.",
    });
  }

  // ambil path
  const img = req.file.filename;
  let date = new Date(newCast.dob).toISOString().slice(0, 19).replace("T", " ");

  const cast = new Cast({
    id: req.body.id,
    name: req.body.name,
    photo: img,
    miniBio: req.body.miniBio,
    link_profile: req.body.link_profile,
    dob: date,
    hometown: req.body.hometown,
    role: req.body.role,
  });

  Cast.insertNew(cast, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: `${err.message}. Some problem occured when trying to insert new cast data.`,
      });
    } else {
      res
        .status(200)
        .send({ status: "success", message: "New cast has been inserted." });
    }
  });
};

exports.getAllCast = (req, res) => {
  Cast.getAllCast((err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: `Some error occured while trying to get all cast. ${err.message}`,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Success get list of cast",
        cast: data,
      });
    }
  });
};

exports.getCastDetail = (req, res) => {
  Cast.getCastDetail(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: `${err.message} Some error occured while trying to get detal cast id ${req.params.id}`,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: `Success get a detail of cast by id ${req.params.id}`,
        cast: data,
      });
    }
  });
};

exports.updateData = (req, res) => {
  let img = "";

  if (Object.entries(req.body).length === 0) {
    return res.status(200).send({ message: "No data updated." });
  }

  // Upload file
  if (req.file != undefined) {
    const file = req.file.path;

    if (!file) {
      return res.status(400).send({
        status: false,
        data: "No File is selected.",
      });
    }

    // ambil path
    img = req.file.filename;
  }

  let newCast = new Cast({
    id: req.params.id,
    name: req.body.name,
    photo: img,
    miniBio: req.body.miniBio,
    link_profile: req.body.link_profile,
    dob: req.body.dob,
    hometown: req.body.hometown,
    role: req.body.role,
  });

  if (newCast.dob != undefined) {
    let date = new Date(newCast.dob)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    newCast.dob = date;
  }

  Cast.getCastDetail(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: `${err.message} Some error occured while trying to get old data cast by id ${req.params.id}`,
      });
    } else {
      const cast = JSON.parse(JSON.stringify(data))[0];
      if (newCast.name == undefined) {
        newCast.name = cast.name;
      }
      if (newCast.photo == "") {
        newCast.photo = cast.photo;
      }
      if (newCast.miniBio == undefined) {
        newCast.miniBio = cast.miniBio;
      }
      if (newCast.dob == undefined) {
        newCast.dob = cast.dob;
      }

      if (newCast.hometown == undefined) {
        newCast.hometown = cast.hometown;
      }
      if (newCast.link_profile == undefined) {
        newCast.link_profile = cast.link_profile;
      }
      if (newCast.role == undefined) {
        newCast.role = cast.role;
      }

      Cast.updateData(req.params.id, newCast, (err, data) => {
        if (err) {
          res.status(500).send({
            status: "error",
            message: `${err.message}. Some error occured while trying to update data.`,
          });
        } else {
          res.status(200).send({
            status: "success",
            message: "Data successfully updated",
            new_data: newCast,
          });
        }
      });
    }
  });
};