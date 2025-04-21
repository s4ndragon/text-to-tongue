import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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
  language: string = 'en-US',
  voice: string = 'en-US-Wavenet-D',
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
        audioEncoding: 'MP3' as const,
        speakingRate: speakingRate
      },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // The response's audioContent is binary
    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(uploadDir, fileName);
    
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent as Buffer, 'binary');
    
    console.log(`Audio content written to file: ${filePath}`);
    
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error in TTS service:', error);
    throw error;
  }
};

// You'll need to use a translation API like Google Cloud Translation
export const translateText = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  try {
    // Implement translation using Google Translate API
    // This is a placeholder - you need to implement the actual API call
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLanguage
      }
    );
    
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error in translation service:', error);
    throw error;
  }
};

// Analyze text for grammar, vocabulary, and phrases
export const analyzeText = async (
  text: string,
  language: string,
  targetLanguage: string
): Promise<{
  grammarNotes: string;
  keyVocabulary: string[];
  importantPhrases: string[];
}> => {
  // This is a placeholder - you would implement actual NLP analysis here
  // For a production app, consider using services like Google Natural Language API
  
  // Basic implementation
  const keyVocabulary = text
    .split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 5);
  
  const importantPhrases = text
    .split(/[.!?]/)
    .filter(phrase => phrase.trim().length > 0 && phrase.split(/\s+/).length >= 3)
    .slice(0, 3)
    .map(phrase => phrase.trim());
  
  const grammarNotes = "This is a sample grammar analysis. In production, use NLP services.";
  
  return {
    grammarNotes,
    keyVocabulary,
    importantPhrases
  };
};