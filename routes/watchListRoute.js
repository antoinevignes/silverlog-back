const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const WatchList = require("../models/watchListModel");

// POST
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { tmdbId } = req.body;

    const existingEntry = await WatchList.findOne({
      user: req.user._id,
      tmdbId,
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "Ce film est déjà dans votre watchlist" });
    }

    const watchlistEntry = await WatchList.create({
      user: req.user._id,
      tmdbId,
    });

    res.status(201).json(watchlistEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET
router.get("/", authMiddleware, async (req, res) => {
  try {
    const watchlist = await WatchList.find({ user: req.user._id })
      .sort({ addedAt: -1 })
      .select("tmdbId addedAt");

    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/:tmdbId", authMiddleware, async (req, res) => {
  try {
    const deletedEntry = await WatchList.findOneAndDelete({
      user: req.user._id,
      tmdbId: req.params.tmdbId,
    });

    if (!deletedEntry) {
      return res
        .status(404)
        .json({ message: "Film non trouvé dans la watchlist" });
    }

    res.json({ message: "Film retiré de la watchlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
