const express = require("express");
const router = express.Router();
var User = require("../models/user");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//--- User Home Page ----//
router
  .route("/:userName")
  .get(function (req, res) {
    const requestedUserName = req.params.userName;

    User.findOne({ name: requestedUserName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.isloggedin) {
          setTimeout(function () {
            foundUser.isloggedin = false;
            foundUser.save(function (err) {
              if (err) {
                console.log(err);
              }
            });
          }, 300000);
          res.render("home", {
            startingContent: homeStartingContent,
            posts: foundUser.posts,
            user: foundUser.name,
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  })
  .post(function (req, res) {});


//--- About page ----//
router
  .route("/:userName/about")
  .get(function (req, res) {
    const requestedUserName = req.params.userName;

    User.findOne({ name: requestedUserName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.isloggedin) {
          setTimeout(function () {
            foundUser.isloggedin = false;
            foundUser.save(function (err) {
              if (err) {
                console.log(err);
              }
            });
          }, 300000);
          res.render("about", {
            aboutContent: aboutContent,
            user: foundUser.name,
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  })
  .post(function (req, res) {});

//----  contact Page    -----//
router
  .route("/:userName/contact")
  .get(function (req, res) {
    const requestedUserName = req.params.userName;

    User.findOne({ name: requestedUserName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.isloggedin) {
          setTimeout(function () {
            foundUser.isloggedin = false;
            foundUser.save(function (err) {
              if (err) {
                console.log(err);
              }
            });
          }, 300000);
          res.render("contact", {
            contactContent: contactContent,
            user: foundUser.name,
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  })
  .post(function (req, res) {});

//---- Compose Page  ------//
router
  .route("/:userName/compose")
  .get(function (req, res) {
    const requestedUserName = req.params.userName;

    User.findOne({ name: requestedUserName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.isloggedin) {
          setTimeout(function () {
            foundUser.isloggedin = false;
            foundUser.save(function (err) {
              if (err) {
                console.log(err);
              }
            });
          }, 300000);
          res.render("compose", {
            user: foundUser.name,
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  })
  .post(function (req, res) {
    const requestedUserName = req.params.userName;

    User.findOne({ name: requestedUserName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.isloggedin) {
          foundUser.posts.push({
            title: req.body.postTitle,
            content: req.body.postBody,
          });

          foundUser.save(function (err) {
            if (!err) {
              res.redirect("/user/" + foundUser.name);
            } else {
              console.log(err);
            }
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  });


//---- users logout -----//
router.route("/:userName/logout").get(function (req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({ name: requestedUserName }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin || !foundUser.isloggedin) {
        foundUser.isloggedin = false;
        foundUser.save(function (err) {
          if (!err) {
            res.redirect("/login");
          }
        });
      } else {
        res.render("error");
      }
    }
  });
});

module.exports = router;
