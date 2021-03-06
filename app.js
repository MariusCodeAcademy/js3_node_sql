// this is it
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const path = require('path');

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  //   res.send('Express veikia normaliai');
});
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
  //   res.send('Express veikia normaliai');
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

// create table
app.get('/table/create', (req, res) => {
  const sql = `
  CREATE TABLE posts(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.send(err.stack);
      throw err;
    }
    console.log(result);
    res.json({ msg: 'lentele sukurta', result });
  });
});

// app.get('/authors/young' )

// add new post
app.get('/newpost', (req, res) => {
  // console.log('req.body', req.body);
  const newPost = {
    name: 'Janes',
    sex: 'female',
    age: 30,
    post_id: 8,
  };
  const sql = 'INSERT INTO authors SET ?';
  db.query(sql, newPost, (err, result) => {
    if (err) throw err.stack;
    res.redirect('/');
    // res.json({ msg: 'irasas sukurtas', result });
  });
});

// get all posts
app.get('/post', (req, res) => {
  const sql = 'SELECT * FROM posts';
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json(result);
  });
});

// get single post dynamically
app.get('/post/:id', (req, res) => {
  const sql = `SELECT * FROM posts WHERE id = ${db.escape(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json(result);
  });
});

// update post
app.get('/post/:id/update', (req, res) => {
  // is vartotjo formos gryzta atnaujinta title
  const newTitle = 'Updated Title';
  const sql = `UPDATE posts SET title = ${db.escape(newTitle)} WHERE id = ${db.escape(
    req.params.id
  )}`;
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.redirect('/allposts');
  });
});

// delete post
app.get('/post/:id/delete', (req, res) => {
  const sql = `DELETE FROM posts WHERE id = ${db.escape(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json({ delete: 'success', result });
  });
});

// get ids and titles
app.get('/post-ids', (req, res) => {
  const sql = 'SELECT id, title FROM posts';
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json(result);
  });
});

// creat authors table
app.get('/authors/create-table', (req, res) => {
  const sql = `
  CREATE TABLE \`nodesqljs3\`.\`authors\` ( 
    \`au_id\` INT(2) NOT NULL AUTO_INCREMENT , 
    \`name\` VARCHAR(30) NOT NULL , 
    \`sex\` VARCHAR(6) NOT NULL , 
    \`age\` INT(2) NOT NULL , 
    \`post_id\` INT(2) NOT NULL , 
    \`created_at\` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    PRIMARY KEY (\`au_id\`)) ENGINE = InnoDB;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ success: false, err: err.stack });
      throw err.stack;
    }
    console.log(result);
    res.json({ success: 'table created', result });
  });
});

// get author and posts
app.get('/authors-and-posts', (req, res) => {
  const sql = `
  SELECT posts.title, authors.name, authors.age
  FROM posts
  INNER JOIN authors
  ON posts.id = authors.post_id;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ success: false, err: err.stack });
      throw err.stack;
    }
    console.log(result);
    res.json({ success: true, result });
  });
});

app.listen('3001', console.log('Server running, port 3001'));
