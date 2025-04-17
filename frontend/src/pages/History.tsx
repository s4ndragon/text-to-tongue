// frontend/src/pages/History.tsx
import { useState, useEffect } from "react";
import { getTextToSpeechHistory, TTSResponse } from "../services/ttsService";

const History = () => {
  const [history, setHistory] = useState<TTSResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getTextToSpeechHistory();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (history.length === 0) {
    return <div>No history found. Try converting some text first!</div>;
  }

  return (
    <div className="history-container">
      <h1>TTS Conversion History</h1>

      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-content">
              <p>
                <strong>Text:</strong> {item.text}
              </p>
              <p>
                <strong>Language:</strong> {item.language}
              </p>
              <p>
                <strong>Voice:</strong> {item.voice}
              </p>
              <p>
                <strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="history-audio">
              <audio controls>
                <source src={`${import.meta.env.VITE_API_URL}${item.audioUrl}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
