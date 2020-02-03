const express = require('express');
const router = express.Router();

const createUser = require('../API/users/register');
const checkin = require('../API/users/checkin');
const dailyWinner = require('../API/users/daily-winner');
const dashboard = require('../API/Dashboard/dashboard');
const weeklyLadder = require('../API/users/weekly-ranking');

const registerValidators = require('../API/validators/register-validator');

router.post('/users/create', registerValidators, createUser);

router.get('/dashboard/lazyAndBest/:week', dashboard.getLazyAndBest);

router.get('/dashboard/getweeklydata/:week', dashboard.getWeeklyData);

router.post('/users/checkin', checkin);

router.get('/users/daily-ladder', dailyWinner);

router.get('/users/weekly-ladder', weeklyLadder);

module.exports = router;
