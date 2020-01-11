var express = require('express');
var router = express.Router();

router.get('/', (req, res) => res.status(200).send('Home'));

router.get('/healthcheck', (req, res) => res.status(200).send('OK'));

module.exports = router;
