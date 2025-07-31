const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/bipartiteDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seed() {
  await User.deleteMany();
  await Product.deleteMany();

  const products = ["P1", "P2", "P3", "P4", "P5"];
  for (let pid of products) {
    await Product.create({ productId: pid });
  }

  await User.create({ userId: "U1", products: ["P1", "P2"] });
  await User.create({ userId: "U2", products: ["P2", "P3"] });
  await User.create({ userId: "U3", products: ["P3", "P4"] });
  await User.create({ userId: "U4", products: ["P4", "P5"] });

  console.log("Seeding done!");
  process.exit();
}

seed().catch(err => console.error("Seeding error:", err));

