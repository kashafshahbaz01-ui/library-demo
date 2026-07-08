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
  // 👇 Step 1: Added the role field according to the brief requirements
  role: {
    type: String,
    enum: ['member', 'admin'], // Strict validation: only allow these two values 
    default: 'member'          // Automatically signs up users as standard members 
  }
}, { timestamps: true });

// Pre-save hook: Automatically hashes the password before saving a member to MongoDB [cite: 7, 18]
memberSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method: Compares submitted text password with the database hash during login [cite: 7]
memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Member", memberSchema);