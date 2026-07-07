const express = require("express");
const router = express.Router();

// 1. IMPORT CONTROLLERS (The Chefs)
const bookController = require("../controllers/book.controller");

// 2. IMPORT MIDDLEWARE (The Gatekeeper)
const { protect } = require("../middleware/auth.middleware");

// ==========================================
// ROUTE DEFINITIONS
// ==========================================

// Public Route (Anyone can browse books)
router.get("/books", bookController.getAllBooks);

// Protected Routes (Requires a valid JWT badge)
router.post("/books", protect, bookController.createBook);
router.put("/books/:id", protect, bookController.updateBook);
router.delete("/books/:id", protect, bookController.deleteBook);

module.exports = router;