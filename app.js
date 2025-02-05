const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const watchlistRoutes = require("./routes/watchListRoute");
const watchedRoutes = require("./routes/watchedRoute");
const userRoutes = require("./routes/userRoute");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Connecté à MongoDB avec succès !");
});

mongoose.connection.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB :", err);
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", authMiddleware, watchlistRoutes);
app.use("/api/watched", authMiddleware, watchedRoutes);
app.use("/api/user", authMiddleware, userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!", error: err.message });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(3200, () => {
  console.log("Serveur tourne sur le port 3200...");
});
