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

describe('Test daily ladder endpoint', () => {
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase.call();
    await usersSchema.insertMany(mockData.users);
    await checkinSchema.insertMany(mockData.checkin);
  });
  it('/GET should return an array of users ordered by their delayed arrival in minutes', done => {
    request(app.call())
      .get('/api/v1/users/daily-ladder')
      .end((error, result) => {
        assert.equal(result.status, 200);
        console.log(result.body);
        assert.equal(result.body.length, mockData.users.length);
        const hasFieldName = 'name' in result.body[0] ? true : false;
        const hasFieldMinutes = 'totalMinutes' in result.body[0] ? true : false;
        const hasFieldPTO = 'pto' in result.body[0] ? true : false;
        assert(hasFieldName);
        assert(hasFieldMinutes);
        assert(hasFieldPTO);
        done();
      });
  });
});
