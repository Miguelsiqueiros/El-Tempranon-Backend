const assert = require('assert');

const request = require('supertest');
const app = require('../server');
const mongodbMemoryServer = require('./util/mongodb-in-memory');

const proxyRequire = require('proxyquire');

const userSchema = require('../src/data/schema/user-schema');

const mongoClientStub = {};
const mongodbMock = proxyRequire('../server', {
  './src/data/mongo-server': mongoClientStub
});

describe('Test register endpoint', () => {
  before(
    async () => (mongoClientStub.call = await mongodbMemoryServer.Connect())
  );
  it('/POST should create a user when a name is provided', done => {
    request(app.call())
      .post('/api/v1/users/create')
      .send({ name: 'dummyUser' })
      .set('Accept', 'application/json')
      .end((err, result) => {
        const pin = result.body.pin;
        assert.equal(result.status, 201);
        assert(pin >= 1000 && pin <= 9999);
        const user = userSchema.findOne(result);
        assert(user !== undefined);
        done();
      });
  });
  it('/POST should return bad request when name is not provided', done => {
    request(app.call())
      .post('/api/v1/users/create')
      .set('Accept', 'application/json')
      .expect(400, done);
  });
});
