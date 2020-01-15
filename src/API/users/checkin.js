const mongoClient = require('../../data/mongo-server');
const logger = require('../../log/logger');
const checkinSO = require('../../data/schema/checkin-schema');
const url = 'mongodb://localhost:27017/Tempranon';
//const MongoClientTest = require('mongodb').MongoClient;

module.exports = function(req, res) {
    const pin = req.body.pin
    if(pin === undefined || pin === null){
        res.status(404).send('PIN not found in request')
    }else{
        const date = new Date();
        if (validateCheckin(pin, date) === 0){
            const firstDateOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDateOfYear) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDateOfYear.getDay() + 1) / 7);
            const minutesToday = ((date.getHours()-8) * 60) + date.getMinutes();
            const currentDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            const check = new checkinSO({pin: pin, pto: false, date: currentDate, minutes: minutesToday, week: weekNumber});
            /*if(checkin(check)){
                res.status(200).send('Checked successfully')
            }else{
                res.status(500).send('Something went wrong')
            }*/
            res.status(200).send('Checked successfully')
        }else if (validateCheckin(pin, date) === 1){
            res.status(400).send('Invalid PIN')
        }else{
            res.status(400).send('User already checked today')
        }
    }
}

function validateCheckin(pin, date){
    if(pin.toString().length !== 4){
        return 1;
    }else{
        MongoClientTest.connect(url, function(err, db){
            if(err) return 2;
            const dbo = db.db("Tempranon");
            dbo.collection("checkin").find({pin : pin, date : {$regex : date.toLocaleDateString()}})
            .toArray(function(err, res){
                if(err) return logger.warn(err);
                if(res.length > 0){
                    console.log("ya checo hoy")
                    return 1;
                }else{
                    console.log("ve a checar")
                    return 0;
                }
                
                db.close();
            });
        });
    }
    return 0;
}

/*function checkin(check){
    MongoClientTest.connect(url, function(err, db) {
        if (err) return false;
        var dbo = db.db("Tempranon");
        dbo.collection("checkin").insertOne(check, function(err, res) {
          if (err) logger.warn(err);
          db.close();
        });
    });
    return true;
}*/