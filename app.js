// this is it
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Express veikia normaliai');
});

app.listen('3001', console.log('Server running, port 3001'));
