const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pin: Number,
  name: String,
  image: String,
  email: String,
  arrival: Number
});

module.exports = mongoose.model("users", userSchema, "users");
