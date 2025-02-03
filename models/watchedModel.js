const mongoose = require("mongoose");

const watchedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tmdbId: {
    type: Number,
  },
  rating: { type: Number, required: false },
});

watchedSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model("Watched", watchedSchema);
