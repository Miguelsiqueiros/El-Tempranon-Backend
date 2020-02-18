const assert = require('assert');

const request = require('supertest');
const app = require('../server');

const mongodbMemoryServer = require('./util/mongodb-in-memory');
const mockData = require('./util/mock-data');
const mongoClientStub = {};
const proxyRequire = require('proxyquire');
const mongodbMock = proxyRequire('../server', {
  './src/data/mongo-server': mongoClientStub
});

const faker = require('faker');

const checkinSchema = require('../src/data/schema/checkin-schema');
const usersSchema = require('../src/data/schema/user-schema');

const momentjs = require('moment');

describe('User profile endpoint', () => {
  const currentDate = momentjs().format('M/D/YYYY');
  const dummyUser = {
    name: faker.name.findName(),
    email: `${faker.name.findName()}@email.com`,
    pin: 2100,
    image: `${faker.company}.com`
  };
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase.call();
    await usersSchema.insertMany(mockData.users);
    await checkinSchema.insertMany(mockData.checkin);
    await usersSchema.create(dummyUser);
    let createdUser = await usersSchema.findOne({ pin: dummyUser.pin });
    console.log(createdUser);
    await checkinSchema.create({
      user_id: createdUser._id.toString(),
      pto: false,
      minutes: Math.floor(Math.random() * 100),
      date: currentDate.toString(),
      week: momentjs(currentDate).isoWeek()
    });
    await checkinSchema.create({
        user_id: createdUser._id.toString(),
        pto: false,
        minutes: Math.floor(Math.random() * 100),
        date: currentDate.toString(),
        week: momentjs(currentDate).isoWeek() - 1
      });
  });
  it('/GET should return name, email, image, current week average and last week average', done => {
    request(app.call())
      .get(`/api/v1/users/user-profile/${dummyUser.pin}`)
      .end((error, result) => {
        assert.equal(result.status, 200);
        const hasFieldname = 'name' in result.body ? true : false;
        const hasFieldemail = 'email' in result.body ? true : false;
        const hasFieldimage = 'image' in result.body ? true : false;
        const hasFieldcurrentWeekAverage = 'currentWeekAverage' in result.body ? true : false;
        const hasFieldlastWeekAverage = 'lastWeekAverage' in result.body ? true : false;
        assert(hasFieldname);
        assert(hasFieldemail);
        assert(hasFieldimage);
        assert(hasFieldcurrentWeekAverage);
        assert(hasFieldlastWeekAverage);
        done();
      });
  });
  it('/GET should return a 422 status code if the pin length is lower than 4', done => {
    const threeDigitPin = Math.floor(Math.random() * 999);
    request(app.call())
      .get(`/api/v1/users/user-profile/${threeDigitPin}`)
      .expect(422, done);
  });
  it('/GET should return a 422 status code if the pin number is a negative number', done => {
    request(app.call())
      .get('/api/v1/users/user-profile/-1')
      .expect(422, done);
  });
  it("/GET should return a 422 status code if the week is alphanumeric", done => {
    request(app.call())
      .get(`/api/v1/users/user-profile/Hi12`)
      .expect(422, done);
  });
});
