const mongoClient = require('../../data/mongo-server');
const logger = require('../../log/logger');
const checkinSO = require('../../data/schema/checkin-schema');

module.exports = function(req, res) {
    const pin = req.body.pin
    if(pin === undefined || pin === null || pin.toString().length !== 4){
        let resp = {status: `PIN ${pin} is invalid.`}
        res.status(400).send(JSON.stringify(resp))
    }else{
        mongoClient.then(client => {
            const date = new Date();
            const collectionCheckin = client.db('Tempranon').collection('checkin');
            const collectionUsers = client.db('Tempranon').collection('users');

            collectionUsers.find({pin:pin}).toArray(function (err, items){
                if(err) logger.warn(err)
                if(items.length <= 0){
                    let resp = {status: `Cannot found user with PIN ${pin}`}
                    res.status(204).send(JSON.stringify(resp));
                }else{
                    collectionCheckin.find({pin : pin, date : {$regex : date.toLocaleDateString()}}).toArray(function (err, item) {
                        if(err) logger.warn(err)
                        if(item.length > 0){
                            let resp = {status: `User with PIN ${pin} already checked today`}
                            res.status(200).send(JSON.stringify(resp));
                        }else{
                            try{
                                const firstDateOfYear = new Date(date.getFullYear(), 0, 1);
                                const pastDaysOfYear = (date - firstDateOfYear) / 86400000;
                                const weekNumber = Math.ceil((pastDaysOfYear + firstDateOfYear.getDay() + 1) / 7);
                                const minutesToday = ((date.getHours()-8) * 60) + date.getMinutes();
                                const currentDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                                const check = new checkinSO({pin: pin, pto: false, date: currentDate, minutes: minutesToday, week: weekNumber});
                    
                                collectionCheckin.insertOne(check, function(err, result){
                                    if(err) logger.warn(err)
                                });
                            }catch(execptionError){
                                logger.warn(execptionError)
                            }
                            let resp = {status: `Checked successfull`, date : `${currentDate}`}
                            res.status(201).send(JSON.stringify(resp));
                        }
                    });
                }
            });
        });
    }
}