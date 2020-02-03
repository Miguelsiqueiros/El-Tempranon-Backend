const assert = require('assert');

const request = require('supertest');
const app = require('../server');

const mongodbMemoryServer = require('./util/mongodb-in-memory');
const mockData = require('./util/mock-data');

const checkinSchema = require('../src/data/schema/checkin-schema');
const usersSchema = require('../src/data//schema/user-schema');

describe('Test weekly ladder endpoint', () => {
  before(async () => {
    await mongodbMemoryServer.Connect().then(async () => {
      await mongodbMemoryServer.clearDatabase.call();
      await mockData.call();
    });
  });
  it('/GET should return a json response with', done => {
    request(app.call())
      .get('/api/v1/users/weekly-ladder')
      .end((error, result) => {
        assert.equal(result.status, 200);
        const hasFieldName = 'name' in result.body[0] ? true : false;
        const hasFieldTotalMinutes =
          'totalMinutes' in result.body[0] ? true : false;
        assert(hasFieldName);
        assert(hasFieldTotalMinutes);
        done();
      });
  });
});
