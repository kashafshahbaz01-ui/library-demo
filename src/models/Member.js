const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Define the structural rules for a user profile
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true, // Prevents two accounts from sharing the same email address
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt dates
  }
);

// 2. The Pre-Save Hook: Scramble the password automatically before saving to database
userSchema.pre("save", async function (next) {
  // Only encrypt the password if it was actually modified (or is brand new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a secure cryptographic salt round sequence
    const salt = await bcrypt.genSalt(10);
    // Overwrite the plain-text password input with the new hashed string
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 3. Helper Method: Create a function to verify incoming passwords during login later
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Compile and export the model to use across our application
// Change this last line in src/models/Member.js:
module.exports = mongoose.model("Member", userSchema);