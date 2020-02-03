const assert = require("assert");

const request = require("supertest");
const app = require("../server");
const mongodbMemoryServer = require("./util/mongodb-in-memory");

const userSchema = require("../src/data/schema/user-schema");
const faker = require("faker");

describe("Test register endpoint", () => {
  before(async () => {
    await mongodbMemoryServer.Connect();
    mongodbMemoryServer.clearDatabase();
  });
  it("/POST should create a user when a name and email is provided", done => {
    request(app.call())
      .post("/api/v1/users/create")
      .send({
        name: faker.name.findName(),
        email: `${faker.name.firstName().trim()}@email.com`
      })
      .set("Accept", "application/json")
      .end((err, result) => {
        const pin = result.body.pin;
        assert.equal(result.status, 201);
        assert(pin >= 1000 && pin <= 9999);
        const user = userSchema.findOne(result);
        assert(user !== undefined);
        done();
      });
  });
  it("/POST should return bad request when name is not provided", done => {
    request(app.call())
      .post("/api/v1/users/create")
      .send({ email: `${faker.name.firstName().trim()}@email.com` })
      .set("Accept", "application/json")
      .expect(422, done);
  });
  it("/POST should return bad request when email is not provided", done => {
    request(app.call())
      .post("/api/v1/users/create")
      .send({ name: `${faker.name.findName()}` })
      .set("Accept", "application/json")
      .expect(422, done);
  });
});
