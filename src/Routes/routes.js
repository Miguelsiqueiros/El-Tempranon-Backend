const express = require("express");
const router = express.Router();
<<<<<<< Updated upstream
const healthcheck = require("../API/healthcheck");
const createUser = require("../API/users/register");
const checkin = require("../API/users/checkin");
const dashboard = require("../API/Dashboard/dashboard");
const dailyWinner = require("../API/users/daily-winner");


router.get("/healthcheck", healthcheck);
=======

const createUser = require('../API/users/register');
const checkin = require('../API/users/checkin');
const dailyWinner = require('../API/users/daily-winner');
const dashboard = require('../API/Dashboard/dashboard');
const weeklyLadder = require('../API/users/weekly-ranking');

router.post('/users/create', createUser);
>>>>>>> Stashed changes

router.get('/dashboard/lazyAndBest/:week', dashboard.getLazyAndBest);

router.post("/users/create", createUser);

router.post("/users/checkin", checkin);

router.get("/users/daily-winner", dailyWinner);

module.exports = router;
