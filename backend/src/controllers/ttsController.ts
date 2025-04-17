// backend/src/controllers/ttsController.ts
import { Request, Response } from "express";
import { synthesizeSpeech, translateText, analyzeText } from "../services/ttsService";
import TextToSpeech from "../models/TextToSpeech";

export const convertTextToSpeech = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      text,
      language = "en-US",
      targetLanguage = "en-US",
      voice = "en-US-Wavenet-D",
      speakingRate = 1.0,
    } = req.body;

    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    // Generate speech from text
    const audioUrl = await synthesizeSpeech(text, language, voice, speakingRate);

    // Get translation if source and target languages differ
    let translatedText = null;
    if (language !== targetLanguage) {
      translatedText = await translateText(text, targetLanguage);
    }

    // Analyze text for language learning
    const { grammarNotes, keyVocabulary, importantPhrases } = await analyzeText(text, language, targetLanguage);

    // Save to database
    const ttsRequest = new TextToSpeech({
      text,
      audioUrl,
      translatedText,
      language,
      targetLanguage,
      voice,
      speakingRate,
      grammarNotes,
      keyVocabulary,
      importantPhrases,
    });

    await ttsRequest.save();

    res.status(200).json({
      success: true,
      data: {
        id: ttsRequest._id,
        text,
        audioUrl,
        translatedText,
        language,
        targetLanguage,
        voice,
        speakingRate,
        grammarNotes,
        keyVocabulary,
        importantPhrases,
        createdAt: ttsRequest.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in TTS controller:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};


export const getTextToSpeechHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await TextToSpeech.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching TTS history:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};
