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
const usersSchema = require('../src/data//schema/user-schema');

const momentjs = require('moment');

describe('Lazy and best endpoint', () => {
  const currentDate = momentjs().format('M/D/YYYY');
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase.call();
    await usersSchema.insertMany(mockData.users);
    await checkinSchema.insertMany(mockData.checkin);
  });
  it('/GET should return best time, worst and average based on the week', done => {
    request(app.call())
      .get(`/api/v1/dashboard/lazyAndBest/${momentjs(currentDate).isoWeek()}`)
      .end((error, result) => {
        assert.equal(result.status, 200);
        const hasFieldBest = 'best' in result.body ? true : false;
        const hasFieldlosers = 'losers' in result.body ? true : false;
        const hasFieldAverage = 'average' in result.body ? true : false;
        assert(hasFieldBest);
        assert(hasFieldlosers);
        assert(hasFieldAverage);
        done();
      });
  });
  it('/GET should return a 422 status code if the week is zero', done => {
    request(app.call())
      .get('/api/v1/dashboard/lazyAndBest/0')
      .expect(422, done);
  });
  it('/GET should return a 422 status code if the week is a negative number', done => {
    request(app.call())
      .get('/api/v1/dashboard/lazyAndBest/-1')
      .expect(422, done);
  });
});
