const momentjs = require('moment');
const faker = require('faker');
const userSchema = require('../../src/data/schema/user-schema');
const checkinSchema = require('../../src/data/schema/checkin-schema');
module.exports = async () => {
  const currentDate = momentjs().format('M/D/YYYY');
  const users = [];
  const pin = 1000;

  for (i = 0; i < 10; i++) {
    const name = faker.name.findName();
    users.push({
      name: name,
      pin: pin + i,
      email: `${name.trim()}@mail.com`
    });
  }

  const createdUsers = await userSchema.create(users);
  const checkin = [];
  createdUsers.map(async user => {
    checkin.push({
      user_id: `${user._id}`,
      pto: false,
      minutes: Math.floor(Math.random() * 100),
      date: currentDate.toString(),
      week: momentjs(currentDate).isoWeek()
    });
  });

  await checkinSchema.create(checkin);
};
