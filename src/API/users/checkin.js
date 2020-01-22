const logger = require('../../log/logger');
const checkin = require('../../data/schema/checkin-schema');
const users = require('../../data/schema/user-schema');
const moment = require('moment');

module.exports = function(req, res) {
  const pin = req.body.pin;

  if (pin.toString().length === 4) {
    const date = new Date();
    users.findOne({ pin: pin }, (err, item) => {
      let name = item.name;
      if (err) {
        logger.warn(err);
      }
      if (item) {
        checkin.findOne(
          { pin: pin, date: { $regex: date.toLocaleDateString() } },
          (err, item) => {
            if (!item) {
              try {
                const weekNumber = moment(
                  moment().format('M/D/YYYY')
                ).isoWeek();
                const minutesToday =
                  (date.getHours() - 8) * 60 + date.getMinutes();
                const currentDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                const check = new checkin({
                  pin: pin,
                  pto: false,
                  date: currentDate,
                  minutes: minutesToday >= 0 ? minutesToday : 0,
                  week: weekNumber
                });

                checkin.create(check, (err, item) => {
                  if (err) logger.warn(err);
                  if (item) {
                    let resp = {
                      status: `Checked successfull`,
                      date: `${currentDate}`,
                      name: name
                    };
                    res.status(201).send(JSON.stringify(resp));
                  } else {
                    let resp = { status: `Error` };
                    res.status(200).send(JSON.stringify(resp));
                  }
                });
              } catch (execptionError) {
                logger.warn(execptionError);
              }
            } else {
              let resp = {
                status: `User with PIN ${pin} already checked today`
              };
              res.status(200).send(JSON.stringify(resp));
            }
          }
        );
      } else {
        let resp = { status: `Cannot found user with PIN ${pin}` };
        res.status(200).send(JSON.stringify(resp));
      }
    });
  } else {
    let resp = { status: `Invalid PIN ${pin}` };
    res.status(400).send(JSON.stringify(resp));
  }
};
