const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let checkinSchema = new Schema({
  pin: Number,
  pto: Boolean,
  date: String,
  minutes: Number,
  week: Number
});

module.exports = mongoose.model("checkin", checkinSchema, "checkin");