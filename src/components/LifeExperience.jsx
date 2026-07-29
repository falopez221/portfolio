import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  Headphones,
  Heartbeat,
  MusicNotes,
  PersonSimpleSwim,
  PersonSimpleWalk,
  PingPong,
  SoccerBall,
  TennisBall,
  Waveform,
} from "@phosphor-icons/react";
import AudioCard from "./AudioCard.jsx";
import PhotoCard from "./PhotoCard.jsx";
import PodcastCard from "./PodcastCard.jsx";
import { audioIntro, currentPodcast, photoCards } from "../data/content.js";
import { playSound, selectSound, tapSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

const sports = [
  {
    id: "football",
    title: "Football",
    hash: "MOV-11A",
    icon: SoccerBall,
    summary: "Read space quickly, share tempo and adapt with the team.",
    connection: "Fast pattern recognition becomes clearer when every move depends on others.",
    signal: "Team rhythm",
  },
  {
    id: "tennis",
    title: "Tennis",
    hash: "MOV-22B",
    icon: TennisBall,
    summary: "Anticipation, focus and controlled decisions under pressure.",
    connection: "A point is a short strategy cycle: observe, choose, execute, reset.",
    signal: "Focused pressure",
  },
  {
    id: "pingpong",
    title: "Table tennis",
    hash: "MOV-33C",
    icon: PingPong,
    summary: "Speed, reflexes and immediate adjustment to changing angles.",
    connection: "Small changes create instant consequences, sharpening feedback loops.",
    signal: "Rapid feedback",
  },
  {
    id: "swimming",
    title: "Swimming",
    hash: "MOV-44D",
    icon: PersonSimpleSwim,
    summary: "Rhythm, endurance and a clean mental reset.",
    connection: "Repetition creates room for deeper thinking without adding noise.",
    signal: "Endurance",
  },
  {
    id: "walking",
    title: "Walking",
    hash: "MOV-55E",
    icon: PersonSimpleWalk,
    summary: "Distance from the screen helps ideas connect naturally.",
    connection: "Long-form thinking often appears once the pace becomes deliberate.",
    signal: "Perspective",
  },
];

const listeningModes = [
  {
    title: "Focus",
    hash: "SND-A17",
    icon: Headphones,
    text: "Music creates a clean boundary around deep work.",
  },
  {
    title: "Reset",
    hash: "SND-B28",
    icon: Waveform,
    text: "A different rhythm helps release one problem before entering the next.",
  },
  {
    title: "Curiosity",
    hash: "SND-C39",
    icon: MusicNotes,
    text: "Listening keeps the portfolio personal without weakening its professional signal.",
  },
];

function LifeExperience({ onOpenLink }) {
  const [activeTab, setActiveTab] = useState("sport");
  const [selectedSport, setSelectedSport] = useState("football");

  const handleTab = (tabId) => {
    playSound(tapSound);
    setActiveTab(tabId);
  };

  return (
    <div className="life-page">
      <m.section
        className="life-intro"
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.68, ease: premiumEase }}
      >
        <div>
          <p className="eyebrow">OUTSIDE THE DECK</p>
          <h1>
            Movement and music
            <span> keep the signal clear.</span>
          </h1>
        </div>
        <p>
          Sport trains pace, anticipation and reset. Music creates space to focus, decompress
          and connect ideas across different fields.
        </p>
      </m.section>

      <div className="experience-tabbar life-tabbar" role="tablist" aria-label="Personal interests">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "sport"}
          className={activeTab === "sport" ? "active" : ""}
          onClick={() => handleTab("sport")}
        >
          <span>Sport</span>
          <small>Movement network</small>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "music"}
          className={activeTab === "music" ? "active" : ""}
          onClick={() => handleTab("music")}
        >
          <span>Music</span>
          <small>Listening system</small>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <m.section
          key={activeTab}
          className={`life-surface life-${activeTab}`}
          initial={{ opacity: 0, y: 20, rotateX: -2, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, rotateX: 2, filter: "blur(6px)" }}
          transition={{ duration: 0.46, ease: premiumEase }}
        >
          {activeTab === "sport" ? (
            <SportPanel selectedId={selectedSport} onSelect={setSelectedSport} />
          ) : (
            <MusicPanel onOpenLink={onOpenLink} />
          )}
        </m.section>
      </AnimatePresence>

      <section className="life-photo-section">
        <div className="life-photo-heading">
          <div>
            <p className="eyebrow">PERSONAL CONTEXT</p>
            <h2>A human layer, edited with restraint.</h2>
          </div>
          <p>One gallery, intentional crops and no repeated photo cards.</p>
        </div>
        <PhotoCard {...photoCards[0]} depth={0.1} />
      </section>
    </div>
  );
}

function SportPanel({ selectedId, onSelect }) {
  const selected = sports.find((sport) => sport.id === selectedId) ?? sports[0];
  const SelectedIcon = selected.icon;

  const handleSelect = (id) => {
    playSound(selectSound);
    onSelect(id);
  };

  return (
    <div className="sport-layout">
      <div className="sport-network">
        <div className="sport-core">
          <Heartbeat size={36} weight="duotone" />
          <span>MOVEMENT</span>
          <strong>Reset the model</strong>
          <small>Five ways to sharpen pace and perspective</small>
        </div>

        <div className="sport-orbit-grid">
          {sports.map((sport, index) => {
            const Icon = sport.icon;
            const active = selected.id === sport.id;

            return (
              <m.button
                key={sport.id}
                type="button"
                className={`sport-node ${active ? "active" : ""}`}
                onClick={() => handleSelect(sport.id)}
                style={{ "--sport-index": index }}
                whileHover={{ y: -7, z: 34, rotateX: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="sport-node-icon">
                  <Icon size={26} weight="duotone" />
                </span>
                <span>
                  <small>{sport.hash}</small>
                  <strong>{sport.title}</strong>
                  <em>{sport.signal}</em>
                </span>
              </m.button>
            );
          })}
        </div>
      </div>

      <aside className="sport-detail" aria-live="polite">
        <span className="sport-detail-icon">
          <SelectedIcon size={34} weight="duotone" />
        </span>
        <p className="eyebrow">{selected.hash} | ACTIVE CONNECTION</p>
        <h2>{selected.title}</h2>
        <p>{selected.summary}</p>
        <div>
          <strong>Connection</strong>
          <span>{selected.connection}</span>
        </div>
      </aside>
    </div>
  );
}

function MusicPanel({ onOpenLink }) {
  return (
    <>
      <div className="music-system">
        <div className="music-system-copy">
          <p className="eyebrow">LISTENING SYSTEM</p>
          <h2>Sound changes the pace without changing the standard.</h2>
          <p>
            Music is the quieter layer of the portfolio: a way to focus, reset and return to
            analytical work with more distance.
          </p>
        </div>

        <div className="music-depth-stack">
          {listeningModes.map((mode, index) => {
            const Icon = mode.icon;

            return (
              <m.article
                key={mode.title}
                className="music-mode-card"
                style={{ "--music-index": index }}
                whileHover={{ x: 8, z: 32, rotateY: -2 }}
              >
                <span>
                  <Icon size={23} weight="duotone" />
                </span>
                <div>
                  <small>{mode.hash}</small>
                  <strong>{mode.title}</strong>
                  <p>{mode.text}</p>
                </div>
              </m.article>
            );
          })}
        </div>
      </div>

      <div className="music-card-grid">
        <AudioCard {...audioIntro} className="life-audio-card" />
        <PodcastCard podcast={currentPodcast} onOpenLink={onOpenLink} />
      </div>
    </>
  );
}

export default LifeExperience;
