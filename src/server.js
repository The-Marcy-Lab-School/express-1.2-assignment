/* eslint-disable no-shadow */
const path = require('path');
const express = require('express');
const Book = require('./model-books');

const app = express();

const publicDir = path.join(__dirname, '..', 'public');
const staticServer = express.static(publicDir);
app.use(staticServer);

app.use(express.json());

app.use((req, res, next) => {
  req.Book = Book;
  next();
});

// Put your routes here!


// We need this for our tests, it's a freebie!
app.delete('/books', (req, res) => {
  const { Book } = req;
  const result = Book.deleteAll();
  if (!result) return res.sendStatus(404);

  res.sendStatus(204);
});

module.exports = app;
