const mongoClient = require('../../data/mongo-server');
const logger = require('../../log/logger');

module.exports = function(req, res) {
  const { name, imageUrl } = req.body;

  if (!name) {
    res.status(400).send('Name is required');
  } else {
    mongoClient.then(client => {
      const collection = client.db('Tempranon').collection('users');

      collection.find({}).toArray((error, items) => {
        if (error) {
          logger.warn(error);
        } else {
          let pins = [];

          items.map(item => {
            pins.push(item.pin);
          });

          let newPin = { pin: SelectRandomNumber(pins) };

          try {
            collection.insertOne({
              pin: newPin,
              name: name,
              imageUrl: imageUrl
            });
          } catch (exceptionError) {
            logger.warn(exceptionError);
          }
          res.status(201).send(JSON.stringify(newPin));
        }
      });
    });
  }
};

function SelectRandomNumber(currentPins) {
  while (true) {
    let randomPin = Math.round(Math.random() * 9999);

    if (!currentPins.includes(randomPin)) return randomPin;
  }
}
