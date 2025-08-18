const express = require("express");
const router = express.Router();
const { addHistory, getHistory, deleteHistory } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");


// Add new history
router.post("/", protect, addHistory);

// Get all history
router.get("/", protect, getHistory);

// Delete one history item
router.delete("/:historyId", protect, deleteHistory);

// GET a single history item by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const historyItem = user.searchHistory.id(req.params.id); // Mongoose subdocument lookup

    if (!historyItem) {
      return res.status(404).json({ message: "History item not found" });
    }

    res.json(historyItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
