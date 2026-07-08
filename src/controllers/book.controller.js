const Book = require('../models/Book');

// 1. Create a brand new book (Protected - Admin Only)
const createBook = async (req, res) => {
  try {
    const { title, author, status } = req.body;
    
    const newBook = new Book({
      title,
      author,
      status
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Read All Books (Public - NOW WITH STAGE 8 PAGINATION PARSING)
const getAllBooks = async (req, res) => {
  try {
    // Read query strings from req.query. Convert them to base-10 integers.
    // If they aren't provided in the URL, default to Page 1 with a Limit of 10 books.
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    // Calculate how many records mongoose needs to skip past
    // Formula: (Current Page - 1) * Limit
    const skipIndex = (page - 1) * limit;

    // Get the total document count for pagination metadata tracking
    const totalBooks = await Book.countDocuments();

    // Query with modifiers applied
    const books = await Book.find({})
      .populate('borrowedBy', 'name email role')
      .skip(skipIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems: totalBooks,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalBooks / limit)
      },
      books: books
    });
  } catch (error) {
    res.status(500).json({ message: "Server error parsing paginated library list", error: error.message });
  }
};

// 3. Read Single Book by ID (Public - Populated)
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('borrowedBy', 'name email role');
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 4. Update an existing book's details (Protected)
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 5. Delete a book permanently (Protected - Admin Only)
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 6. Borrow a book (Protected)
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    if (book.status === 'borrowed') {
      return res.status(400).json({ message: "Book is already borrowed" });
    }
    
    const currentUser = req.user || req.member;

    book.status = 'borrowed';
    book.borrowedBy = currentUser._id;
    await book.save();
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 7. Return a book (Protected)
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.status === 'available' || !book.borrowedBy) {
      return res.status(400).json({ message: "Book is already inside the library inventory" });
    }
    
    const currentUser = req.user || req.member;

    const isOriginalBorrower = book.borrowedBy.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'admin';

    if (!isOriginalBorrower && !isAdmin) {
      return res.status(403).json({ 
        message: "Access denied. Only the original borrower or an admin can return this book." 
      });
    }

    book.status = 'available';
    book.borrowedBy = null;
    await book.save();
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 8. Library Dashboard Aggregation Statistics (Admin Only)
const getLibraryStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $facet: {
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          totalInventory: [
            { $count: "total" }
          ],
          checkedOutTitles: [
            { $match: { status: "borrowed" } },
            { $project: { _id: 0, title: 1, author: 1 } }
          ]
        }
      }
    ]);

    const rawStats = stats[0];
    const totalBooks = rawStats.totalInventory[0]?.total || 0;
    
    const breakdown = { available: 0, borrowed: 0 };
    rawStats.statusCounts.forEach(item => {
      breakdown[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalBooksInLibrary: totalBooks,
        availableOnShelf: breakdown.available,
        currentlyBorrowed: breakdown.borrowed
      },
      borrowedList: rawStats.checkedOutTitles
    });
  } catch (error) {
    res.status(500).json({ message: "Aggregation failed", error: error.message });
  }
};

// 9. Get all books borrowed by the logged-in member
const getMyBorrowedBooks = async (req, res) => {
  try {
    const currentUser = req.user || req.member;
    const myBooks = await Book.find({ borrowedBy: currentUser._id });

    res.status(200).json({
      success: true,
      count: myBooks.length,
      borrowedBooks: myBooks
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching member book history", error: error.message });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getLibraryStats,
  getMyBorrowedBooks
};