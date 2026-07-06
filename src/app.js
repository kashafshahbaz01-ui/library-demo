require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/book.routes"); // Tells Express where the route file is

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Allows Express to read incoming JSON data

// Routes
app.use(bookRoutes); // Hooks up your /books endpoints!

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "Server is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));