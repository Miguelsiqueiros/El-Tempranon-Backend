const logger = require('../../log/logger');
const users = require('../../data/schema/user-schema');
const { validationResult } = require('express-validator');

module.exports = function(req, res) {
  const { name, image, email } = req.body;
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(422).json({ errores: errores.array() });

  SelectRandomNumber().then(newPin => {
    const document = { pin: newPin, name: name, image: image, email: email };
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
