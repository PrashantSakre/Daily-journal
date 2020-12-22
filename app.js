//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Database connect
mongoose.connect("mongodb://localhost:27017/blogDB1", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb connected...."))
  .catch(err => console.log(err));

// Post Schema
const postSchema = {
  title: { type: String, required: false, unique: false},
  content: { type: String, required: false },
  postsDate: { type: Date, default: Date.now }
};

const Post = mongoose.model("Post", postSchema);

// UserSchema 
const userSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: false },
  posts: [ postSchema ],
  isloggedin: { type: Boolean, required: true }
});

const User = new mongoose.model("User", userSchema);

//----    Root route Section   ------//
app.get("/user/:userName", function(req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        setTimeout(function(){
          foundUser.isloggedin = false;
          foundUser.save(function(err) {
            if (err) {
              console.log(err);
            }
          })
        }, 300000);
        res.render("home", {
          startingContent: homeStartingContent,
          posts: foundUser.posts,
          user: foundUser.name
        });
      } else {
        console.log("user not logged in");
        res.render("error");
      }
    }
  });
  
});

app.post("/", function(req, res) {
  

});


//---   About Section   -------//
app.get("/user/:userName/about", function(req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        setTimeout(function(){
          foundUser.isloggedin = false;
          foundUser.save(function(err) {
            if (err) {
              console.log(err);
            }
          })
        }, 300000);
        res.render("about", {
          aboutContent: aboutContent,
          user: foundUser.name
        });
      } else {
        console.log("user not logged in");
        res.render("error");
      }
    }
  });

});

app.post("/about", function(req, res) {


})

//---   Contact Section   -------//
app.get("/user/:userName/contact", function(req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        setTimeout(function(){
          foundUser.isloggedin = false;
          foundUser.save(function(err) {
            if (err) {
              console.log(err);
            }
          })
        }, 300000);
        res.render("contact", {
          contactContent : contactContent,
          user: foundUser.name
        });
      } else {
        console.log("user not logged in");
        res.render("error");
      }
    }
  });


});

app.post("/contact", function(req, res) {
  
});

//--- Compose Section   --------//
app.get("/user/:userName/compose", function(req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        setTimeout(function(){
          foundUser.isloggedin = false;
          foundUser.save(function(err) {
            if (err) {
              console.log(err);
            }
          })
        }, 300000);
        res.render("compose", {
          user: foundUser.name
        })
      } else {
        console.log("user not logged in");
        res.render("error");
      }
    }
  });

});

app.post("/user/:userName/compose", function(req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        foundUser.posts.push({
          title: req.body.postTitle,
          content: req.body.postBody
        });

        foundUser.save(function(err) {
          if(!err) {
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


//---- Posts Section ----//
app.get("/posts/:userName/:postId",function(req, res) {
  const requestedUserName = req.params.userName;

  const requestedPostId = req.params.postId;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        setTimeout(function(){
          foundUser.isloggedin = false;
          foundUser.save(function(err) {
            if (err) {
              console.log(err);
            }
          })
        }, 300000);
        posts = foundUser.posts.id(requestedPostId);
        res.render("post", {
          user: foundUser.name,
          id: posts._id,
          title: posts.title,
          content: posts.content,
          date: posts.postsDate.toString()
        });

      } else {
        console.log("user not logged in");
        res.render("error");
      }
    }
  });

});

//---- Delete post user clicked Section ----//
app.post("/posts/:userName/:postId", function(req, res) {
  const requestedUserName = req.params.userName;

  const requestedPostId = req.params.postId;
  console.log(requestedPostId);

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        foundUser.posts.id(requestedPostId).remove();
        foundUser.save(function(err) {
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


app.post("/posts", function(req, res) {
  
});

// Login - section
app.get("/login", function(req, res) {
  res.render("signin");
});

app.post("/login", function(req, res) {
  console.log(req.body);
  const useremail = req.body.useremail;
  const password = req.body.userpassword;

  User.findOne({email: useremail}, function(err, founduser) {
    if (err) {
      console.log(err);
    } else {
      if (founduser == null) {
        res.render("error");
      } else if (!founduser.isloggedin || founduser.isloggedin) {
        bcrypt.compare(password, founduser.password, function(err, result) {
          // result == true
          if ( result === true ) {
            founduser.isloggedin = true;
            founduser.save(function(err) {
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

// Logout - section 
app.get("/user/:userName/logout", function(req, res) {
  const requestedUserName = req.params.userName;

  User.findOne({name: requestedUserName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isloggedin) {
        foundUser.isloggedin = false;
        foundUser.save(function(err) {
          if (!err) {
            res.redirect("/login");
          }
        });
      } else {
        console.log("user not logged in");
        res.render("error");
      }
    }
  });

})

// Register section
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register",  function(req, res) {
  console.log(req.body);
  bcrypt.hash(req.body.userpassword, saltRounds, function(err, hash) {
    const newUser = new User({
        name: req.body.username,
        password: hash,
        email: req.body.useremail,
        isloggedin: true
    });

    newUser.save(function(err){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/user/" + req.body.username);
        }
    });
  });

});




app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
