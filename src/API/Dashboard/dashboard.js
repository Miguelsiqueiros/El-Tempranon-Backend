const logger = require("../../log/logger");
const users = require("../../data/schema/user-schema");
const checkin = require("../../data/schema/checkin-schema");

exports.getLazyAndBest = (req, res, next) => {
    let week = Number(req.params.week);
    totalMinutesPerWeek(week).then(async (dataperWeek) => {
        if(week > 0 && week.toString().match("[0-9]+") && week < 53){
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
        }
        else{
            res.status(422).json({
                error: "Parameter should not be: zero, negative, alphanumeric or higher than 52."
            });
        }
    });
}

exports.getWeeklyData = (req, res, next) => {
    totalMinutesPerWeek(Number(req.params.week)).then(dataperWeek => {
        res.status(200).json({
            weeklyData: dataperWeek
        });
    });
}


async function totalMinutesPerWeek(numberOfWeek){
    let dataPerPin= [];
    let documents = await checkin.aggregate([
        {$match: {week: numberOfWeek}},
        {$group: {_id: {$toObjectId: "$user_id"}, minutes: {$sum: "$minutes"}}},
        {$sort: {minutes:1}},
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
            if(error) logger.warn(error.message);
        });
        documents.forEach(doc => {
            if(doc.user[0] === null){
                logger.warn("checkin/getweeklydata: Not existing user");
            }
            else {
                dataPerPin.push({
                    email: doc.user[0].email,
                    minutes: doc.minutes,
                    name: doc.user[0].name
                });
            } 
        });
    return dataPerPin;
}

async function calculateLosers(data){
    if(data.length > 2 ){
        let losers = [];
        let tempMaxMinutes;
        let loser = data[data.length - 1];
        losers.push(loser);
        tempMaxMinutes = loser.minutes;
        for (let i = data.length-2; i > 0; i--){
            if(data[i].minutes === tempMaxMinutes)
                losers.push(data[i]);
            else if(losers.length>=2)
                break;
            else{
                losers.push(data[i]);
                tempMaxMinutes = data[i].minutes;
            }
        }
        return(losers);
    }else{
        return(undefined);
    }
}

async function calculateWinners(data){
    let winners = [];
    let tempMinMinutes;
    if(data.length > 0){
        let winner = data[0];
        winners.push(winner);
        tempMinMinutes = winner.minutes;
        if(data.length > 1){
            for (let i = 1; i < data.length-1; i++){
                if(data[i].minutes === tempMinMinutes)
                    winners.push(data[i]);
            }
        }
        return(winners);
    }
    else{
        return(undefined);
    }
    
}