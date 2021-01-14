//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;

// require routes from routes folder
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/users");
const posts = require("./routes/posts");



const app = express();

// set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Database connect to local or mongodb Atlas
mongoose.connect("mongodb+srv://admin-prashant:"+process.env.ATLASPASSWORD+"@cluster0.po1ak.mongodb.net/blogDB1", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb connected...."))
  .catch(err => console.log(err));

//--- Root route -----//
app.get("/", function(req, res) {
  res.redirect("/login");
});

//---- route to the users ---//
app.use("/user", users);


//---- Posts route  ----//
app.use("/posts", posts);


//---- Login route -----//
app.use("/login", login);

//---- Register route  -----//
app.use("/register", register);





app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
