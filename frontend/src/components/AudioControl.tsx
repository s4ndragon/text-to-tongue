// components/AudioControl.tsx
import React, { useRef, useState, useEffect } from "react";

interface AudioControlProps {
  audioUrl: string;
  showDownload?: boolean;
  showSpeedControls?: boolean;
  filename?: string;
}

const AudioControl: React.FC<AudioControlProps> = ({
  audioUrl,
  showDownload = true,
  showSpeedControls = false,
  filename = "audio.mp3",
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Update audio element when playback rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle metadata loaded to get duration
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Toggle play/pause
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

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  };

  // Format time in mm:ss
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="audio-control">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={() => setIsPlaying(false)}></audio>

      <div className="audio-progress">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="time-slider"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <div className="audio-buttons">
        <button onClick={togglePlayPause} className="play-button">
          <span className={`icon ${isPlaying ? "pause" : "play"}`}></span>
          {isPlaying ? "Pause" : "Play"}
        </button>

        {showDownload && (
          <a href={audioUrl} download={filename} className="download-button">
            <span className="icon download"></span>
            Download
          </a>
        )}
      </div>

      {showSpeedControls && (
        <div className="speed-controls">
          <span>Speed:</span>
          <div className="speed-buttons">
            <button className={playbackRate === 0.5 ? "active" : ""} onClick={() => changePlaybackRate(0.5)}>
              0.5x
            </button>
            <button className={playbackRate === 0.75 ? "active" : ""} onClick={() => changePlaybackRate(0.75)}>
              0.75x
            </button>
            <button className={playbackRate === 1.0 ? "active" : ""} onClick={() => changePlaybackRate(1.0)}>
              1.0x
            </button>
            <button className={playbackRate === 1.5 ? "active" : ""} onClick={() => changePlaybackRate(1.5)}>
              1.5x
            </button>
            <button className={playbackRate === 2.0 ? "active" : ""} onClick={() => changePlaybackRate(2.0)}>
              2.0x
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControl;
