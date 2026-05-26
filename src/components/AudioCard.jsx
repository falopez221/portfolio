import React, { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { playSound, selectSound, tapSound, toggleSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

function formatTime(value) {
  if (!Number.isFinite(value)) return "00:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes.toString().padStart(2, "0")}:${seconds}`;
}

function AudioCard({
  eyebrow,
  title,
  subtitle,
  src,
  durationLabel,
  cover,
  coverText = "CFO",
  appIcon = "POD",
  className = "",
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleLoaded = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setIsAvailable(false);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio || !isAvailable) return;

    playSound(selectSound);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {});
  };

  const handleJump = (delta) => {
    const audio = audioRef.current;
    if (!audio || !isAvailable) return;

    playSound(tapSound);
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + delta));
    setCurrentTime(audio.currentTime);
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio || !isAvailable) return;

    playSound(toggleSound);
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const progress = duration ? `${(currentTime / duration) * 100}%` : "0%";

  return (
    <m.article
      className={`card audio-card interactive-card ${className}`.trim()}
      data-reveal="up"
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.22, ease: premiumEase },
      }}
    >
      <div className="audio-top">
        <div
          className={`album-art ${cover ? "has-cover" : ""}`}
          style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        >
          {!cover ? coverText : null}
        </div>
        <div className="audio-app-icon">{appIcon}</div>
      </div>

      <div className="audio-meta">
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        <p>
          {isAvailable
            ? subtitle
            : "Audio will appear here once /public/audio/fran-intro.mp3 is available."}
        </p>
      </div>

      <div className="audio-progress" aria-hidden="true">
        <div className="audio-progress-fill" style={{ width: progress }} />
      </div>

      <div className="audio-timing">
        <span>{formatTime(currentTime)}</span>
        <span>{duration ? formatTime(duration) : durationLabel}</span>
      </div>

      <div className="audio-controls">
        <button
          type="button"
          className="audio-btn sound-trigger"
          onClick={() => handleJump(-10)}
          disabled={!isAvailable}
        >
          -10
        </button>
        <button
          type="button"
          className="audio-btn play sound-trigger"
          onClick={handleToggle}
          disabled={!isAvailable}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="audio-btn sound-trigger"
          onClick={() => handleJump(10)}
          disabled={!isAvailable}
        >
          +10
        </button>
        <button
          type="button"
          className="audio-btn sound-trigger"
          onClick={handleMute}
          disabled={!isAvailable}
        >
          {isMuted ? "Muted" : "Audio"}
        </button>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </m.article>
  );
}

export default AudioCard;
