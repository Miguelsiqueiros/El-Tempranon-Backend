const logger = require('../../log/logger');
const checkin = require('../../data/schema/checkin-schema');
const moment = require('moment');

module.exports = function(req, res) {
  const weekNumber = moment(moment().format('M/D/YYYY')).isoWeek();
  checkin.aggregate(
    [
      {
        $match: {
          week: weekNumber
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'pin',
          foreignField: 'pin',
          as: 'user'
        }
      },
      {
        $group: {
          _id: { pin: '$pin', name: '$user.name' },
          totalMinutes: { $sum: '$minutes' }
        }
      },
      {
        $project: {
          _id: {
            pin: 0
          }
        }
      },
      {
        $sort: { totalMinutes: 1 }
      }
    ],
    (err, items) => {
      if (err) logger.warn(err);
      let users = [];
      items.map(user => {
        users.push({
          name: user._id.name[0],
          totalMinutes: user.totalMinutes
        });
      });
      res.status(200).send(users);
    }
  );
};
