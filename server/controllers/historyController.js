const User = require("../models/User");

// @desc Add a new search history item
// @route POST /api/history
// @access Private
const addHistory = async (req, res) => {
  const { title, jd, mode, results } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const newHistory = {
      title,
      jd,
      mode,
      results,
      timestamp: new Date(),
    };

    user.searchHistory.push(newHistory);
    await user.save();

    res.status(201).json({ message: "History added", history: newHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all history for logged in user
// @route GET /api/history
// @access Private
const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("searchHistory");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.searchHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete one history item
// @route DELETE /api/history/:historyId
// @access Private
const deleteHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.searchHistory = user.searchHistory.filter(
      (h) => h._id.toString() !== req.params.historyId
    );

    await user.save();

    res.json({ message: "History item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addHistory, getHistory, deleteHistory };
