const momentjs = require('moment');
const faker = require('faker');

function generateMockData() {
  const checkin = [];
  const users = [];
  const pin = 1000;
  for (i = 0; i < 10; i++) {
    users.push({
      name: faker.name.findName(),
      pin: pin + i
    });
  }
  const currentDate = momentjs().format('M/D/YYYY');
  users.map(user => {
    checkin.push({
      pin: user.pin,
      pto: false,
      minutes: Math.floor(Math.random() * 100),
      date: currentDate.toString(),
      week: momentjs(currentDate).isoWeek()
    });
  });
  return {
    users: users,
    checkin: checkin
  };
}

module.exports = generateMockData();
