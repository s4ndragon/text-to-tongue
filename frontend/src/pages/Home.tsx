// frontend/src/pages/Home.tsx
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
  };

  const handleConversionError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="home-container">
      <h1>Language Learning Assistant</h1>

      {error && <div className="error-message">{error}</div>}

      <TTSForm onConversionSuccess={handleConversionSuccess} onConversionError={handleConversionError} />

      {currentResult && <LanguageLearningResult result={currentResult} />}
    </div>
  );
};

export default Home;
