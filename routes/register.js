const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("../models/user");

// Register section
router
  .route("/")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    console.log(req.body);
    bcrypt.hash(req.body.userpassword, saltRounds, function (err, hash) {
      const newUser = new User({
        name: req.body.username,
        password: hash,
        email: req.body.useremail,
        isloggedin: true,
      });

      newUser.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/user/" + req.body.username);
        }
      });
    });
  });

module.exports = router;
