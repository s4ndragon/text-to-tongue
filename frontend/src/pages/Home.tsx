// Home.tsx
import { useState } from "react";
import TTSForm from "../components/TTSForm";
import LanguageLearningResult from "../components/LanguageLearningResult";
import { TTSResponse } from "../services/ttsService";

const Home = () => {
  const [currentResult, setCurrentResult] = useState<TTSResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConversionSuccess = (result: TTSResponse) => {
    setCurrentResult(result);
    setError(null);

    // Scroll to result
    setTimeout(() => {
      const resultElement = document.querySelector(".language-learning-result");
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleConversionError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentResult(null);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Language Learning Assistant</h1>
        <p className="subtitle">Improve your language skills with text-to-speech, translations, and grammar analysis</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <TTSForm onConversionSuccess={handleConversionSuccess} onConversionError={handleConversionError} />
      </div>

      {currentResult && (
        <div className="result-section">
          <LanguageLearningResult result={currentResult} />
        </div>
      )}

      {!currentResult && (
        <div className="instructions">
          <h3>How to use the Language Learning Assistant</h3>
          <ol>
            <li>Enter text in your target language (Spanish or Thai)</li>
            <li>Select your native language for translation</li>
            <li>Choose a voice and speaking rate</li>
            <li>Click "Analyze & Convert" to process</li>
            <li>Use the tabs to explore pronunciation, translation, grammar, and vocabulary</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default Home;
