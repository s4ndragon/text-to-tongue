// History.tsx
import { useState, useEffect } from "react";
import { getTextToSpeechHistory, TTSResponse } from "../services/ttsService";

const History = () => {
  const [history, setHistory] = useState<TTSResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

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

  const filteredHistory = filter === "all" 
    ? history 
    : history.filter(item => item.language === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading history...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (history.length === 0) {
    return (
      <div className="empty-state">
        <h2>No History Found</h2>
        <p>Try converting some text on the home page first!</p>
        <a href="/" className="button-link">Go to Home</a>
      </div>
    );
  }

  // Get unique languages
  const languages = Array.from(new Set(history.map(item => item.language)));

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Your Learning History</h1>
        
        <div className="filter-controls">
          <label htmlFor="language-filter">Filter by language:</label>
          <select 
            id="language-filter" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.split('-')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-value">{history.length}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{languages.length}</div>
          <div className="stat-label">Languages</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {history.length > 0 
              ? Math.round(history.reduce((acc, item) => acc + item.text.length, 0) / history.length) 
              : 0}
          </div>
          <div className="stat-label">Avg. Characters</div>
        </div>
      </div>

      <div className="history-list">
        {filteredHistory.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-content">
              <div className="history-text">
                <strong>Text:</strong>
                <p>{item.text}</p>
              </div>
              <div className="history-meta">
                <span className="language-tag">{item.language.split('-')[0]}</span>
                <span className="voice-tag">{item.voice.split('-').pop()}</span>
                <span className="date-tag">{formatDate(item.createdAt)}</span>
              </div>
            </div>
            <div className="history-audio">
              <audio controls className="audio-player">
                <source src={`${import.meta.env.VITE_API_URL}${item.audioUrl}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a 
                href={`${import.meta.env.VITE_API_URL}${item.audioUrl}`} 
                download={`audio-${item.id}.mp3`}
                className="download-link"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;