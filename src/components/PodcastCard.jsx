import React, { useState } from "react";
import { m } from "framer-motion";
import { hoverSound, playSound, selectSound, tapSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

function PodcastCard({ podcast, onOpenLink }) {
  const [showTakeaways, setShowTakeaways] = useState(false);

  const handleListen = () => {
    playSound(selectSound);
    onOpenLink(podcast.href);
  };

  const handleTakeaways = () => {
    playSound(tapSound);
    setShowTakeaways((current) => !current);
  };

  return (
    <m.article
      className="card podcast-card interactive-card"
      data-reveal="up"
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.22, ease: premiumEase },
      }}
      onMouseEnter={() => playSound(hoverSound)}
    >
      <div className="podcast-card-top">
        <div className="podcast-cover" aria-hidden="true">
          <span>cfo</span>
          <strong>weekly</strong>
        </div>
        <div className="podcast-app-icon" aria-hidden="true" />
      </div>

      <div className="podcast-copy">
        <p className="eyebrow">{podcast.eyebrow}</p>
        <h3>{podcast.title}</h3>
        <strong>{podcast.episode}</strong>
        <p>{podcast.subtitle}</p>
        <span className="podcast-meta">{podcast.metadata}</span>
      </div>

      <div className="podcast-progress" aria-hidden="true">
        <span />
      </div>

      <div className="podcast-actions">
        <button type="button" className="podcast-primary" onClick={handleListen}>
          Listen Officially
        </button>
        <button type="button" className="podcast-secondary" onClick={handleTakeaways}>
          Key Takeaways
        </button>
      </div>

      <div className={`podcast-takeaways ${showTakeaways ? "is-open" : ""}`}>
        {podcast.takeaways.map((takeaway) => (
          <span key={takeaway}>{takeaway}</span>
        ))}
      </div>
    </m.article>
  );
}

export default PodcastCard;
