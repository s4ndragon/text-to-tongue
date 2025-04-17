import express from "express";
import { convertTextToSpeech, getTextToSpeechHistory } from "../controllers/ttsController";

const router = express.Router();

// POST route to convert text to speech
router.post("/synthesize", convertTextToSpeech);

// GET route to fetch TTS history
router.get("/history", getTextToSpeechHistory);

export default router;
