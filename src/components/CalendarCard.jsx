import React, { useMemo, useState } from "react";
import { m } from "framer-motion";
import { hoverSound, playSound, selectSound, tapSound } from "../utils/sounds";

const durations = ["15", "25", "30", "45", "60"];
const premiumEase = [0.22, 1, 0.36, 1];

function CalendarCard({ eyebrow, title, timezone, days = [], events = [], compact = false }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [motionKey, setMotionKey] = useState(0);

  const enhancedEvents = useMemo(
    () =>
      events.map((event, index) => ({
        ...event,
        contact: index === 0 ? "Networking" : index === 1 ? "Research" : "Open",
      })),
    [events]
  );

  const selectedDay = days[selectedDayIndex] ?? days[0];

  return (
    <m.article
      className={`card calendar-card interactive-card ${compact ? "is-compact" : ""}`}
      data-reveal="up"
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.22, ease: premiumEase },
      }}
    >
      <div className="calendar-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <span className="calendar-chip">{timezone}</span>
      </div>

      <div className="calendar-subhead">
        <strong>{selectedDay ? `${selectedDay[0]}, ${selectedDay[1]}` : "Selected day"}</strong>
        <span>Interactive planning view</span>
      </div>

      <div className="calendar-week">
        {days.map(([day, number], index) => (
          <button
            key={`${day}-${number}`}
            type="button"
            className={`calendar-day ${index === selectedDayIndex ? "selected" : ""}`}
            onClick={() => {
              playSound(selectSound);
              setSelectedDayIndex(index);
              setMotionKey((current) => current + 1);
            }}
            onMouseEnter={() => playSound(hoverSound)}
          >
            <span>{day}</span>
            <strong>{number}</strong>
          </button>
        ))}
      </div>

      <div className="calendar-scroll-shell">
        <div key={motionKey} className="calendar-events is-scrollable">
          {enhancedEvents.map((event, index) => (
            <button
              key={`${event.title}-${event.time}`}
              type="button"
              className={`calendar-event ${event.type}`}
              onClick={() => playSound(tapSound)}
              onMouseEnter={() => playSound(hoverSound)}
            >
              <div className="event-main">
                <h4>{event.title}</h4>
                <p>{event.time}</p>
                <small>{event.detail}</small>
              </div>

              <div className="event-side">
                <div className="event-badge">{event.badge}</div>
                <span className="event-contact">{event.contact}</span>
                <span className="event-order">0{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-controls">
        <div className="calendar-control-card">
          <p className="eyebrow">DAYS OF THE WEEK</p>
          <div className="calendar-control-row">
            {days.slice(0, 7).map(([day], index) => (
              <button
                key={day}
                type="button"
                className={`calendar-control-pill ${index === selectedDayIndex ? "active" : ""}`}
                onClick={() => {
                  playSound(selectSound);
                  setSelectedDayIndex(index);
                  setMotionKey((current) => current + 1);
                }}
                onMouseEnter={() => playSound(hoverSound)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="calendar-control-card">
          <p className="eyebrow">DURATION</p>
          <div className="calendar-control-row duration-row">
            {durations.map((duration) => (
              <button
                key={duration}
                type="button"
                className={`calendar-duration-chip ${
                  duration === selectedDuration ? "active" : ""
                }`}
                onClick={() => {
                  playSound(selectSound);
                  setSelectedDuration(duration);
                  setMotionKey((current) => current + 1);
                }}
                onMouseEnter={() => playSound(hoverSound)}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      </div>
    </m.article>
  );
}

export default CalendarCard;
