const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required for registration' });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Register the new user
  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: 'Registration successful', user: newUser });

});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   const bookList = books.map(book => {
//     return {
//       id: book.id,
//       title: book.title,
//       author: book.author,
//     };
//   });

//   const formattedOutput = JSON.stringify(bookList, null, 2);

//   return res.status(200).send(formattedOutput);
// });


public_users.get('/', (req, res) => {
    getBooks()
      .then((books) => {
        res.status(200).json(books);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });

  function getBooks() {
    return new Promise((resolve, reject) => {
      // Make a GET request using Axios
      axios.get('https://chijiokeobik-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }












// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;

//     // Find the book with the specified ISBN
//     const book = books.find(book => book.isbn === isbn);
  
//     if (book) {
//       // If the book is found, return its details
//       return res.status(200).json(book);
//     } else {
//       // If the book is not found, return a 404 response
//       return res.status(404).json({ message: 'Book not found' });
//     }
// });
  

//Get book details based on ISBN using Async-Await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const bookDetails = await getBookDetails(isbn);
      res.status(200).json(bookDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Function to get book details based on ISBN using Async-Await with Axios
  async function getBookDetails(isbn) {
    try {
      // Make a GET request using Axios
      const response = await axios.get(`https://chijiokeobik-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }













// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;

//     // Filter books by the specified author
//     const booksByAuthor = books.filter(book => book.author === author);
  
//     if (booksByAuthor.length > 0) {
//       // If books by the author are found, return their details
//       return res.status(200).json(booksByAuthor);
//     } else {
//       // If no books by the author are found, return a 404 response
//       return res.status(404).json({ message: 'No books found for the specified author' });
//     }

// });


public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const booksByAuthor = await getBooksByAuthor(author);
      res.status(200).json(booksByAuthor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Function to get book details based on author using Async-Await with Axios
  async function getBooksByAuthor(author) {
    try {
      // Make a GET request using Axios
      const response = await axios.get(`https://chijiokeobik-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }







// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;

//     // Filter books by the specified title
//     const booksByTitle = books.filter(book => book.title === title);
  
//     if (booksByTitle.length > 0) {
//       // If books by the title are found, return their details
//       return res.status(200).json(booksByTitle);
//     } else {
//       // If no books by the title are found, return a 404 response
//       return res.status(404).json({ message: 'No books found for the specified title' });
//     }
// });



      public_users.get('/title/:title', async (req, res) => {
        try {
          const title = req.params.title;
          const booksByTitle = await getBooksByTitle(title);
          res.status(200).json(booksByTitle);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      });
      
      // Function to get book details based on title using Async-Await with Axios
      async function getBooksByTitle(title) {
        try {
          // Make a GET request using Axios
          const response = await axios.get(`https://chijiokeobik-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`);
          return response.data;
        } catch (error) {
          throw error;
        }
      }






//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Find the book with the specified ISBN
    const book = books.find(book => book.isbn === isbn);
  
    if (book && book.reviews && book.reviews.length > 0) {
      // If the book is found and has reviews, return the reviews
      return res.status(200).json(book.reviews);
    } else {
      // If the book is not found or has no reviews, return a 404 response
      return res.status(404).json({ message: 'Book reviews not found for the specified ISBN' });
    }
});

module.exports.general = public_users;
