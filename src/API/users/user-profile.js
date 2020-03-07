const logger = require("../../log/logger");
const users = require("../../data/schema/user-schema");
const checkin = require("../../data/schema/checkin-schema");
const { validationResult } = require("express-validator");
const moment = require("moment");

exports.getUser = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty())
    return res.status(422).send({ errors: validationErrors.array() });
  try {
    await getUserData(req.params.pin).then(profileData => {
      if (profileData.name === "") {
        res.status(400).json({
          info: `The PIN ${req.params.pin} you entered doesn't exist`,
          type: "error"
        });
      } else if (profileData !== null) {
        res.status(200).send(profileData);
      } else {
        res.status(400).json({
          info: `Error retrieving data.`,
          type: "error"
        });
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

async function getUserData(userPin) {
  let profileData = {
    name: "",
    email: "",
    image: "",
    arrival: null,
    currentWeekAverage: null,
    lastWeekAverage: null
  };
  let user = await users.findOne({ pin: userPin }, (error, user) => {
    if (error) logger.error(error);
  });
  if (user !== null) {
    profileData.name = user.name;
    profileData.email = user.email;
    profileData.image = user.image;
    profileData.arrival = user.arrival;
    let currentWeek = moment(moment().format("M/D/YYYY")).isoWeek();
    let lastWeek = currentWeek - 1;
    let checkinsCurrentWeek = await checkin.aggregate(
      [
        { $match: { week: currentWeek, user_id: user._id.toString() } },
        {
          $group: {
            _id: "$user_id",
            totalMinutes: { $sum: "$minutes" },
            numberOfCheckins: { $sum: 1 }
          }
        }
      ],
      (error, checkins) => {
        if (error) logger.error(error);
      }
    );

    let checkinsLastWeek = await checkin.aggregate(
      [
        { $match: { week: lastWeek, user_id: user._id.toString() } },
        {
          $group: {
            _id: "$user_id",
            totalMinutes: { $sum: "$minutes" },
            numberOfCheckins: { $sum: 1 }
          }
        }
      ],
      (error, checkins) => {
        if (error) logger.error(error);
      }
    );

    if (checkinsCurrentWeek.length > 0) {
      profileData.currentWeekAverage =
        checkinsCurrentWeek[0].totalMinutes /
        checkinsCurrentWeek[0].numberOfCheckins;
    }

    if (checkinsLastWeek.length > 0) {
      profileData.lastWeekAverage =
        checkinsLastWeek[0].totalMinutes / checkinsLastWeek[0].numberOfCheckins;
    }
  }
  return profileData;
}
