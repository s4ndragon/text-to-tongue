// backend/src/models/TextToSpeech.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITextToSpeech extends Document {
  text: string;
  audioUrl?: string;
  translatedText?: string;
  language: string;
  targetLanguage: string;
  voice: string;
  speakingRate: number;
  grammarNotes?: string;
  keyVocabulary?: string[];
  importantPhrases?: string[];
  createdAt: Date;
}

const textToSpeechSchema = new Schema<ITextToSpeech>({
  text: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
  },
  translatedText: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    default: "en-US",
  },
  targetLanguage: {
    type: String,
    required: true,
    default: "en-US",
  },
  voice: {
    type: String,
    required: true,
    default: "en-US-Wavenet-D",
  },
  speakingRate: {
    type: Number,
    required: true,
    default: 1.0,
  },
  grammarNotes: {
    type: String,
  },
  keyVocabulary: {
    type: [String],
  },
  importantPhrases: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITextToSpeech>("TextToSpeech", textToSpeechSchema);
