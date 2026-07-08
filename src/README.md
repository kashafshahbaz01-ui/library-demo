# Library Book Lending API

This project is a RESTful backend API designed to manage a digital library database, including user authorization, book statuses, and secure role-based permissions.

## How to Run It

1. **Install Dependencies:**
   Run the following command in your terminal to install necessary modules:
   ```bash
   npm install
2. **Configure Environmental Variables**
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library-demo
JWT_SECRET=your_secret_key_here

3. **Run Developmental Server**
npm run dev

Method,Path,Description,Access Level
POST,/api/auth/register,Register a new profile,Public
POST,/api/auth/login,Log in and return a JWT token,Public
GET,/api/books,Retrieve all cataloged books,Public
GET,/api/books/:id,Fetch a specific book by ID,Public
POST,/api/books,Create and add a new book,Protected (Logged-In User)
PUT,/api/books/:id,Modify an existing book's details,Protected (Logged-In User)
POST,/api/books/:id/borrow,Borrow a book (Changes status to borrowed),Protected (Logged-In User)
POST,/api/books/:id/return,Return a book (Changes status to available),Protected (Logged-In User)
DELETE,/api/books/:id,Permanently delete a book,Protected (Admin Only)