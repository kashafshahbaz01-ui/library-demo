const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// 1. IMPORT THE AUTH MIDDLEWARE
// Pulls in our custom security checkpoint guard function
const { protect } = require("../middleware/auth.middleware");

// ==========================================
// 🔓 PUBLIC ROUTES (No login required)
// ==========================================

// GET ALL BOOKS: GET /api/books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error, could not retrieve books", error: error.message });
  }
});

// ==========================================
// 🔒 PROTECTED ROUTES (Requires valid JWT Token)
// ==========================================

// CREATE A BOOK: POST /api/books
// Notice 'protect' is injected as a checkpoint before the async logic runs!
router.post("/books", protect, async (req, res) => {
  try {
    const { title, author, status } = req.body;

    const newBook = new Book({
      title,
      author,
      status,
    });

    const savedBook = await newMemberBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: "Data validation failed, could not save book", error: error.message });
  }
});

// UPDATE A BOOK: PUT /api/books/:id
router.put("/books/:id", protect, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // 'new: true' returns the modified document instead of the old one
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found with that ID" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
});

// DELETE A BOOK: DELETE /api/books/:id
router.delete("/books/:id", protect, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found with that ID" });
    }

    res.status(200).json({ message: "Book successfully removed from library catalog" });
  } catch (error) {
    res.status(500).json({ message: "Server error, could not delete book", error: error.message });
  }
});

module.exports = router;