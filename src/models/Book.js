const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'borrowed'],
    default: 'available'
  },
  // This field maps a specific book record back to the profile record of the member holding it
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);