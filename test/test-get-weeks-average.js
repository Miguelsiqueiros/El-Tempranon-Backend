const assert = require("assert");

const request = require("supertest");
const app = require("../server");

const mongodbMemoryServer = require("./util/mongodb-in-memory");
const mockData = require("./util/mock-data");


const checkinSchema = require("../src/data/schema/checkin-schema");
const usersSchema = require("../src/data/schema/user-schema");

const momentjs = require("moment");

const faker = require("faker");

describe("Get average per week endpoint", () => {
  const currentDate = momentjs().format("M/D/YYYY");
  before(async () => {
    await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase.call();
    await mockData.call();
  });
  it("/GET should return an array of objects with a number of Week and average of any week", done => {
    request(app.call())
      .get(`/api/v1/dashboard/weeksAverage/${faker.random.number({min:1, max: 12})}`)
      .end((error, result) => {
        assert.equal(result.status, 200);
        assert(result.body.WeeklyAverage.length > 0); 
        const hasFieldnumberOfWeek = 'numberOfWeek' in result.body.WeeklyAverage[0] ? true : false;
        const hasFieldAverage = 'average' in result.body.WeeklyAverage[0] ? true : false;
        assert(hasFieldnumberOfWeek);
        assert(hasFieldAverage);
        done();
      });
  });
  it("/GET should return a 422 status code if the numberOfWeeks is zero", done => {
    request(app.call())
      .get("/api/v1/dashboard/weeksAverage/0")
      .expect(422, done);
  });
  it("/GET should return a 422 status code if the numberOfWeeks is a negative number", done => {
    request(app.call())
      .get("/api/v1/dashboard/weeksAverage/-1")
      .expect(422, done);
  });
  it("/GET should return a 422 status code if the numberOfWeeks is a higher number than 12", done => {
    request(app.call())
      .get(`/api/v1/dashboard/weeksAverage/${faker.random.number({min:13})}`)
      .expect(422, done);
  });
});
