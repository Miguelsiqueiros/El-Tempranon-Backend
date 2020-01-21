const logger = require('../../log/logger');
const checkin = require('../../data/schema//checkin-schema');
const moment = require('moment');

module.exports = async function(req, res) {
  const currentDate = moment().format('M/D/YYYY');
  await checkin.aggregate(
    [
      { $match: { date: { $regex: currentDate.toString() } } },
      {
        $lookup: {
          from: 'users',
          localField: 'pin',
          foreignField: 'pin',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 0,
          pto: 0,
          date: 0,
          week: 0,
          pin: 0,
          user: {
            _id: 0,
            pin: 0,
            imageUrl: 0
          }
        }
      },
      { $sort: { minutes: 1 } }
    ],
    (error, document) => {
      if (error) logger.warn(error.message);
      res.status(200).json(document);
    }
  );
};
