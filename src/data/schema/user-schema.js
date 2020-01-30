const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pin: Number,
  name: String,
  image: String,
  email: String
});

module.exports = mongoose.model('users', userSchema, 'users');

