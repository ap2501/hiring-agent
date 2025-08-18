const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// History schema (each entry has its own _id automatically)
const historySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },   // e.g., "Frontend Dev Search"
    jd: { type: String, required: true },      // job description text
    mode: { type: String, required: true },    // e.g., "quick", "full"
    results: { type: Object, required: true }, // search results
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true } // ✅ ensures each history entry has unique _id
);

// User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Array of embedded history documents
    searchHistory: [historySchema],
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
