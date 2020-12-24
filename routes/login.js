const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router
  .route("/")
  .get(function (req, res) {
    res.render("signin");
  })
  .post(function (req, res) {
    console.log(req.body);
    const useremail = req.body.useremail;
    const password = req.body.userpassword;

    User.findOne({ email: useremail }, function (err, founduser) {
      if (err) {
        console.log(err);
      } else {
        if (founduser == null) {
          res.render("error");
        } else if (!founduser.isloggedin || founduser.isloggedin) {
          bcrypt.compare(password, founduser.password, function (err, result) {
            // result == true
            if (result === true) {
              founduser.isloggedin = true;
              founduser.save(function (err) {
                res.redirect("/user/" + founduser.name);
              });
            }
          });
        } else {
          console.log("login credintial false");
          res.render("error");
        }
      }
    });
  });

module.exports = router;
