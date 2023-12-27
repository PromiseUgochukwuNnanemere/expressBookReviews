// const express = require('express');
// let books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
// const public_users = express.Router();


// // In public_users.js
// public_users.post("/register", (req, res) => {
//   const { username, password } = req.body;

//   // Check if username and password are provided
//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password are required" });
//   }

//   // Check if the username already exists
//   const userExists = users.find((user) => user.username === username);
//   if (userExists) {
//     return res.status(409).json({ message: "Username already exists" });
//   }

//   // Validate the username
//   // In auth_users.js
// const isValid = (username) => {
//   return typeof username === 'string' && username.trim() !== '';
// };

// module.exports.isValid = isValid;


//   // Perform additional password validation if needed

//   // Add the new user to the list
//   users.push({ username, password });

//   return res.status(201).json({ message: "User registered successfully" });
// });


// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
//   // return res.status(300).json({message: "Yet to be implemented"});
// });


// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn.toString();  // Convert to string directly

//   // Check if the ISBN is provided
//   if (!isbn) {
//     return res.status(400).json({ message: "ISBN parameter is required" });
//   }

//   // Check if the book with the given ISBN exists
//   if (!books[isbn]) {
//     return res.status(404).json({ message: "Book not found with the provided ISBN" });
//   }

//   // Book details found, send the response
//   const bookDetails = books[isbn];
//   res.json(bookDetails);
// });


// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const authorToSearch = req.params.author;

//   // Check if the author is provided
//   if (!authorToSearch) {
//     return res.status(400).json({ message: "Author parameter is required" });
//   }

//   // Find books with the provided author
//   const matchingBooks = Object.keys(books).reduce((result, isbn) => {
//     const book = books[isbn];
//     if (book.author === authorToSearch) {
//       result[isbn] = book;
//     }
//     return result;
//   }, {});

//   // Check if any books were found
//   if (Object.keys(matchingBooks).length === 0) {
//     return res.status(404).json({ message: "No books found with the provided author" });
//   }

//   // Books found, send the response
//   res.json(matchingBooks);
// });


// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const authorToSearch = req.params.title;

//   // Check if the title is provided
//   if (!authorToSearch) {
//     return res.status(400).json({ message: "Title parameter is required" });
//   }

//   // Find books with the provided title
//   const matchingBooks = Object.keys(books).reduce((result, isbn) => {
//     const book = books[isbn];
//     if (book.title === authorToSearch) {
//       result[isbn] = book;
//     }
//     return result;
//   }, {});

//   // Check if any books were found
//   if (Object.keys(matchingBooks).length === 0) {
//     return res.status(404).json({ message: "No books found with the provided title" });
//   }

//   // Books found, send the response
//   res.json(matchingBooks);
// });

// //  Get book review
// public_users.get('/review/:isbn', function (req, res) {
//   const isbn = req.params.isbn.toString();  // Convert to string directly

//   // Check if the book with the given ISBN exists
//   if (!books[isbn]) {
//     return res.status(404).json({ message: "Book not found with the provided ISBN" });
//   }

//   // Book reviews found, send the response
//   const bookReviews = books[isbn].reviews;

//   if (bookReviews.length === 0) {
//     return res.status(404).json({ message: "No reviews found for the provided ISBN" });
//   }

//   res.json(bookReviews);
// });

// module.exports.general = public_users;







const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const public_users = express.Router();

// ... (other routes)

// Get the book list available in the shop using async-await and Axios
public_users.get('/books', async function (req, res) {
  try {
    // Assuming the books are available at an external API or some endpoint
    const response = await axios.get('https://example.com/api/books');
    
    const bookList = response.data;
    
    if (bookList.length === 0) {
      return res.status(404).json({ message: "No books found in the shop" });
    }

    res.json(bookList);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on Author using Promise callbacks
public_users.get('/author-promise/:author', function (req, res) {
  const authorToSearch = req.params.author;

  // Check if the author is provided
  if (!authorToSearch) {
    return res.status(400).json({ message: "Author parameter is required" });
  }

  // Fetch book details based on Author using Promise callbacks
  fetchBookDetailsByAuthorPromise(authorToSearch)
    .then((matchingBooks) => {
      if (Object.keys(matchingBooks).length === 0) {
        return res.status(404).json({ message: "No books found with the provided author" });
      }
      res.json(matchingBooks);
    })
    .catch((error) => {
      console.error("Error fetching book details by author:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book details based on Author using async-await and Axios
public_users.get('/author-async/:author', async function (req, res) {
  const authorToSearch = req.params.author;

  // Check if the author is provided
  if (!authorToSearch) {
    return res.status(400).json({ message: "Author parameter is required" });
  }

  try {
    // Fetch book details based on Author using async-await and Axios
    const response = await axios.get(`https://example.com/api/books/author/${authorToSearch}`);
    
    const matchingBooks = response.data;
    
    if (Object.keys(matchingBooks).length === 0) {
      return res.status(404).json({ message: "No books found with the provided author" });
    }

    res.json(matchingBooks);
  } catch (error) {
    console.error("Error fetching book details by author:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on Title using Promise callbacks
public_users.get('/title-promise/:title', function (req, res) {
  const titleToSearch = req.params.title;

  // Check if the title is provided
  if (!titleToSearch) {
    return res.status(400).json({ message: "Title parameter is required" });
  }

  // Fetch book details based on Title using Promise callbacks
  fetchBookDetailsByTitlePromise(titleToSearch)
    .then((matchingBooks) => {
      if (Object.keys(matchingBooks).length === 0) {
        return res.status(404).json({ message: "No books found with the provided title" });
      }
      res.json(matchingBooks);
    })
    .catch((error) => {
      console.error("Error fetching book details by title:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get all books based on Title using async-await and Axios
public_users.get('/title-async/:title', async function (req, res) {
  const titleToSearch = req.params.title;

  // Check if the title is provided
  if (!titleToSearch) {
    return res.status(400).json({ message: "Title parameter is required" });
  }

  try {
    // Fetch book details based on Title using async-await and Axios
    const response = await axios.get(`https://example.com/api/books/title/${titleToSearch}`);
    
    const matchingBooks = response.data;
    
    if (Object.keys(matchingBooks).length === 0) {
      return res.status(404).json({ message: "No books found with the provided title" });
    }

    res.json(matchingBooks);
  } catch (error) {
    console.error("Error fetching book details by title:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ... (other routes)

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn.toString();  // Convert to string directly

  // Check if the ISBN is provided
  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required" });
  }

  // Fetch book details using Promise callbacks
  fetchBookDetailsPromise(isbn)
    .then((bookDetails) => {
      if (!bookDetails) {
        return res.status(404).json({ message: "Book not found with the provided ISBN" });
      }
      res.json(bookDetails);
    })
    .catch((error) => {
      console.error("Error fetching book details:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book details based on ISBN using async-await and Axios
public_users.get('/isbn-async/:isbn', async function (req, res) {
  const isbn = req.params.isbn.toString();  // Convert to string directly

  // Check if the ISBN is provided
  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required" });
  }

  try {
    // Fetch book details using async-await and Axios
    const response = await axios.get(`https://example.com/api/books/${isbn}`);
    
    const bookDetails = response.data;
    
    if (!bookDetails) {
      return res.status(404).json({ message: "Book not found with the provided ISBN" });
    }

    res.json(bookDetails);
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ... (other routes)

module.exports.general = public_users;

// Function to fetch book details based on Author using Promise callbacks
function fetchBookDetailsByAuthorPromise(author) {
  return new Promise((resolve, reject) => {
    // Simulate asynchronous operation (e.g., fetching from a database or external API)
    setTimeout(() => {
      const matchingBooks = Object.keys(books).reduce((result, isbn) => {
        const book = books[isbn];
        if (book.author === author) {
          result[isbn] = book;
        }
        return result;
      }, {});
      resolve(matchingBooks);
    }, 500); // Simulate a delay of 500 milliseconds
  });
}

// Function to fetch book details based on Title using Promise callbacks
function fetchBookDetailsByTitlePromise(title) {
  return new Promise((resolve, reject) => {
    // Simulate asynchronous operation (e.g., fetching from a database or external API)
    setTimeout(() => {
      const matchingBooks = Object.keys(books).reduce((result, isbn) => {
        const book = books[isbn];
        if (book.title === title) {
          result[isbn] = book;
        }
        return result;
      }, {});
      resolve(matchingBooks);
    }, 500); // Simulate a delay of 500 milliseconds
  });
}

// Function to fetch book details using Promise callbacks
function fetchBookDetailsPromise(isbn) {
  return new Promise((resolve, reject) => {
    // Simulate asynchronous operation (e.g., fetching from a database or external API)
    setTimeout(() => {
      const bookDetails = books[isbn];
      resolve(bookDetails);
    }, 500); // Simulate a delay of 500 milliseconds
  });
}
