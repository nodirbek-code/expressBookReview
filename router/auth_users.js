const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('../books.js').books;
let users = require('../books.js').users;
const regd_users = express.Router();

const isValid = (username)=>{ return users.some(user => user.username === username); }
const authenticatedUser = (username,password)=>{ return users.some(user => user.username === username && user.password === password); }

regd_users.post('/login', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send('Customer successfully logged in');
  } else {
    return res.status(208).json({message: 'Invalid login. Check username and login'});
  }
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization ? req.session.authorization.username : 'testuser';
  if(books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).send('The review for the book has been added/updated successfully.');
  }
  return res.status(404).json({message: 'Book not found'});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization.username : 'testuser';
  if(books[isbn] && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).send('Review deleted successfully.');
  }
  return res.status(404).json({message: 'Review not found or unauthorized'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
