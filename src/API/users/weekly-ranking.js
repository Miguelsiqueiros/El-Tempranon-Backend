const logger = require("../../log/logger");
const checkin = require("../../data/schema/checkin-schema");
const moment = require("moment");

module.exports = function(req, res) {
  const weekNumber = moment(moment().format("M/D/YYYY")).isoWeek();
  checkin.aggregate(
    [
      {
        $match: {
          week: weekNumber
        }
      },
      {
        $group: {
          _id: { $toObjectId: "$user_id" },
          minutes: { $sum: "$minutes" }
        }
      },
      { $sort: { minutes: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ],
    (err, items) => {
      if (err) logger.warn(err);
      let users = [];
      items.map(user => {
        users.push({
          name: user.user[0].name,
          totalMinutes: user.minutes
        });
      });
      res.status(200).send(users);
    }
  );
};
