const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("../models/user");

//---- Register route   -----// 
router
  .route("/")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    const { username, useremail, userpassword1, userpassword2 } = req.body;
    let errors = [];


    // Check required fields
    if(!username || !useremail || !userpassword1 || !userpassword2 ) {
      errors.push({msg: "Please fill in all fields"});
    }

    // Check passwords match
    if(userpassword1 !== userpassword2) {
      errors.push({msg: "Paswords do not match"});
    }

    // Check pass length
    if(userpassword1.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters"});
    }
    

    // Check if user already exists
    // The findOne method is an asynchronous method that waits for a response before executing its callback.
    User.findOne({ email: useremail}, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser !== null && foundUser.name === username ) {
          errors.push({ msg: "User name is already taken"});
        }
        if (foundUser !== null && foundUser.email === useremail) {
          errors.push({ msg: "Entered email is already registered" });
        }


        // if there are errors then re-render register fields
        if(errors.length > 0) {
          console.log(errors);
          res.render("register", {
            errors: errors,
            username: username,
            useremail: useremail,
            userpassword1: userpassword1,
            userpassword2: userpassword2
          });
        } else {
          // Encryption and registering to database goes here
          bcrypt.hash(req.body.userpassword1, saltRounds, function (err, hash) {
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
        }
      }
      
    });
    
    
  });

module.exports = router;
