// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.log("Error connecting to MongoDB:", err));

// // Define Mongoose Schema for user farm data
// const farmDataSchema = new mongoose.Schema({
//     username: String,
//     area: String,
//     measureScale: String,
//     soilType: String,
//     address: String,
//     city: String,
//     pincode: String,
//     contactNum: String,
//     markerPosition: Object,
//     reports: [{ data: Buffer, contentType: String }]
// }, { timestamps: true });

// const FarmData = mongoose.model("userfarmdatas", farmDataSchema);

// // Multer storage (store files in memory instead of disk)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Route to handle farm data submission
// app.post("/submit-farm-data", upload.array("reports"), async (req, res) => {
//     try {
//         const {username, area, measureScale, soilType, address, city, pincode, contactNum, markerPosition } = req.body;

//         // Check if a farm data entry already exists (single record allowed)
//         // const existingFarmData = await FarmData.findOne({});
//         // if (existingFarmData) {
//         //     return res.status(400).json({ message: "User farm data already exists. Only one entry allowed." });
//         // }

//         // Convert uploaded files into Blob format
//         const reportFiles = req.files.map(file => ({
//             data: file.buffer,
//             contentType: file.mimetype
//         }));

//         // Save farm data to MongoDB
//         const newFarmData = new FarmData({
//             username,
//             area,
//             measureScale,
//             soilType,
//             address,
//             city,
//             pincode,
//             contactNum,
//             markerPosition: JSON.parse(markerPosition),
//             reports: reportFiles
//         });

//         await newFarmData.save();
//         res.status(201).json({ message: "Farm data submitted successfully", data: newFarmData });

//     } catch (error) {
//         res.status(500).json({ message: "Error saving data", error: error.message });
//     }
// });

// // get the latitude and longitude from database to get weather data
// app.get("/get-farm-location", async (req, res) => {
//     try {
//         const farmData = await FarmData.findOne();
//         if (!farmData) {
//             return res.status(404).json({ message: "No farm data found" });
//         }

//         const { lat, lng } = farmData.markerPosition;
//         res.json({ latitude: lat, longitude: lng });

//     } catch (error) {
//         res.status(500).json({ message: "Error fetching location", error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });











// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const axios = require("axios");

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.log("Error connecting to MongoDB:", err));

// // Define Mongoose Schema for user farm data
// const farmDataSchema = new mongoose.Schema({
//     username: String,
//     area: String,
//     measureScale: String,
//     soilType: String,
//     address: String,
//     city: String,
//     pincode: String,
//     contactNum: String,
//     markerPosition: { lat: Number, lng: Number },  // Ensure lat/lng is stored correctly
//     reports: [{ data: Buffer, contentType: String }]
// }, { timestamps: true });

// const FarmData = mongoose.model("userfarmdatas", farmDataSchema);

// // Multer storage (store files in memory)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// // API 1: Save User Farm Data
// app.post("/submit-farm-data", upload.array("reports"), async (req, res) => {
//     try {
//         const { username, area, measureScale, soilType, address, city, pincode, contactNum, markerPosition } = req.body;

//         const reportFiles = req.files.map(file => ({
//             data: file.buffer,
//             contentType: file.mimetype
//         }));

//         const newFarmData = new FarmData({
//             username,
//             area,
//             measureScale,
//             soilType,
//             address,
//             city,
//             pincode,
//             contactNum,
//             markerPosition: markerPosition ? JSON.parse(markerPosition) : null,
//             reports: reportFiles
//         });

//         await newFarmData.save();
//         res.status(201).json({ message: "Farm data submitted successfully", data: newFarmData });

//     } catch (error) {
//         res.status(500).json({ message: "Error saving data", error: error.message });
//     }
// });

// // API 2: Fetch Soil Data
// async function getSoilData(lat, lng) {
//     try {
//         const response = await axios.get(`https://rest.soilgrids.org/query?lat=${lat}&lon=${lng}`);
//         const soilData = response.data.properties;
//         return {
//             soil_ph: soilData.phh2o?.M ?? 0,
//             soil_nitrogen: soilData.nitrogen?.M ?? 0,
//             soil_phosphorus: soilData.phosphorus?.M ?? 0,
//             soil_potassium: soilData.potassium?.M ?? 0,
//             soil_moisture: soilData.moisture?.M ?? 0,
//             soil_cec: soilData.cec?.M ?? 0
//         };
//     } catch (error) {
//         console.error("Error fetching soil data:", error.message);
//         return null;
//     }
// }

// // API 3: Fetch Climate Data
// async function getClimateData(lat, lng) {
//     try {
//         const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,humidity_2m_mean,humidity_2m_min,wind_speed_10m_max&timezone=auto`);
//         const climateData = response.data.daily;
//         return {
//             avg_temperature: climateData.temperature_2m_max.reduce((a, b) => a + b) / climateData.temperature_2m_max.length,
//             min_temperature: Math.min(...climateData.temperature_2m_min),
//             avg_humidity: climateData.humidity_2m_mean.reduce((a, b) => a + b) / climateData.humidity_2m_mean.length,
//             min_humidity: Math.min(...climateData.humidity_2m_min),
//             avg_wind_speed: climateData.wind_speed_10m_max.reduce((a, b) => a + b) / climateData.wind_speed_10m_max.length,
//             total_rainfall: climateData.precipitation_sum.reduce((a, b) => a + b)
//         };
//     } catch (error) {
//         console.error("Error fetching climate data:", error.message);
//         return null;
//     }
// }

// // API 4: Merge Data and Send to ML Model
// app.get("/get-merged-data", async (req, res) => {
//     try {
//         const farmData = await FarmData.findOne();
//         if (!farmData) {
//             return res.status(404).json({ message: "No farm data found" });
//         }

//         const { lat, lng } = farmData.markerPosition;
//         if (!lat || !lng) {
//             return res.status(400).json({ message: "Latitude and Longitude not found in database" });
//         }

//         const soilData = await getSoilData(lat, lng);
//         const climateData = await getClimateData(lat, lng);

//         if (!soilData || !climateData) {
//             return res.status(500).json({ message: "Error fetching soil or climate data" });
//         }

//         // Merged JSON
//         const mergedData = {
//             latitude: lat,
//             longitude: lng,
//             ...soilData,
//             ...climateData,
//             historical_crops: ["Rice", "Wheat", "Maize"]
//         };

//         // Send to ML Model using FastAPI
//         // const mlResponse = await axios.post("http://127.0.0.1:8000/predict", mergedData);
//         // res.json({ message: "Data sent to ML model", prediction: mlResponse.data });

//     } catch (error) {
//         res.status(500).json({ message: "Error merging data", error: error.message });
//     }
// });

// // Start Express Server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });







const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    });

// Define Mongoose Schema for user farm data
const farmDataSchema = new mongoose.Schema({
    username: String,
    area: String,
    measureScale: String,
    soilType: String,
    address: String,
    city: String,
    pincode: String,
    contactNum: String,
    markerPosition: {
        lat: Number,
        lng: Number
    },
    reports: [{ data: Buffer, contentType: String }]
}, { timestamps: true });

const mergedFarmDataSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    soil_ph: Number,
    soil_nitrogen: Number,
    soil_phosphorus: Number,
    soil_potassium: Number,
    soil_moisture: Number,
    soil_cec: Number,
    avg_temperature: Number,
    min_temperature: Number,
    avg_humidity: Number,
    min_humidity: Number,
    avg_wind_speed: Number,
    total_rainfall: Number,
    historical_crops: [String],
});

const MergedFarmData = mongoose.model("mergedfarmdatas", mergedFarmDataSchema);

const FarmData = mongoose.model("userfarmdatas", farmDataSchema);

// Multer storage (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Store farm data and extract latitude & longitude
app.post("/submit-farm-data", upload.array("reports"), async (req, res) => {
    try {
        const { username, area, measureScale, soilType, address, city, pincode, contactNum, markerPosition } = req.body;

        if (!markerPosition) {
            return res.status(400).json({ message: "Marker position is required" });
        }

        let parsedMarkerPosition;
        try {
            parsedMarkerPosition = JSON.parse(markerPosition);
        } catch (error) {
            return res.status(400).json({ message: "Invalid marker position format" });
        }

        const { lat, lng } = parsedMarkerPosition;

        const reportFiles = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));

        const newFarmData = new FarmData({
            username,
            area,
            measureScale,
            soilType,
            address,
            city,
            pincode,
            contactNum,
            markerPosition: parsedMarkerPosition,
            reports: reportFiles
        });

        await newFarmData.save();
        res.status(201).json({ message: "Farm data submitted successfully", data: newFarmData });

    } catch (error) {
        console.error("Error saving farm data:", error);
        res.status(500).json({ message: "Error saving data", error: error.message });
    }
});

app.post("/store-merged-data", async (req, res) => {
    try {
        console.log("Received Payload:", JSON.stringify(req.body, null, 2));

        const { data } = req.body;
        
        if (!data || typeof data !== "object") {
            return res.status(400).json({ error: "Invalid request format" });
        }

        const newMergedData = new MergedFarmData(data);
        const result = await newMergedData.save();

        console.log("Insertion Result:", result);
        res.status(201).json({ message: "Data inserted successfully", insertedId: result._id });

    } catch (error) {
        console.error("Database Insertion Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = (req, res) => {
    res.send("Server is running!");
};


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
