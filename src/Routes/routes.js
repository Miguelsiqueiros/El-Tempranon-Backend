const express = require('express');
const router = express.Router();
const healthcheck = require('../API/healthcheck');
const createUser = require('../API/users/generate-pin');

router.get('/healthcheck', healthcheck);

router.post('/users/create', createUser);

module.exports = router;
