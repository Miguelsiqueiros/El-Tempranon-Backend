var express = require('express');

const app = express();

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.get('/HealthCheck', (req, res) => {
  return res.status(200).send('Ok');
});

app.listen(8080, () => console.log('Listening to port 8080'));
