const express = require('express');
const router = express.Router();

// Import all controller functions
const { 
  createBook, 
  getAllBooks, 
  getBookById, 
  updateBook, 
  deleteBook,
  borrowBook,
  returnBook
} = require('../controllers/book.controller');

// Import authentication & authorization middlewares
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Get all books (e.g., GET /api/books)
router.get('/', getAllBooks);

// Get single book by ID (e.g., GET /api/books/6a4cee...)
// Note: This must stay below broad actions but above sub-resource parameters if conflicts occur
router.get('/:id', getBookById);

// ==========================================
// 2. PROTECTED ACTIONS (Must be logged in)
// ==========================================

// Create a book
router.post('/', protect, createBook);

// Update a book's basic details
router.put('/:id', protect, updateBook);

// Borrow a book (e.g., POST /api/books/6a4cee.../borrow)
router.post('/:id/borrow', protect, borrowBook);

// Return a book (e.g., POST /api/books/6a4cee.../return)
router.post('/:id/return', protect, returnBook);

// ==========================================
// 3. ADMIN ONLY ACTIONS (Must be logged in AND an admin)
// ==========================================

// Delete a book
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;