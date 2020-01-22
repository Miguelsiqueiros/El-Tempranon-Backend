const express = require('express');
const router = express.Router();
const healthcheck = require('../API/healthcheck');
const createUser = require('../API/users/register');
const checkin = require('../API/users/checkin');
const dailyWinner = require('../API/users/daily-winner');
const weeklyLadder = require('../API/users/weekly-ranking');

router.get('/healthcheck', healthcheck);

router.post('/users/create', createUser);

router.post('/users/checkin', checkin);

router.get('/users/daily-ladder', dailyWinner);

router.get('/users/weekly-ladder', weeklyLadder);

module.exports = router;
