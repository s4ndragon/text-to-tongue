// frontend/src/components/TTSForm.tsx
import { useState, FormEvent } from 'react';
import { convertTextToSpeech, TTSRequest, TTSResponse } from '../services/ttsService';

interface TTSFormProps {
  onConversionSuccess: (tts: TTSResponse) => void;
  onConversionError: (error: string) => void;
}

const TTSForm = ({ onConversionSuccess, onConversionError }: TTSFormProps) => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es-ES');
  const [voice, setVoice] = useState('en-US-Wavenet-D');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      onConversionError('Text is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const request: TTSRequest = {
        text,
        language,
        targetLanguage,
        voice,
        speakingRate
      };
      
      const response = await convertTextToSpeech(request);
      onConversionSuccess(response);
    } catch (error) {
      console.error('Error converting text to speech:', error);
      onConversionError('Failed to convert text to speech');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tts-form">
      <div className="form-group">
        <label htmlFor="text">Text to convert:</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Enter text to analyze for language learning..."
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="language">From Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-US">English (US)</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
            <option value="es-ES">Spanish</option>
            <option value="zh-CN">Chinese (Simplified)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="targetLanguage">To Language:</label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="en-US">English (US)</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
            <option value="es-ES">Spanish</option>
            <option value="zh-CN">Chinese (Simplified)</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="voice">Voice:</label>
          <select
            id="voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            <option value="en-US-Wavenet-A">US Female (A)</option>
            <option value="en-US-Wavenet-B">US Male (B)</option>
            <option value="en-US-Wavenet-C">US Female (C)</option>
            <option value="en-US-Wavenet-D">US Male (D)</option>
            <option value="fr-FR-Wavenet-A">French Female (A)</option>
            <option value="fr-FR-Wavenet-B">French Male (B)</option>
            <option value="es-ES-Wavenet-B">Spanish Male (B)</option>
            <option value="es-ES-Wavenet-C">Spanish Female (C)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="speakingRate">Speaking Rate:</label>
          <input
            type="range"
            id="speakingRate"
            min="0.25"
            max="2"
            step="0.25"
            value={speakingRate}
            onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
          />
          <span className="rate-value">{speakingRate}x</span>
        </div>
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Analyze & Convert'}
      </button>
    </form>
  );
};

export default TTSForm;