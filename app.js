const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoute");

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

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET non défini");
  process.exit(1);
}

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!", error: err.message });
});

app.listen(3200, () => {
  console.log("Serveur tourne sur le port 3200...");
});
