// LanguageLearningResult.tsx
import { useState, useRef, useEffect } from "react";
import { TTSResponse } from "../services/ttsService";
import ExactTranslation from "./ExactTranslation";

interface LanguageLearningResultProps {
  result: TTSResponse | null;
}

const LanguageLearningResult = ({ result }: LanguageLearningResultProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("pronunciation");
  const [playbackRate, setPlaybackRate] = useState(1.0);

  useEffect(() => {
    if (result && audioRef.current) {
      audioRef.current.load();
    }
  }, [result]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  };

  if (!result) {
    return null;
  }

  const audioUrl = `${import.meta.env.VITE_API_URL}${result.audioUrl}`;
  const languageName = result.language.split("-")[0];
  const targetLanguageName = result.targetLanguage.split("-")[0];

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

            <div className="original-text-container">
              <div className="text-header">
                <h4>Text to Practice</h4>
                <span className="language-indicator">{languageName}</span>
              </div>
              <div className="original-text">{result.text}</div>
            </div>

            <div className="audio-section">
              <h4>Audio Controls</h4>
              <div className="audio-controls">
                <audio ref={audioRef} onEnded={handleAudioEnded} controls>
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                <div className="playback-controls">
                  <div className="audio-buttons">
                    <button onClick={togglePlayPause} className="play-button">
                      <span className={`icon ${isPlaying ? "pause" : "play"}`}></span>
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                    <a href={audioUrl} download={`pronunciation-${languageName}.mp3`} className="download-button">
                      <span className="icon download"></span>
                      Download
                    </a>
                  </div>

                  <div className="speed-controls">
                    <span>Playback Speed:</span>
                    <div className="speed-buttons">
                      <button className={playbackRate === 0.5 ? "active" : ""} onClick={() => changePlaybackRate(0.5)}>
                        0.5x
                      </button>
                      <button
                        className={playbackRate === 0.75 ? "active" : ""}
                        onClick={() => changePlaybackRate(0.75)}>
                        0.75x
                      </button>
                      <button className={playbackRate === 1.0 ? "active" : ""} onClick={() => changePlaybackRate(1.0)}>
                        1.0x
                      </button>
                      <button className={playbackRate === 1.5 ? "active" : ""} onClick={() => changePlaybackRate(1.5)}>
                        1.5x
                      </button>
                    </div>
                  </div>
                </div>

                <div className="original-speed-indicator">Original Recording Speed: {result.speakingRate}x</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "translation" && (
          <ExactTranslation
            originalText={result.text}
            originalLanguage={languageName}
            translationText={result.translatedText || "No translation available"}
            translationLanguage={targetLanguageName}
          />
        )}
        {activeTab === "grammar" && (
          <div className="grammar-section">
            <h3>Grammar Explanation</h3>
            <div className="grammar-notes">
              {result.grammarNotes || (
                <div className="no-content">
                  <p>No grammar analysis available for this text.</p>
                  <p>Try a more complex sentence to get grammar insights.</p>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "vocabulary" && (
          <div className="vocabulary-section">
            <div className="vocabulary-column">
              <h3>Key Vocabulary</h3>
              {result.keyVocabulary && result.keyVocabulary.length > 0 ? (
                <ul className="vocabulary-list">
                  {result.keyVocabulary.map((word, index) => (
                    <li key={index}>
                      <strong>{word.split(":")[0]}</strong>
                      {word.includes(":") && `: ${word.split(":")[1]}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-content">
                  <p>No vocabulary identified.</p>
                  <p>Try a longer text with more variety.</p>
                </div>
              )}
            </div>

            <div className="phrases-column">
              <h3>Important Phrases</h3>
              {result.importantPhrases && result.importantPhrases.length > 0 ? (
                <ul className="phrases-list">
                  {result.importantPhrases.map((phrase, index) => (
                    <li key={index}>
                      <strong>{phrase.split(":")[0]}</strong>
                      {phrase.includes(":") && `: ${phrase.split(":")[1]}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-content">
                  <p>No important phrases identified.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageLearningResult;
