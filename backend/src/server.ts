import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import ttsRoutes from "./routes/ttsRoutes";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Middleware - Fix: Configure CORS before other middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // Vite dev server address
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/tts", ttsRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Text-to-Speech API is running...");
});

// Set port and start server
const PORT = process.env.PORT || 5001; // Changed to 5001 to match your client's request

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});