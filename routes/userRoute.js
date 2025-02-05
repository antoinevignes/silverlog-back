const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/edit", authMiddleware, async (req, res) => {
  try {
    const { username, email, bio, firstName, lastName } = req.body;
    const user = req.user;

    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé." });
      }
    }

    user.username = username;
    user.email = email;
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
