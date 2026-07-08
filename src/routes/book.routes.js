const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');






const { 
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getLibraryStats,
  getMyBorrowedBooks,
} = require('../controllers/book.controller');



// ==========================================
// PUBLIC ROUTES
// ==========================================


router.get('/', getAllBooks);


router.get('/:id', getBookById);

// ==========================================
// PROTECTED ROUTES (Requires Logged-In Token)
// ==========================================
// ==========================================
// PROTECTED ROUTES (Requires Logged-In Token)
// ==========================================
router.get('/member/profile/borrowed', protect, getMyBorrowedBooks); // <-- ADD THIS LINE
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);
router.put('/:id', protect, updateBook);


router.post('/:id/borrow', protect, borrowBook);


router.post('/:id/return', protect, returnBook);
router.put('/:id', protect, updateBook);

// ==========================================
// ADMIN EXCLUSIVE ENDPOINTS 
// ==========================================
// Aggregation Dashboard metric calculation path
router.get('/dashboard/analytics', protect, getLibraryStats);
router.post('/', protect, createBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;