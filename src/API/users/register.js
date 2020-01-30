const logger = require('../../log/logger');
const users = require('../../data/schema/user-schema');

module.exports = function(req, res) {
  const { name, image } = req.body;

  if (!name) return res.status(400).send('Name is required');

  SelectRandomNumber().then(newPin => {
    const document = { pin: newPin, name: name, image: image };
    users.create(document, (error, doc) => {
      if (error) logger.warn(error.message);
      res.status(201).json(document);
    });
  });
};

async function SelectRandomNumber() {
  let randomPin = Math.round(Math.random() * 9999);
  let foundPin = await users.findOne({ pin: randomPin }, (error, doc) => {
    if (error) {
      logger.warn(error.message);
    }
  });
  if (foundPin) {
    SelectRandomNumber();
  } else {
    return randomPin;
  }
}
