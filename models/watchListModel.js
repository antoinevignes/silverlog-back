const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tmdbId: {
    type: Number,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

watchListSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model("WatchList", watchListSchema);
