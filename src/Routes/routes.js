var express = require('express');
var router = express.Router();
var healthcheck = require('../API/healthcheck');
var createUser = require('../API/users/users');

router.get('/healthcheck', healthcheck);

router.post('/users/create', createUser);

module.exports = router;
