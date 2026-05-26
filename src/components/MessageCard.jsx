import React from "react";
import { hoverSound, playSound, tapSound } from "../utils/sounds";

function MessageCard({ name, prompt, reply, onEmail, avatar }) {
  return (
    <article className="card message-card interactive-card section-tone-product" data-reveal="up">
      <div className="message-thread">
        <div className="message-row incoming">
          <div
            className={`message-avatar ${avatar ? "has-image" : ""}`}
            style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
            aria-hidden="true"
          >
            {!avatar ? name.slice(0, 1) : null}
          </div>

          <div className="message-bubble incoming">
            <span className="message-author">{name}</span>
            <p>{prompt}</p>
          </div>
        </div>

        <div className="message-row outgoing">
          <span className="message-status">Delivered</span>
          <div className="message-bubble outgoing">
            <p>{reply}</p>
          </div>
        </div>
      </div>

      <div className="message-compose">
        <div className="message-shortcuts">
          <button
            type="button"
            className="message-icon-btn"
            onClick={() => {
              playSound(tapSound);
              onEmail();
            }}
            onMouseEnter={() => playSound(hoverSound)}
            aria-label="Email Fran"
          >
            Mail
          </button>
          <button
            type="button"
            className="message-icon-btn"
            onClick={() => {
              playSound(tapSound);
              onEmail();
            }}
            onMouseEnter={() => playSound(hoverSound)}
            aria-label="Start conversation"
          >
            Talk
          </button>
        </div>

        <button
          type="button"
          className="message-input"
          onClick={() => {
            playSound(tapSound);
            onEmail();
          }}
          onMouseEnter={() => playSound(hoverSound)}
        >
          <span>Start a conversation</span>
          <span className="message-send">Go</span>
        </button>
      </div>
    </article>
  );
}

export default MessageCard;
