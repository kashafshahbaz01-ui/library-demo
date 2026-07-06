const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// 1. CREATE a book (POST)
router.post("/books", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. READ all books (GET)
router.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. UPDATE a book by ID (PUT)
router.put("/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // returns the modified book data instead of old data
        );
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. DELETE a book by ID (DELETE)
router.delete("/books/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;