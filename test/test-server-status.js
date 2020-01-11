const request = require('supertest');

describe('Test server status', function() {
  const server = require('../server');

  it('/healthcheck should respond with a status code of 200', function(done) {
    request(server)
      .get('healthcheck')
      .expect(200, done);
  });
});
