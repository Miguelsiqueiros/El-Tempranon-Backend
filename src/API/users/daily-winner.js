const logger = require('../../log/logger');
const checkin = require('../../data/schema//checkin-schema');
const moment = require('moment');

module.exports = async function(req, res) {
  const currentDate = moment().format('M/D/YYYY');
  await checkin.aggregate(
    [
      { $match: { date: { $regex: currentDate.toString() } } },
      {
        $group: {
          _id: { $toObjectId: '$user_id' },
          minutes: { $first: '$minutes' },
          pto: { $first: '$pto' }
        }
      },
      { $sort: { minutes: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ],
    async (error, document) => {
      if (error) logger.warn(error.message);
      let users = [];
      await document.forEach(item => {
        users.push({
          name: item.user[0].name,
          totalMinutes: item.minutes,
          pto: item.pto
        });
      });
      res.status(200).json(users);
    }
  );
};
