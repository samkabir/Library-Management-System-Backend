# 📖 Library Management API with Express, TypeScript & MongoDB - Backend

### 🎯 This project is a **Library Management System** using **Express**, **TypeScript**, and **MongoDB (via Mongoose)**.

### ✨ 🔧 Featues of this project

- 30 Books has been added to the MongoDB database.
- Proper schema validation
- Use of aggregation pipeline, instance method and pre, post mongoose middleware
- Filtering features
- Code Quality: Clean, readable code with meaningful names.
- API Structure: Followed industry standard endpoints and response formats.
- Error Handling: Handled invalid input, 404s, and validation errors.


## Installation Setup

1. Go to your preferred folder, and open terminal

```
git clone git@github.com:samkabir/Library-Management-System-Backend.git

```

2. Go to the repository folder and open terminal, and run

```
npm install

```
3. Run the server
```
npm run dev

```
4. Open Mongoose and Create a new collection and hit the following APIs

```
// 1. Create Book

POST ===>  http://localhost:5000/api/books

//body

{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}

// 2. Get All Books

GET  ===>  http://localhost:5000/api/books  or  http://localhost:5000/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5


// 3. Get Book by ID

GET  ===>  http://localhost:5000/api/books/:bookId


// 4. Get Book by ID

PUT  ===>  http://localhost:5000/api/books/:bookId

//body
{
  "copies": 50
}

// 5. Delete Book

DELETE  ===>  http://localhost:5000/api/books/:bookId

// 6. Borrow a Book

POST ===>  http://localhost:5000/api/borrow

//body

{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}


// 7. Borrowed Books Summary

GET  ===>  http://localhost:5000/api/borrow


```

* * *

Implemented and developed by Samiul Kabir