const Book = require("../models/Book");
// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error, could not retrieve books", error: error.message });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Protected
const createBook = async (req, res) => {
  try {
    const { title, author, status } = req.body;

    // Instantiating a new document instance from the Book Model
    const newBook = new Book({
      title,
      author,
      status,
    });

    // Clean, direct save operation to MongoDB
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: "Data validation failed, could not save book", error: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Protected
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found with that ID" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Protected
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found with that ID" });
    }

    res.status(200).json({ message: "Book successfully removed from library catalog" });
  } catch (error) {
    res.status(500).json({ message: "Server error, could not delete book", error: error.message });
  }
};

// Export all the chef functions so the router can use them!
module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};