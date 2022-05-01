const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  avatar: {},
});

// Modelo

const User = mongoose.model("User", userSchema);

module.exports = User;
