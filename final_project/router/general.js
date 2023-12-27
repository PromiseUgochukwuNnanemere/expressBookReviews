const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// In public_users.js
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Validate the username
  // In auth_users.js
const isValid = (username) => {
  return typeof username === 'string' && username.trim() !== '';
};

module.exports.isValid = isValid;


  // Perform additional password validation if needed

  // Add the new user to the list
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  // return res.status(300).json({message: "Yet to be implemented"});
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn.toString();  // Convert to string directly

  // Check if the ISBN is provided
  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found with the provided ISBN" });
  }

  // Book details found, send the response
  const bookDetails = books[isbn];
  res.json(bookDetails);
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorToSearch = req.params.author;

  // Check if the author is provided
  if (!authorToSearch) {
    return res.status(400).json({ message: "Author parameter is required" });
  }

  // Find books with the provided author
  const matchingBooks = Object.keys(books).reduce((result, isbn) => {
    const book = books[isbn];
    if (book.author === authorToSearch) {
      result[isbn] = book;
    }
    return result;
  }, {});

  // Check if any books were found
  if (Object.keys(matchingBooks).length === 0) {
    return res.status(404).json({ message: "No books found with the provided author" });
  }

  // Books found, send the response
  res.json(matchingBooks);
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const authorToSearch = req.params.title;

  // Check if the title is provided
  if (!authorToSearch) {
    return res.status(400).json({ message: "Title parameter is required" });
  }

  // Find books with the provided title
  const matchingBooks = Object.keys(books).reduce((result, isbn) => {
    const book = books[isbn];
    if (book.title === authorToSearch) {
      result[isbn] = book;
    }
    return result;
  }, {});

  // Check if any books were found
  if (Object.keys(matchingBooks).length === 0) {
    return res.status(404).json({ message: "No books found with the provided title" });
  }

  // Books found, send the response
  res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn.toString();  // Convert to string directly

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found with the provided ISBN" });
  }

  // Book reviews found, send the response
  const bookReviews = books[isbn].reviews;

  if (bookReviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for the provided ISBN" });
  }

  res.json(bookReviews);
});

module.exports.general = public_users;
