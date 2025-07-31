const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const recommendRoutes = require("./routes/recommend");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/bipartiteDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("🔗 Visit http://localhost:3000/api/recommend/U1 to get recommendations.");
});
app.use("/api/recommend", recommendRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});

