const express = require("express");
const router = express.Router();
const healthcheck = require("../API/healthcheck");
const createUser = require("../API/users/register");
const checkin = require("../API/users/checkin");
const dashboard = require("../API/Dashboard/dashboard");
const dailyWinner = require("../API/users/daily-winner");


router.get("/healthcheck", healthcheck);

router.get("/dashboard/lazyAndBest/:week", dashboard.getLazyAndBest);

router.get("/dashboard/getweeklydata/:week", dashboard.getWeeklyData);

router.post("/users/create", createUser);

router.post("/users/checkin", checkin);

router.get("/users/daily-winner", dailyWinner);

module.exports = router;
