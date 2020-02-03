const logger = require("../../log/logger");
const checkin = require("../../data/schema/checkin-schema");
const users = require("../../data/schema/user-schema");
const moment = require("moment");
const { validationResult } = require("express-validator");

module.exports = function(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(422).json({ errores: errores.array() });
  const pin = req.body.pin;
  const date = new Date();
  users.findOne({ pin: pin }, (err, item) => {
    if (err) {
      logger.warn(err);
    }
    if (item) {
      let name = item.name;
      let id = item._id;
      checkin.findOne(
        { user_id: id, date: { $regex: date.toLocaleDateString() } },
        (err, item) => {
          if (!item) {
            try {
              const weekNumber = moment(moment().format("M/D/YYYY")).isoWeek();
              const minutesToday =
                (date.getHours() - 8) * 60 + date.getMinutes();
              const currentDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              const check = new checkin({
                user_id: id,
                pto: false,
                date: currentDate,
                minutes: minutesToday >= 0 ? minutesToday : 0,
                week: weekNumber
              });

              checkin.create(check, (err, item) => {
                if (err) logger.warn(err);
                if (item) {
                  let resp = {
                    info: `Welcome ${name}, you successfully checked in at ${currentDate}.`,
                    type: "success"
                  };
                  res.status(201).send(JSON.stringify(resp));
                } else {
                  let resp = {
                    info: `Failed to create Checkin.`,
                    type: "error"
                  };
                  res.status(200).send(JSON.stringify(resp));
                }
              });
            } catch (execptionError) {
              logger.warn(execptionError);
            }
          } else {
            let resp = {
              info: `${name}, you already checked in`,
              type: "warning"
            };
            res.status(200).send(JSON.stringify(resp));
          }
        }
      );
    } else {
      let resp = {
        info: `The PIN ${pin} you entered doesn't exist`,
        type: "error"
      };
      res.status(200).send(JSON.stringify(resp));
    }
  });
};
