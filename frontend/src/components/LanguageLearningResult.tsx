// frontend/src/components/LanguageLearningResult.tsx
import { useState, useRef, useEffect } from "react";
import { TTSResponse } from "../services/ttsService";

interface LanguageLearningResultProps {
  result: TTSResponse | null;
}

const LanguageLearningResult = ({ result }: LanguageLearningResultProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("pronunciation");

  useEffect(() => {
    if (result && audioRef.current) {
      audioRef.current.load();
    }
  }, [result]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.error("Error playing audio:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!result) {
    return null;
  }

  const audioUrl = `${import.meta.env.VITE_API_URL}${result.audioUrl}`;

  return (
    <div className="language-learning-result">
      <div className="tabs">
        <button className={activeTab === "pronunciation" ? "active" : ""} onClick={() => setActiveTab("pronunciation")}>
          Pronunciation
        </button>
        <button className={activeTab === "translation" ? "active" : ""} onClick={() => setActiveTab("translation")}>
          Translation
        </button>
        <button className={activeTab === "grammar" ? "active" : ""} onClick={() => setActiveTab("grammar")}>
          Grammar
        </button>
        <button className={activeTab === "vocabulary" ? "active" : ""} onClick={() => setActiveTab("vocabulary")}>
          Vocabulary
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "pronunciation" && (
          <div className="pronunciation-section">
            <h3>Pronunciation Practice</h3>
            <p className="original-text">{result.text}</p>
            <div className="audio-controls">
              <audio ref={audioRef} controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="audio-buttons">
                <button onClick={togglePlayPause} className="play-button">
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <a href={audioUrl} download="pronunciation.mp3" className="download-button">
                  Download
                </a>
              </div>
              <div className="speed-indicator">Speed: {result.speakingRate}x</div>
            </div>
          </div>
        )}

        {activeTab === "translation" && (
          <div className="translation-section">
            <h3>Translation</h3>
            <div className="translation-grid">
              <div className="original">
                <h4>Original ({result.language.split("-")[0]})</h4>
                <div className="text-box">{result.text}</div>
              </div>
              <div className="translated">
                <h4>Translation ({result.targetLanguage.split("-")[0]})</h4>
                <div className="text-box">{result.translatedText || "No translation available"}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="grammar-section">
            <h3>Grammar Explanation</h3>
            <div className="grammar-notes">{result.grammarNotes || "No grammar analysis available"}</div>
          </div>
        )}

        {activeTab === "vocabulary" && (
          <div className="vocabulary-section">
            <div className="vocabulary-column">
              <h3>Key Vocabulary</h3>
              {result.keyVocabulary && result.keyVocabulary.length > 0 ? (
                <ul className="vocabulary-list">
                  {result.keyVocabulary.map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
                </ul>
              ) : (
                <p>No vocabulary identified</p>
              )}
            </div>

            <div className="phrases-column">
              <h3>Important Phrases</h3>
              {result.importantPhrases && result.importantPhrases.length > 0 ? (
                <ul className="phrases-list">
                  {result.importantPhrases.map((phrase, index) => (
                    <li key={index}>{phrase}</li>
                  ))}
                </ul>
              ) : (
                <p>No important phrases identified</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageLearningResult;
