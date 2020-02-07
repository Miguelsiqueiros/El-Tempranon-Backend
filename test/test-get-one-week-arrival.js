const assert = require('assert');
const request = require('supertest');
const app = require('../server');
const mongodbMemoryServer = require('./util/mongodb-in-memory');
const mockData = require('./util/mock-data');
const faker = require('faker');
const momentjs = require('moment');

describe("Get one week arrival data", () => {
    const currentDate = momentjs().format("M/D/YYYY");
    before(async () => {
      await mongodbMemoryServer.Connect();
      await mongodbMemoryServer.clearDatabase.call();
      await mockData.call();
    });
    
    it('/GET should return day, hour, name, email and date based on the week', done => {
        request(app.call())
          .get(`/api/v1/dashboard/oneweekarrival/${momentjs(currentDate).isoWeek()}`)
          .end((error, result) => {
            assert.equal(result.status, 200);
            assert(result.body.dailyData.length > 0);
            const hasFieldday = 'day' in result.body.dailyData[0] ? true : false;
            const hasFieldhour = 'hour' in result.body.dailyData[0] ? true : false;
            const hasFieldname = 'name' in result.body.dailyData[0] ? true : false;
            const hasFieldemail = 'email' in result.body.dailyData[0] ? true : false;
            const hasFielddate = 'date' in result.body.dailyData[0] ? true : false;
            assert(hasFieldday);
            assert(hasFieldhour);
            assert(hasFieldname)
            assert(hasFieldemail);
            assert(hasFielddate)
            done();
          });
      });
    it("/GET should return a 422 status code if the week is zero", done => {
        request(app.call())
        .get("/api/v1/dashboard/getweeklydata/0")
        .expect(422, done);
    });
    it("/GET should return a 422 status code if the week is a negative number", done => {
        request(app.call())
          .get("/api/v1/dashboard/getweeklydata/-1")
          .expect(422, done);
    });
    it('/GET should return status code 200, when there is no data',  done => {
      mongodbMemoryServer.clearDatabase.call();
      request(app.call())
          .get(`/api/v1/dashboard/oneweekarrival/${momentjs(currentDate).isoWeek()}`)
          .end((error, result) => {
            assert.equal(result.status, 200);
            assert(result.body.dailyData.length === 0);
            done();
          });
    });
});
