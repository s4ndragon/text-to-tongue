// frontend/src/services/ttsService.ts
import api from './api';

export interface TTSRequest {
  text: string;
  language?: string;
  targetLanguage?: string;
  voice?: string;
  speakingRate?: number;
}

export interface TTSResponse {
  id: string;
  text: string;
  audioUrl: string;
  translatedText?: string;
  language: string;
  targetLanguage: string;
  voice: string;
  speakingRate: number;
  grammarNotes?: string;
  keyVocabulary?: string[];
  importantPhrases?: string[];
  createdAt: string;
}

export const convertTextToSpeech = async (data: TTSRequest): Promise<TTSResponse> => {
  const response = await api.post('/api/tts/synthesize', data);
  return response.data.data;
};

export const getTextToSpeechHistory = async (): Promise<TTSResponse[]> => {
  const response = await api.get('/api/tts/history');
  return response.data.data;
};