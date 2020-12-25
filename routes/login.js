const express = require("express");
const router = express.Router();
var User = require("../models/user");
const bcrypt = require("bcrypt");

router
  .route("/")
  .get(function (req, res) {
    res.render("signin");
  })
  .post(function (req, res) {
    const useremail = req.body.useremail;
    const password = req.body.userpassword;
    let errors = [];

    User.findOne({ email: useremail }, function (err, founduser) {
      if (err) {
        console.log(err);
      } else {
        if (founduser == null) {
          errors.push({ msg: "Entered Email is not correct"});
            res.render("signin", {
              errors: errors,
              useremail: useremail
            });
        } else if (!founduser.isloggedin || founduser.isloggedin) {
          bcrypt.compare(password, founduser.password, function (err, result) {
            // result == true
            if (result === true) {
              founduser.isloggedin = true;
              founduser.save(function (err) {
                res.redirect("/user/" + founduser.name);
              });
            } else {
              errors.push({ msg: "Entered Password is not correct"});
              res.render("signin", {
                errors: errors,
                useremail: useremail,
                userpassword: password
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
