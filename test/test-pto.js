const assert = require("assert");

const request = require("supertest");
const app = require("../server");
const mongodbMemoryServer = require("./util/mongodb-in-memory");

const proxyRequire = require("proxyquire");

const userSchema = require("../src/data/schema/user-schema");
const checkinSchema = require("../src/data/schema/checkin-schema");

const faker = require("faker");

const mongoClientStub = {};
const mongodbMock = proxyRequire("../server", {
  "./src/data/mongo-server": mongoClientStub
});

describe("Test pto endpoint", () => {
  let userId;
  let user;
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase();
    const userName = faker.name.findName();
    user = new userSchema({
      pin: 1111,
      email: `${userName}@hotmail.com`,
      name: userName
    });
    const userCreated = await userSchema.create(user);
    userId = userCreated._id;
  });
  it("/POST should create a pto when a pin and day is provided", done => {
    request(app.call())
      .post("/api/v1/users/pto")
      .send({ pin: user.pin, day: false })
      .set("Accept", "application/json")
      .end((err, result) => {
        const date = new Date();
        assert.equal(result.status, 201);
        const pto = checkinSchema.findOne({
          user_id: userId.str,
          date: { $regex: date.toLocaleDateString() }
        });
        assert(pto !== undefined);
        done();
      });
  });
  it("/POST should return bad request when pin is not provided", done => {
    request(app.call())
      .post("/api/v1/users/pto")
      .send({ day: false })
      .set("Accept", "application/json")
      .expect(422, done);
  });
  it("/POST should return bad request when day is not provided", done => {
    request(app.call())
      .post("/api/v1/users/pto")
      .send({ pin: user.pin })
      .set("Accept", "application/json")
      .expect(422, done);
  });
  it("/POST should return bad request when pin is invalid", done => {
    request(app.call())
      .post("/api/v1/users/pto")
      .send({ pin: 111, day: false })
      .set("Accept", "application/json")
      .expect(422, done);
  });
  it("/POST should return warning when pin doesn't exist", done => {
    request(app.call())
      .post("/api/v1/users/pto")
      .send({ pin: 2222, day: false })
      .set("Accept", "application/json")
      .expect(200, done);
  });
  it("/POST should return warning when the user already have a PTO", done => {
    request(app.call())
      .post("/api/v1/users/pto")
      .send({ pin: user.pin, day: false })
      .set("Accept", "application/json")
      .expect(200, done);
  });
});
