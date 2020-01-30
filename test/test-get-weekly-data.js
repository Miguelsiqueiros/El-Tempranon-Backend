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

const checkinSchema = require('../src/data/schema/checkin-schema');
const usersSchema = require('../src/data//schema/user-schema');

const momentjs = require('moment');

const faker = require('faker');

describe('Get weekly data endpoint', () => {
  const currentDate = momentjs().format('M/D/YYYY');
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase.call();
    await usersSchema.insertMany(mockData.users);
    await checkinSchema.insertMany(mockData.checkin);
  });
  it('/GET should return an array of objects with a pin, name and minutes of any week', done => {
    request(app.call())
      .get(`/api/v1/dashboard/getweeklydata/${momentjs(currentDate).isoWeek()}`)
      .end((error, result) => {
        assert.equal(result.status, 200);
        assert(result.body.weeklyData.length, mockData.users.length);
        const hasFieldPin = 'pin' in result.body.weeklyData[0] ? true : false;
        const hasFieldName = 'name' in result.body.weeklyData[0] ? true : false;
        const hasFieldMinutes =
          'minutes' in result.body.weeklyData[0] ? true : false;
        assert(hasFieldPin);
        assert(hasFieldName);
        assert(hasFieldMinutes);
        done();
      });
  });
  it('/GET should return a 422 status code if the week is zero', done => {
    request(app.call())
      .get('/api/v1/dashboard/getweeklydata/0')
      .expect(422, done);
  });
  it('/GET should return a 422 status code if the week is a negative number', done => {
    request(app.call())
      .get('/api/v1/dashboard/getweeklydata/-1')
      .expect(422, done);
  });
  it('/GET should return a 422 status code if the week is alphanumeric', done => {
    request(app.call())
      .get(`/api/v1/dashboard/getweeklydata/${faker.random.alphaNumeric()}`)
      .expect(422, done);
  });
});
