const express = require("express");
const router = express.Router();
const Farm = require("../models/Farm");

// Save farm details
router.post("/", async (req, res) => {
  try {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    res.status(201).json({ message: "Farm data saved successfully ✅", farm: newFarm });
  } catch (error) {
    res.status(500).json({ message: "Error saving farm data ❌", error });
  }
});

// Get all farms
// router.get("/", async (req, res) => {
//   try {
//     const farms = await Farm.find();
//     res.json(farms);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching farm data ❌", error });
//   }
// });

module.exports = router;
