import textToSpeech from "@google-cloud/text-to-speech";
import { trackApiUsage } from "./apiMonitor";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import util from "util";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

/**
 * Convert text to speech using Google Cloud TTS API
 * @param text The text to convert to speech
 * @param language The language code
 * @param voice The voice name
 * @param speakingRate The speaking rate (0.25 to 4.0)
 * @returns Path to the generated audio file
 */
export const synthesizeSpeech = async (
  text: string,
  language: string = "en-US",
  voice: string = "en-US-Wavenet-D",
  speakingRate: number = 1.0
): Promise<string> => {
  try {
    // Construct the request
    const request = {
      input: { text },
      // Select the language and voice
      voice: {
        languageCode: language,
        name: voice,
      },
      // Select the type of audio encoding
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: speakingRate,
      },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // The response's audioContent is binary
    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(uploadDir, fileName);

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent as Buffer, "binary");

    console.log(`Audio content written to file: ${filePath}`);

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error in TTS service:", error);
    throw error;
  }
};

// You'll need to use a translation API like Google Cloud Translation
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // Implement translation using Google Translate API
    // This is a placeholder - you need to implement the actual API call
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      q: text,
      target: targetLanguage,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error in translation service:", error);
    throw error;
  }
};

// Analyze text for grammar, vocabulary, and phrases
// New function for analyzing text using OpenAI
export const analyzeText = async (
  text: string,
  language: string,
  targetLanguage: string
): Promise<{ grammarNotes: string; keyVocabulary: string[]; importantPhrases: string[] }> => {
  try {
    console.log('in analyzeText')
    // Get language names for better prompt context
    const languageName = getLanguageName(language);
    const targetLanguageName = getLanguageName(targetLanguage);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use "gpt-4" for better quality if available
      messages: [
        {
          role: "system",
          content: `You are a language learning assistant specializing in ${languageName}. 
          Analyze the following text for a student whose native language is ${targetLanguageName}.
          
          Provide:
          1. A detailed grammar explanation focusing on sentence structures, verb tenses, and any important grammatical patterns. Be pedagogical and clear.
          2. A list of 5-10 key vocabulary words with their translations to ${targetLanguageName} in the format "word: translation".
          3. A list of 3-5 important phrases or expressions with their translations and usage notes.
          
          Format your response as a valid JSON object with three keys: 
          - grammarNotes (string with HTML formatting allowed)
          - keyVocabulary (array of strings in "word: translation" format)
          - importantPhrases (array of strings in "phrase: translation" format)`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log("response:", response);

    // Track token usage
    const promptTokens = response.usage?.prompt_tokens || 0;
    const completionTokens = response.usage?.completion_tokens || 0;
    const totalTokens = promptTokens + completionTokens;

    await trackApiUsage(totalTokens);

    // Parse the response
    const responseContent = response.choices[0].message.content || "{}";
    console.log("responseContent:", responseContent);
    try {
      const analysis = JSON.parse(responseContent);

      return {
        grammarNotes: analysis.grammarNotes || "Grammar analysis unavailable.",
        keyVocabulary: Array.isArray(analysis.keyVocabulary) ? analysis.keyVocabulary : [],
        importantPhrases: Array.isArray(analysis.importantPhrases) ? analysis.importantPhrases : [],
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      // Fallback analysis if JSON parsing fails
      return {
        grammarNotes: "We encountered an issue analyzing the grammar for this text.",
        keyVocabulary: [],
        importantPhrases: [],
      };
    }
  } catch (error) {
    console.error("Error analyzing text with OpenAI:", error);
    return {
      grammarNotes: "Grammar analysis unavailable at this time. Please try again later.",
      keyVocabulary: [],
      importantPhrases: [],
    };
  }
};

// Helper function to get full language name from code
function getLanguageName(languageCode: string): string {
  const languages: Record<string, string> = {
    "en-US": "English",
    "es-ES": "Spanish",
    "th-TH": "Thai",
    "zh-TW": "Mandarin Chinese",
  };

  // Get the base language code (e.g., 'es' from 'es-ES')
  const baseCode = languageCode.split("-")[0];

  // Return the full name if available, otherwise use the code
  return languages[languageCode] || languages[`${baseCode}-${baseCode.toUpperCase()}`] || baseCode.toUpperCase();
}
