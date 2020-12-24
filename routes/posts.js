const express = require("express");
const router = express.Router();
var User = require("../models/user");

router
  .route("/:userName/:postId")
  .get(function (req, res) {
    const requestedUserName = req.params.userName;

    const requestedPostId = req.params.postId;

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
          posts = foundUser.posts.id(requestedPostId);
          res.render("post", {
            user: foundUser.name,
            id: posts._id,
            title: posts.title,
            content: posts.content,
            date: posts.postsDate.toString(),
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  })
  //---- Delete post user clicked Section ----//
  .post(function (req, res) {
    const requestedUserName = req.params.userName;

    const requestedPostId = req.params.postId;
    console.log(requestedPostId);

    User.findOne({ name: requestedUserName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.isloggedin) {
          foundUser.posts.id(requestedPostId).remove();
          foundUser.save(function (err) {
            if (!err) {
              console.log("deleted post" + requestedPostId);
              res.redirect("/user/" + foundUser.name);
            }
          });
        } else {
          console.log("user not logged in");
          res.render("error");
        }
      }
    });
  });

module.exports = router;
