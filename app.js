// this is it
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');

// set up connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 8889,
  database: 'nodesqljs3',
});

// connect
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database !!!');
});

const app = express();

// middleWare
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Express veikia normaliai');
});

// create database
app.get('/createdb', (req, res) => {
  const sql = 'CREATE DATABASE nodesqljs3';
  db.query(sql, (err, result) => {
    if (err) throw err;
    // no errors
    console.log(result);
    res.send('nodesqljs3 duomenu baze sukurta');
  });
});

app.listen('3001', console.log('Server running, port 3001'));
