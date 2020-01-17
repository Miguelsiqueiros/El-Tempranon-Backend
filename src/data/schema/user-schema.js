const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pin: Number,
  name: String,
  imageUrl: String
});

module.exports = mongoose.model("users", userSchema);
