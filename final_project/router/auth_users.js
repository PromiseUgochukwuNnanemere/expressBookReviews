// In auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [
  { username: "user1", password: "password1" }, // Example user, replace with actual users
  // Add more users as needed
];

const isValid = (username) => {
  return typeof username === 'string' && username.trim() !== '';
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate the username
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  // Authenticate the user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });

  // Save user credentials in the session
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Login successful", accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { comment } = req.body;

  // Check if the ISBN and comment are provided
  if (!isbn || !comment) {
    return res.status(400).json({ message: "ISBN and comment are required" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found with the provided ISBN" });
  }

  // Get the username from the session
  const username = req.user.username;

  // Check if the user has already posted a review for the given ISBN
  const existingReviewIndex = books[isbn].reviews.findIndex((review) => review.user === username);

  if (existingReviewIndex !== -1) {
    // Modify the existing review
    books[isbn].reviews[existingReviewIndex].comment = comment;
    return res.status(200).json({ message: "Review modified successfully", review: books[isbn].reviews[existingReviewIndex] });
  } else {
    // Add a new review
    books[isbn].reviews.push({ user: username, comment: comment });
    return res.status(201).json({ message: "Review added successfully", review: books[isbn].reviews[books[isbn].reviews.length - 1] });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Check if the ISBN is provided
  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found with the provided ISBN" });
  }

  // Get the username from the session
  const username = req.user.username;

  // Filter reviews to keep only those not belonging to the current user
  const updatedReviews = books[isbn].reviews.filter((review) => review.user !== username);

  // Check if any reviews were deleted
  if (updatedReviews.length === books[isbn].reviews.length) {
    return res.status(404).json({ message: "No reviews found for the provided ISBN and user" });
  }

  // Update the reviews for the book
  books[isbn].reviews = updatedReviews;

  return res.status(200).json({ message: "Review deleted successfully", reviews: updatedReviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
