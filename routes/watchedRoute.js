const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Watched = require("../models/watchedModel");

// POST
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { tmdbId, rating } = req.body;

    if (!tmdbId) {
      return res
        .status(400)
        .json({ message: "Veuillez rentrer un tmdbId valide." });
    }

    const existingEntry = await Watched.findOne({
      user: req.user._id,
      tmdbId,
    });

    if (existingEntry) {
      return res.status(400).json({ message: "Vous avez déjà vu ce film" });
    }

    const watchedEntry = await Watched.create({
      user: req.user._id,
      tmdbId,
      rating,
    });

    res.status(201).json(watchedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET

router.get("/", authMiddleware, async (req, res) => {
  try {
    const watched = await Watched.find({ user: req.user._id }).lean();

    const enrichedWatched = await Promise.all(
      watched.map(async (movie) => {
        try {
          const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
          };

          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.tmdbId}?language=fr-FR`,
            options
          );

          if (!response.ok) return null;

          const movieData = await response.json();
          return {
            ...movieData,
            rating: movie.rating,
          };
        } catch (error) {
          console.error(`Erreur TMDB pour ${movie.tmdbId}:`, error);
          return null;
        }
      })
    );

    const filteredList = enrichedWatched.filter(Boolean);
    res.status(200).json({ count: filteredList.length, results: filteredList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/:tmdbId", authMiddleware, async (req, res) => {
  try {
    const deletedEntry = await Watched.findOneAndDelete({
      user: req.user._id,
      tmdbId: req.params.tmdbId,
    });

    if (!deletedEntry) {
      return res.status(404).json({
        message: "Le film n'est pas dans la liste des films déjà vus.",
      });
    }

    res.json({ message: "Film retiré de la liste des films déjà vus." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
