//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;


const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/users");
const posts = require("./routes/posts");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Database connect
mongoose.connect("mongodb://localhost:27017/blogDB1", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb connected...."))
  .catch(err => console.log(err));


app.get("/", function(req, res) {
  res.redirect("/login");
});

//----    Root route Section   ------//
app.use("/user", users);


//---- Posts Section ----//
app.use("/posts", posts);


// Login - section
app.use("/login", login);

// Register section
app.use("/register", register);





app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
