const logger = require("../../log/logger");
const users = require("../../data/schema/user-schema");
const { validationResult } = require("express-validator");

module.exports = async function(req, res) {
  const { name, image, email } = req.body;
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(422).json({ errores: errores.array() });

  if (await users.findOne({ email: email }))
    return res.status(409).json({ errores: "Email already in use." });

  SelectRandomNumber().then(newPin => {
    const user = new users({
      pin: newPin,
      name: name,
      image: image,
      email: email
    });

    users.create(user, (error, doc) => {
      if (error) logger.warn(error.message);
      res.status(201).json(user);
    });
  });
};

async function SelectRandomNumber() {
  let randomPin = Math.round(Math.random() * (9999 - 1000) + 1000);
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
