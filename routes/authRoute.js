const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: "L'utilisateur existe déjà.",
      });
    }

    const user = new User({
      username,
      email,
      password,
      bio,
      firstName,
      lastName,
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès !",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: "",
        firstName: "",
        lastName: "",
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "La création du compte a échoué...",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email invalide." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe invalide" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Connecté !",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Connection impossible.", error: err.message });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const { username, email, bio, firstName, lastName } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email invalide." });
    }

    user.username = username;
    user.bio = bio;
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();

    res.json({
      message: "Modifié avec succès !",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Modification impossible.", error: err.message });
  }
});

module.exports = router;
