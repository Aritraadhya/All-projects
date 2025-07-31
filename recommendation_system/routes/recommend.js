const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const currentUser = await User.findOne({ userId });
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const allUsers = await User.find({ userId: { $ne: userId } });

    const likedByOthers = new Map();

    for (const otherUser of allUsers) {
      const common = otherUser.likedProducts.filter(p => currentUser.likedProducts.includes(p));
      if (common.length > 0) {
        for (const product of otherUser.likedProducts) {
          if (!currentUser.likedProducts.includes(product)) {
            likedByOthers.set(product, (likedByOthers.get(product) || 0) + 1);
          }
        }
      }
    }

    const recommendations = [...likedByOthers.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 3); // Top 3 recommendations

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
});

module.exports = router;

