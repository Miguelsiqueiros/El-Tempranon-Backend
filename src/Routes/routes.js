const express = require("express");
const router = express.Router();

const createUser = require("../API/users/register");
const checkin = require("../API/users/checkin");
const dailyWinner = require("../API/users/daily-winner");
const dashboard = require("../API/Dashboard/dashboard");
const weeklyLadder = require("../API/users/weekly-ranking");
const PTO = require("../API/users/PTO");
const updateUser = require("../API/users/update-data");

const registerValidators = require("../API/validators/register-validator");
const ptoValidators = require("../API/validators/pto-validator");
const checkinValidators = require("../API/validators/checkin-validator");
const dashboardWeekValidators = require("../API/validators/dashboardWeek-validator");
const dashboardWeeksValidators = require("../API/validators/dashboardWeeks-validator");
const updateUserValidators = require("../API/validators/updateUser-validator");

router.post("/users/create", registerValidators, createUser);

router.get(
  "/dashboard/lazyAndBest/:week",
  dashboardWeekValidators,
  dashboard.getLazyAndBest
);

router.get(
  "/dashboard/getweeklydata/:week",
  dashboardWeekValidators,
  dashboard.getWeeklyData
);

router.get(
  "/dashboard/weeksAverage/:weeks",
  dashboardWeeksValidators,
  dashboard.getWeeksAverage
);

router.get(
  "/dashboard/oneweekarrival/:week",
  dashboardWeekValidators,
  dashboard.getOneWeekArrival
);

router.post("/users/checkin", checkinValidators, checkin);

router.get("/users/daily-ladder", dailyWinner);

router.get("/users/weekly-ladder", weeklyLadder);

router.post("/users/pto", ptoValidators, PTO);

router.put("/users/update", updateUserValidators, updateUser);

module.exports = router;
