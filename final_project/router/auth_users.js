const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

//let users = [];
let users = [
    { username: "newuser", password: "password123" },
    // Add more user objects as needed
  ];
   

const isValidUsername = (username) => {
    // write code to check if the username is valid
    // For example, you may check if it meets certain criteria
    return typeof username === 'newuser' && username.trim() !== '';
  };
  
  const isValidPassword = (password) => {
    // write code to check if the password is valid
    // For example, you may check if it meets certain criteria
    return typeof password === 'password123' && password.trim() !== '';
  };
  
  const isValidCredentials = (username, password) => {
    // write code to check if username and password match the ones we have in records
    const user = users.find(user => user.username === username && user.password === password);
   // if (username === 'newuser' && typeof password === 'password123')
    
    return !!user;
  };

  const generateAccessToken = (username) => {
    // write code to generate an access token
    const secretKey = 'yourSecretKey';
    return jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  };

  regd_users.post("/login", (req, res) => {
    // Your login logic here
   // const { username, password } = req.body;
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Invalid username or password format" });
      }

    // Validate username and password
    // if (!isValidUsername(username) || !isValidPassword(password)) {
    //   return res.status(400).json({ message: 'Invalid username or password format' });
    // }
  
    // Check if user credentials are valid
    if (isValidCredentials(username, password)) {
      // Generate an access token
      const accessToken = generateAccessToken(username);
  
      // Set access token in the session
      req.session.accessToken = accessToken;
  
      res.json({ message: 'Login successful', accessToken });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });


// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    const accessToken = req.session.accessToken;
  
    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized - Please log in' });
    }
  
    jwt.verify(accessToken, 'yourSecretKey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }
  
      req.username = decoded.username;
      next();
    });
  };


// Add a book review
regd_users.put("/auth/review/:isbn", isAuthenticated, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.username;
  
    // Check if the book with the specified ISBN exists
    const bookIndex = books.findIndex(book => book.isbn === isbn);
  
    if (bookIndex !== -1) {
      // Check if the user has already posted a review for the same ISBN
      const existingReviewIndex = books[bookIndex].reviews.findIndex(r => r.username === username);
  
      if (existingReviewIndex !== -1) {
        // If the user has already posted a review, modify the existing one
        books[bookIndex].reviews[existingReviewIndex].review = review;
      } else {
        // If the user has not posted a review, add a new one
        books[bookIndex].reviews.push({ username, review });
      }
  
      return res.status(200).json({ message: 'Review added or modified successfully' });
    } else {
      return res.status(404).json({ message: 'Book not found with the specified ISBN' });
    }
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", isAuthenticated, (req, res) => {
    const { isbn } = req.params;
    const username = req.username;
  
    // Check if the book with the specified ISBN exists
    const bookIndex = books.findIndex(book => book.isbn === isbn);
  
    if (bookIndex !== -1) {
      // Filter and delete the reviews based on the session username
      books[bookIndex].reviews = books[bookIndex].reviews.filter(review => review.username !== username);
  
      return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Book not found with the specified ISBN' });
    }
  });



module.exports.authenticated = regd_users;
//module.exports.isValid = isValid;
module.exports.users = users;
