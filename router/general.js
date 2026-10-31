const express = require('express');
let books = require('../books.js').books;
let users = require('../books.js').users;
const public_users = express.Router();

public_users.post('/register', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!users.some(user => user.username === username)) {
      users.push({'username': username, 'password': password});
      return res.status(200).json({message: 'Customer successfully registered. Now you can login'});
    } else {
      return res.status(404).json({message: 'User already exists!'});
    }
  }
  return res.status(404).json({message: 'Unable to register user.'});
});

public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered_books = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  return res.status(200).json(filtered_books);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered_books = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  return res.status(200).json(filtered_books);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
