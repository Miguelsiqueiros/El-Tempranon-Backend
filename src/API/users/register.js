const logger = require("../../log/logger");
const users = require("../../data/schema/user-schema");

module.exports = function(req, res) {
  const { name, imageUrl } = req.body;

  SelectRandomNumber().then(newPin => {
    const document = { pin: newPin, name: name, imageUrl: imageUrl };
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
