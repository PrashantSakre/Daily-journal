//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const { sortedIndex } = require('lodash');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { response } = require('express');
const PORT = process.env.PORT || 3000;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Database connect
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb connected...."))
  .catch(err => console.log(err));
mongoose.set("useCreateIndex", true);

const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// Database users Schema and model

const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  },
  posts: [postSchema]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//----    Root route Section   ------//
app.get("/home", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("home");
  } else {
    res.redirect("/users/login");
  }
//   // res.redirect("/login");
//   // Post.find({}, function(err, foundPosts){
//   //   if (err) {
//   //     console.log(err);
//   //   } else {
//   //     res.render("home", { 
//   //       startingContent: homeStartingContent,
//   //       posts: foundPosts});
//   //   }
//   // });
  
});

// app.post("/", function(req, res) {


// });


//---   About Section   -------//
app.get("/about", function(req, res) {
  res.render("about", { aboutContent: aboutContent })

});

app.post("/about", function(req, res) {


})

//---   Contact Section   -------//
app.get("/contact", function(req, res) {
  res.render("contact", { contactContent: contactContent });

});

app.post("/contact", function(req, res) {
  
});

//--- Compose Section   --------//
app.get("/compose", function(req, res) {
  res.render("compose");

});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });

});


//---- Posts Section ----//
app.get("/posts/:postId",function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, foundPost) {
    
      console.log(foundPost);
      res.render("post", {
        id: foundPost._id,
        title: foundPost.title,
        content: foundPost.content
      });
    
  });

});

//---- Delete post user clicked Section ----//
app.post("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  console.log(requestedPostId);

  Post.findOneAndDelete({_id: requestedPostId}, function(err, deletePost) {
    if (err) {
      console.log(err);
    } else {
      console.log(deletePost);
      res.redirect("/");
    }
  });
});


app.post("/posts", function(req, res) {
  
});

// Login - register section
app.get("/users/login", function(req, res) {
  res.render("signin");
});

app.post("/users/login", function(req, res) {
  // console.log(req.body);
  const user = new User({
    useremail: req.body.useremail,
    userpassword: req.body.userpassword
  });

  req.login(user, function(err) {
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      });
    }
  });

});

// Register section
app.get("/users/register", function(req, res) {
  res.render("register");
});

app.post("/users/register",  function(req, res) {
  User.register({username: req.body.useremail, name: req.body.username}, req.body.userpassword, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/users/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      });
    }
  });
});




app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}` );
});
