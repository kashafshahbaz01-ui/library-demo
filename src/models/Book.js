const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a book title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed"],
      default: "available",
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Book", BookSchema);