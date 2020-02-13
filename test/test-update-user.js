const request = require("supertest");
const app = require("../server");
const mongodbMemoryServer = require("./util/mongodb-in-memory");

const userSchema = require("../src/data/schema/user-schema");

const faker = require("faker");

const mongoClientStub = {};

describe("Test update user information endpoint", () => {
  let user;
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await mongodbMemoryServer.clearDatabase();
    const userName = faker.name.findName();
    user = new userSchema({
      pin: 1111,
      email: `${userName}@hotmail.com`,
      name: userName,
      arrival: 8,
      image: ""
    });
    await userSchema.create(user);
  });
});
it("/PUT should update the user information when pin, name, arrival and image are provided well", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 1111, name: "Jose", arrival: 7, image: "" })
    .set("Accept", "application/json")
    .expect(200, done());
});
it("/PUT should return bad request when name is not provided", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 1111, arrival: 7, image: "" })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when name is not string", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 1111, arrival: 7, image: "", name: 8 })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when arrival is not provided", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 1111, name: "Juan", image: "" })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when arrival is not a number", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 1111, arrival: "bad", image: "", name: "Juan" })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when image is not provided", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 1111, arrival: 7, name: "Juan" })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when pin is not a number", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: "1111", arrival: 8, image: "", name: "Juan" })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when pin is invalid", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ pin: 111, arrival: 8, image: "", name: "Juan" })
    .set("Accept", "application/json")
    .expect(422, done());
});
it("/PUT should return bad request when pin is not provided", done => {
  request(app.call())
    .put("/api/v1/users/update")
    .send({ arrival: 8, image: "", name: "Juan" })
    .set("Accept", "application/json")
    .expect(422, done());
});
