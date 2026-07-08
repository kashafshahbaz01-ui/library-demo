const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  }
}, { timestamps: true });

// ==========================================================
// PRE-SAVE HOOK: Automatically hashes passwords before saving
// ==========================================================
memberSchema.pre('save', async function () {
  // Only hash the password if it has been modified or is brand new
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash the password cleanly using async/await (No next argument needed)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================================
// CUSTOM METHOD: Compares entered plain-text with database hash
// ==========================================================
memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Member', memberSchema);