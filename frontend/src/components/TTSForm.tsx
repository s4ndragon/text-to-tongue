// TTSForm.tsx
import { useState, FormEvent } from "react";
import { convertTextToSpeech, TTSRequest, TTSResponse } from "../services/ttsService";

interface TTSFormProps {
  onConversionSuccess: (tts: TTSResponse) => void;
  onConversionError: (error: string) => void;
}

const TTSForm = ({ onConversionSuccess, onConversionError }: TTSFormProps) => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("es-ES");
  const [targetLanguage, setTargetLanguage] = useState("en-US");
  const [voice, setVoice] = useState("es-ES-Wavenet-B");
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      onConversionError("Please enter some text to analyze");
      return;
    }

    setIsLoading(true);

    try {
      const request: TTSRequest = {
        text,
        language,
        targetLanguage,
        voice,
        speakingRate,
      };

      const response = await convertTextToSpeech(request);
      console.log("response:", response);
      onConversionSuccess(response);
    } catch (error) {
      console.error("Error converting text to speech:", error);
      onConversionError("Failed to convert text to speech. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update voice options based on selected language
  const getVoiceOptions = () => {
    if (language === "es-ES") {
      return (
        <>
          <option value="es-ES-Wavenet-B">Spanish Male (B)</option>
          <option value="es-ES-Wavenet-C">Spanish Female (C)</option>
          <option value="es-ES-Wavenet-D">Spanish Female (D)</option>
        </>
      );
    } else if (language === "th-TH") {
      return (
        <>
          <option value="th-TH-Chirp3-HD-Aoede">Thai Female (A)</option>
          <option value="th-TH-Chirp3-HD-Fenrir">Thai Male (F)</option>
        </>
      );
    }
    return null;
  };

  return (
    <div className="form-card">
      <h2>Text Analysis Tool</h2>
      <p className="form-description">
        Enter text in your target language and get pronunciation, translation, and language learning insights.
      </p>

      <form onSubmit={handleSubmit} className="tts-form">
        <div className="form-group">
          <label htmlFor="text">
            <span>Text to analyze:</span>
            <small className="required">Required</small>
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Enter text to analyze for language learning..."
            required
          />
          <small className="character-count">{text.length} characters</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="language">From Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                // Set default voice based on language
                if (e.target.value === "es-ES") {
                  setVoice("es-ES-Wavenet-B");
                } else if (e.target.value === "th-TH") {
                  setVoice("th-TH-Chirp3-HD-Aoede");
                }
              }}>
              <option value="es-ES">Spanish (Latin)</option>
              <option value="th-TH">Thai</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="targetLanguage">To Language:</label>
            <select id="targetLanguage" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
              <option value="en-US">English (US)</option>
              <option value="zh-TW">Mandarin (Traditional)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="voice">Voice:</label>
            <select id="voice" value={voice} onChange={(e) => setVoice(e.target.value)}>
              {getVoiceOptions()}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="speakingRate">Speaking Rate:</label>
            <div className="rate-container">
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
            <div className="rate-labels">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            "Analyze & Convert"
          )}
        </button>
      </form>
    </div>
  );
};

export default TTSForm;
