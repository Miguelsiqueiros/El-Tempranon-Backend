const logger = require("../../log/logger");
const checkin = require("../../data/schema/checkin-schema");
const users = require("../../data/schema/user-schema");
const moment = require("moment");

module.exports = function(req, res) {
  if ("pin" in req.body && "day" in req.body) {
    const { pin, day } = req.body;

    if (isValidNumber(pin)) {
      users.findOne({ pin: pin }, (err, item) => {
        if (err) {
          logger.warn(err);
        }
        if (item) {
          let id = item._id;
          let name = item.name;
          const date = new Date();
          if (!day) {
            date.setDate(date.getDate() - 1);
          }
          const currentDate = `${date.toLocaleDateString()}`;
          checkin.findOne(
            { user_id: id, date: { $regex: date.toLocaleDateString() } },
            (err, item) => {
              if (err) {
                logger.warn(err);
              }
              if (!item) {
                try {
                  const weekNumber = moment(
                    moment().format("M/D/YYYY")
                  ).isoWeek();
                  checkin.find(
                    { user_id: id, week: weekNumber - 1 },
                    (err, items) => {
                      if (err) {
                        logger.warn(err);
                      }
                      let average = 0;
                      if (items) {
                        let totalMinutes = 0;
                        items.map(item => {
                          totalMinutes = totalMinutes + item.minutes;
                        });
                        average = Math.round(totalMinutes / items.length);
                      }
                      const currentDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                      const check = new checkin({
                        user_id: id,
                        pto: true,
                        date: currentDate,
                        minutes: average >= 0 ? average : 0,
                        week: weekNumber
                      });
                      checkin.create(check, (err, item) => {
                        if (err) logger.warn(err);
                        if (item) {
                          let resp = {
                            info: `PTO successfully created, your penalization time is ${
                              average >= 0 ? average : 0
                            } minutes`,
                            type: "success"
                          };
                          res.status(201).send(JSON.stringify(resp));
                        } else {
                          let resp = {
                            info: `Something went wrong`,
                            type: "error"
                          };
                          res.status(200).send(JSON.stringify(resp));
                        }
                      });
                    }
                  );
                } catch (execptionError) {
                  logger.warn(execptionError);
                }
              } else {
                let resp = {
                  info: `${name}, you already have a PTO for ${currentDate}`,
                  type: "warning"
                };
                res.status(200).send(JSON.stringify(resp));
              }
            }
          );
        } else {
          let resp = {
            info: `The PIN you entered doesn't exist`,
            type: "error"
          };
          res.status(200).send(JSON.stringify(resp));
        }
      });
    } else {
      let resp = {
        info: `Please enter a valid PIN`,
        type: "warning"
      };
      res.status(400).send(JSON.stringify(resp));
    }
  } else {
    let resp = {
      info: `Enter your PIN number and select a day`,
      type: "warning"
    };
    res.status(400).send(JSON.stringify(resp));
  }
};

function isValidNumber(pin) {
  const number = parseInt(pin);
  if (!isNaN(number) && number.toString().length === 4) {
    return true;
  } else {
    return false;
  }
}