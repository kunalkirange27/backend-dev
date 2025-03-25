const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema({
  username: String,
  area: Number,
  measureScale: String,
  soilType: String,
  address: String,
  city: String,
  pincode: String,
  contactNum: String,
  markerPosition: {
    lat: Number,
    lng: Number,
  },
});

module.exports = mongoose.model("Farm", FarmSchema);