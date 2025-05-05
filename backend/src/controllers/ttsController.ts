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

    // Only analyze text if the content is not too long
    // This helps control API costs and response times
    let grammarNotes = "";
    let keyVocabulary: string[] = [];
    let importantPhrases: string[] = [];

    if (text.length <= 1000) {
      // Limit analysis to texts under 1000 characters
      try {
        console.log("try");
        const analysisResult = await analyzeText(text, language, targetLanguage);
        console.log("Analysis result:", analysisResult);
        grammarNotes = analysisResult.grammarNotes;
        keyVocabulary = analysisResult.keyVocabulary;
        importantPhrases = analysisResult.importantPhrases;
      } catch (analysisError) {
        console.error("Error during text analysis:", analysisError);
        // Continue with empty analysis results if there's an error
      }
    } else {
      grammarNotes = "Text too long for detailed analysis. Try with a shorter text (under 1000 characters).";
    }

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
