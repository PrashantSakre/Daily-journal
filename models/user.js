
const mongoose = require("mongoose");

// Post Schema
const postSchema = {
    title: { type: String, required: false, unique: false},
    content: { type: String, required: false },
    postsDate: { type: Date, default: Date.now }
  };
  
  
  
  // UserSchema 
  const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: false },
    posts: [ postSchema ],
    isloggedin: { type: Boolean, required: true }
  });
  
  const User = new mongoose.model("User", userSchema);


  module.exports = User;