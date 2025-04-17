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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// backend/src/server.ts
app.use(
  cors({
    origin: "http://localhost:3000", // Vite dev server address
    credentials: true,
  })
);

// API Routes
app.use("/api/tts", ttsRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Text-to-Speech API is running...");
});

// Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
