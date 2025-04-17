// frontend/src/components/AudioPlayer.tsx
import { useState, useEffect, useRef } from "react";
import { TTSResponse } from "../services/ttsService";

interface AudioPlayerProps {
  tts: TTSResponse | null;
}

const AudioPlayer = ({ tts }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (tts && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((err) => console.error("Error playing audio:", err));
      setIsPlaying(true);
    }
  }, [tts]);

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

  if (!tts) {
    return null;
  }

  const audioUrl = `${import.meta.env.VITE_API_URL}${tts.audioUrl}`;

  return (
    <div className="audio-player">
      <div className="audio-info">
        <h3>Audio Generated</h3>
        <p>
          <strong>Text:</strong> {tts.text.length > 50 ? `${tts.text.substring(0, 50)}...` : tts.text}
        </p>
        <p>
          <strong>Language:</strong> {tts.language}
        </p>
        <p>
          <strong>Voice:</strong> {tts.voice}
        </p>
      </div>

      <audio ref={audioRef} controls>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="audio-controls">
        <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
        <a href={audioUrl} download="audio.mp3">
          Download
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;
