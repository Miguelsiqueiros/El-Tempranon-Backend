const mongoClient = require('../../data/mongo-server');
const logger = require('../../log/logger');

module.exports = function(req, res) {
  let randomPin = Math.round(Math.random() * 9999);

  // let userPins = [];

  // const userPinsQuery = mongoClient.find({}, { _id: 0 }, function(error, db) {
  //   if (error) {
  //   }
  // });

  res.status(201).send(`${randomPin}`);
};
