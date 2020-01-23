const logger = require("../../log/logger");
const users = require("../../data/schema/user-schema");
const checkin = require("../../data/schema/checkin-schema");

exports.getLazyAndBest = (req, res, next) => {
    totalMinutesPerWeek(Number(req.params.week)).then(dataperWeek => {
        let average = 0;
        dataperWeek.forEach(data => average = average + data.minutes);
        average = average / dataperWeek.length;
        res.status(200).json({
            best: dataperWeek[0],
            loosers: dataperWeek.slice(Math.max(dataperWeek.length - 2, 1)),
            average: average
        });
    });

}

async function totalMinutesPerWeek(numberOfWeek){
    let dataPerPin= [];
    let documents = await checkin.aggregate([
        {$match: {week: numberOfWeek}},
        {$group: {_id: "$pin", minutes: {$sum: "$minutes"}}},
        {$sort: {minutes: 1}},
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'pin',
                as: 'user'
              }
        },
        {
            $project: {
                user: {
                    _id: 0,
                    pin: 0,
                    image: 0,
                    achievements: 0
                  }
            }
        }
    ], 
        (error, documents) => {
            if(error) logger.warn(error.message);
        });

        documents.forEach( doc => {
            dataPerPin.push({
                pin: doc._id,
                minutes: doc.minutes,
                name: doc.user[0].name
            });
        });
    return dataPerPin;
}
