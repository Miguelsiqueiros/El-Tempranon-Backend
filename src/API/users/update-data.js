const logger = require("../../log/logger");
const users = require("../../data/schema/user-schema");
const { validationResult } = require("express-validator");

module.exports = function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { pin, arrival, name, image } = req.body;

  users.update(
    { pin: pin },
    {
      $set: {
        arrival: arrival,
        name: name,
        image: image
      }
    },
    (err, item) => {
      if (err) {
        logger.warn(err);
      }
      if (item.nModified > 0) {
        let resp = {
          info: `User information updated succesful.`,
          type: "success"
        };
        res.status(200).send(JSON.stringify(resp));
      } else {
        let resp = {
          info: `Failed updating the information for user with PIN: ${pin}`,
          type: "error"
        };
        res.status(409).send(JSON.stringify(resp));
      }
    }
  );
};
