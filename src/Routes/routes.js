const express = require('express');
const router = express.Router();
const healthcheck = require('../API/healthcheck');
const createUser = require('../API/users/generate-pin');
const checkin = require('../API/users/checkin');

router.get('/healthcheck', healthcheck);

router.post('/users/create', createUser);

router.post('/users/checkin', checkin);

module.exports = router;
