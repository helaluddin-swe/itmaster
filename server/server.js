const express = require("express");
const cors = require('cors'); 
const dotenv = require("dotenv");

// Config env before everything else
dotenv.config();

const connectDB = require("./db/dbConfig");

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const courseRoutes = require("./routes/courseRoutes.js");
const highlightRoutes=require("./routes/highlightRoutes.js")

const app = express();

// Connect to Database
connectDB();
app.use(express.json());

// --- CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders:["Allow","Accept Query"],
  preflightContinue:true,
}));






// Root route for testing server status
app.get("/", (req, res) => {
  res.send("CrackMaster API is running...");
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/highlights",highlightRoutes)

const PORT = process.env.PORT || 5175;

// Only run app.listen locally. Vercel handles the server execution via module export.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;