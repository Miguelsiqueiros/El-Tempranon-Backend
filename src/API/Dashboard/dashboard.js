const logger = require('../../log/logger');
const users = require('../../data/schema/user-schema');
const checkin = require('../../data/schema/checkin-schema');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.getLazyAndBest = (req, res, next) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(422).send({ errors: validationErrors.array()});
    let week = Number(req.params.week);
    totalMinutesPerWeek(week).then(async (dataperWeek) => {
            let average = 0;
            let losers = [];
            let winners = [];
            dataperWeek.forEach(data => average = average + data.minutes);
            average = average / dataperWeek.length;
            try{
                await calculateLosers(dataperWeek).then(result => {
                    if(result !== undefined)
                        losers = result;
                    else
                        logger.warn("dashboard/lazyAndBest : there less than 3 users with checkin this week.");
                });
            }
            catch(error){
                logger.error(error);
            }
            try{
                await calculateWinners(dataperWeek).then(result => {
                    if(result !== undefined)
                        winners = result;
                    else
                        logger.warn("dashboard/lazyAndBest : any users available this week.");
                });
            }
            catch(error){
                logger.error(error);
            }
        
            res.status(200).json({
                best: winners,
                losers: losers,
                average: average
            });
    });
}

exports.getWeeklyData = (req, res, next) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(422).send({ errors: validationErrors.array()});
    let week = Number(req.params.week);
    totalMinutesPerWeek(week).then(dataperWeek => {
        res.status(200).json({
            weeklyData: dataperWeek
        });
    });
};

exports.getWeeksAverage = (req, res, next) => {
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()) return res.status(422).send({ errors: validationErrors.array()});
  let weeks = Number(req.params.weeks);
  getLastWeeksData(weeks).then(averages => {
    (averages !== undefined) ? res.status(200).json({WeeklyAverage: averages}) : res.status(500).send("Internal Server Error");
  });
}
exports.getOneWeekArrival = (req, res, next) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(422).send({ errors: validationErrors.array()});
    timeArrivalPerDay(Number(req.params.week)).then(dataArrival => {
        res.status(200).json({
            dailyData: dataArrival
        });
    });
}

async function timeArrivalPerDay(numberOfWeek) {

    let dataArrival = [];
    try {
      let documents = await checkin.aggregate([
        {$match: {week: numberOfWeek}},
        {
          $group : { _id : 
            { $dayOfWeek: 
              { $dateFromString: 
                {
                  dateString: "$date"
                } 
              }
            }, 
            checkin: { $push: "$$ROOT" },

          }
        },
        { $unwind: { path: "$checkin" } },
        {
          "$addFields": {
              "userObj_id": {
                "$toObjectId": "$checkin.user_id"
              }
            }  
      },
      {
          $lookup: {
              from: 'users',
              localField: 'userObj_id',
              foreignField: '_id',
              as: 'user'
          }
      },
      {
          $project: {
            userObj_id: 0,
              minutes: 0,
              pto: 0, 
              user_id: 0,
           user: {
               _id: 0,
               pin:0,
               image: 0,
               achievements: 0
             }
          }
      }
     ],
         (error, documents) => {
         if(error) {
             logger.warn(error.message);
            }
     });
         let data = [];
         documents.forEach(doc => { 
            let date = moment(doc.date);
            if(doc.user.length < 1)
                logger.warn("checkin/getweeklydata: Not existing user");
            else {
                data.push({
                    week: (doc.checkin.week === undefined) ? 0 : doc.checkin.week,
                    day: (doc._id === undefined) ? 0 : doc._id,
                    hour: date.format('HH:mm'),
                    name: (doc.user[0].name === undefined) ? "none" : doc.user[0].name,
                    email: (doc.user[0].email === undefined) ? "none" : doc.user[0].email,
                    date: (doc.checkin.date === undefined) ? "none" : doc.checkin.date
                });
            } 
         });
         return data;
    }catch(error){
        logger.error(error);
    }
}

async function totalMinutesPerWeek(numberOfWeek) {
  let dataPerPin = [];
  let documents = await checkin.aggregate(
    [
      { $match: { week: numberOfWeek } },
      {
        $group: {
          _id: { $toObjectId: '$user_id' },
          minutes: { $sum: '$minutes' }
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
      if (error) logger.warn(error.message);
    }
  );
  documents.forEach(doc => {
     
    if (doc.user.length < 1) {
        logger.warn('checkin/getweeklydata: Not existing user');
    } else {
      dataPerPin.push({
        email: (doc.user[0].email == undefined) ? "none" : doc.user[0].email ,
        minutes: (doc.minutes == undefined) ? 0 : doc.minutes,
        name: (doc.user[0].name == undefined) ? "none" : doc.user[0].name
      });
    }
  });
  return dataPerPin;
}

async function calculateLosers(data) {
  if (data.length > 2) {
    let losers = [];
    let tempMaxMinutes;
    let loser = data[data.length - 1];
    losers.push(loser);
    tempMaxMinutes = loser.minutes;
    for (let i = data.length - 2; i > 0; i--) {
      if (data[i].minutes === tempMaxMinutes) losers.push(data[i]);
      else if (losers.length >= 2) break;
      else {
        losers.push(data[i]);
        tempMaxMinutes = data[i].minutes;
      }
    }
    return losers;
  } else {
    return undefined;
  }
}

async function calculateWinners(data) {
  let winners = [];
  let tempMinMinutes;
  if (data.length > 0) {
    let winner = data[0];
    winners.push(winner);
    tempMinMinutes = winner.minutes;
    if (data.length > 1) {
      for (let i = 1; i < data.length - 1; i++) {
        if (data[i].minutes === tempMinMinutes) winners.push(data[i]);
      }
    }
    return winners;
  } else {
    return undefined;
  }
}

async function getLastWeeksData(numberOfWeeks){
    const weekNumber = moment(moment().format('M/D/YYYY')).isoWeek();
    let averages = [];
    if((weekNumber - numberOfWeeks) < 0) numberOfWeeks = weekNumber;
    for(let i = (weekNumber-numberOfWeeks);i<weekNumber; i++ ){
        let average = 0;
        let dataperWeek = await totalMinutesPerWeek(i+1);
        dataperWeek.forEach(data => average = average + data.minutes);
        average = average / dataperWeek.length;
        averages.push({
            numberOfWeek: i+1,
            average: average
        });
    }
    return averages;
}

