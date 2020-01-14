const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  pin: number
});

module.exports = userSchema;
