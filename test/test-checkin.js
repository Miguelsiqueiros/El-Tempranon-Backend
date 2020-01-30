const assert = require('assert');
const proxyRequire = require('proxyquire');
const mongoClientStub = {};
const mongodbMock = proxyRequire('../server', {
  './src/data/mongo-server': mongoClientStub
});
const request = require('supertest');

const app = require('../server');
const mongodbMemoryServer = require('./util/mongodb-in-memory');

const userSchema = require('../src/data/schema/user-schema');
const checkinSchema = require('../src/data/schema/checkin-schema');

const momentjs = require('moment');

describe('Test checkin endpoint', () => {
  const newUser = { name: 'dummyUser', pin: 1234 };
  const currentDate = momentjs().format('M/D/YYYY');
  const existingCheckin = {
    user_id: 2500,
    pin: 2500,
    pto: false,
    minutes: Math.floor(Math.random() * 100),
    date: currentDate.toString(),
    week: momentjs(currentDate).isoWeek()
  };
  before(async () => {
    mongoClientStub.call = await mongodbMemoryServer.Connect();
    await userSchema.create(newUser);
    await userSchema.create({ name: 'dummyUser', pin: 2500 });
    await checkinSchema.create(existingCheckin);
  });
  it('/POST should checkin user if user exists', done => {
    request(app.call())
      .post('/api/v1/users/checkin')
      .set('Accept', 'application/json')
      .send({ pin: newUser.pin })
      .end((err, result) => {
        const checkin = checkinSchema.findOne({
          pin: newUser.pin,
          date: { $regex: currentDate.toString() }
        });
        assert.equal(result.status, 201);
        assert(checkin !== undefined);
        done();
      });
  });
  it('/POST should return a status code of 200 if user does not exist', done => {
    const fakePin = 9000;
    request(app.call())
      .post('/api/v1/users/checkin')
      .set('Accept', 'application/json')
      .send({ pin: fakePin })
      .expect(200, done);
  });
  it('/POST should return a bad request if pin is not 4 digits', done => {
    const threeDigitPin = Math.floor(Math.random() * 999);
    request(app.call())
      .post('/api/v1/users/checkin')
      .set('Accept', 'application/json')
      .send({ pin: threeDigitPin })
      .expect(400, done);
  });
  it('/POST should return a bad request if body is empty', done => {
    request(app.call())
      .post('/api/v1/users/checkin')
      .set('Accept', 'application/json')
      .send({})
      .expect(400, done);
  });
  it('/POST should return a status code of 200 if user already checked in', done => {
    request(app.call())
      .post('/api/v1/users/checkin')
      .set('Accept', 'application/json')
      .send({ pin: existingCheckin.user_id })
      .expect(200, done);
  });
});
