const assert = require('assert');

const request = require('supertest');
const app = require('../server');

const mongodbMemoryServer = require('./util/mongodb-in-memory');
const mockData = require('./util/mock-data');

describe('Test daily ladder endpoint', () => {
  before(async () => {
    await mongodbMemoryServer.Connect().then(async () => {
      await mongodbMemoryServer.clearDatabase.call();
      await mockData.call();
    });
  });
  it('/GET should return an array of users ordered by their delayed arrival in minutes', done => {
    request(app.call())
      .get('/api/v1/users/daily-ladder')
      .end((error, result) => {
        assert.equal(result.status, 200);
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
