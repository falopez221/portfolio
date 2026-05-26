import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { hoverSound, playSound, selectSound, tapSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

function WorkflowShowcase({ apps = [] }) {
  const [activeId, setActiveId] = useState(apps[0]?.id ?? "");
  const activeApp = apps.find((app) => app.id === activeId) ?? apps[0];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeActionIndex, setActiveActionIndex] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);
  const tabs = activeApp?.browserTabs ?? [];
  const actions = activeApp?.actions ?? [];
  const metrics = activeApp?.metrics ?? [];

  useEffect(() => {
    setActiveTabIndex(0);
    setActiveActionIndex(0);
  }, [activeId]);

  if (!activeApp) return null;

  const activeTab = tabs[activeTabIndex] ?? tabs[0] ?? activeApp.browserLabel;
  const activeAction = actions[activeActionIndex] ?? actions[0] ?? activeApp.browserLabel;
  const activeDetail = activeApp.tabDetails?.[activeTabIndex] ?? {
    label: activeTab,
    insight: activeApp.summary,
    values: metrics.map((metric) => metric.value),
  };
  const detailValues = activeDetail.values?.length ? activeDetail.values : metrics.map((metric) => metric.value);

  return (
    <m.article
      className={`card workflow-card interactive-card workflow-${activeApp.accent}`}
      data-reveal="up"
      whileHover={{
        y: -4,
        scale: 1.01,
        transition: { duration: 0.22, ease: premiumEase },
      }}
    >
      <div className="workflow-topline">
        <p className="eyebrow">WORKFLOW STACK</p>
        <span className="workflow-hint">Executive tools, cleaner outputs</span>
      </div>

      <div className="workflow-stage">
        <aside className="workflow-dock">
          <div className="workflow-app-bar" role="tablist" aria-label="Workflow apps">
            {apps.map((app) => (
              <button
                key={app.id}
                type="button"
                className={`workflow-app-pill ${app.id === activeApp.id ? "active" : ""}`}
                aria-pressed={app.id === activeApp.id}
                onClick={() => {
                  playSound(selectSound);
                  setActiveId(app.id);
                  setTransitionKey((current) => current + 1);
                }}
                onMouseEnter={() => playSound(hoverSound)}
              >
                <span className={`workflow-app-icon ${app.accent}`}>{app.icon}</span>
                <span>{app.label}</span>
              </button>
            ))}
          </div>

          <div className={`workflow-status-panel ${activeApp.accent}`}>
            <p className="eyebrow">ACTIVE MODE</p>
            <strong>{activeApp.browserLabel}</strong>
            <span>{metrics[2]?.value}</span>
          </div>
        </aside>

        <div key={activeApp.id} className={`workflow-browser ${activeApp.accent}`}>
          <div className="workflow-floating-chip chip-left">{metrics[0]?.value}</div>
          <div className="workflow-floating-chip chip-right">{metrics[1]?.value}</div>

          <div className="workflow-browser-head">
            <span className="workflow-browser-mark" />
            <span>{activeApp.browserLabel}</span>
          </div>

          <div className="workflow-browser-tabs">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`workflow-browser-tab ${index === activeTabIndex ? "active" : ""}`}
                onMouseEnter={() => playSound(hoverSound)}
                onClick={() => {
                  playSound(tapSound);
                  setActiveTabIndex(index);
                  setTransitionKey((current) => current + 1);
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div
            key={`${activeApp.id}-${transitionKey}`}
            className={`workflow-browser-body is-board tab-motion-${activeTabIndex + 1}`}
          >
            <div className="workflow-copy">
              <p className="eyebrow">{activeApp.eyebrow}</p>
              <h3>{activeApp.title}</h3>
              <p>{activeApp.summary}</p>

              <div className="workflow-action-list">
                {actions.map((action, index) => (
                  <button
                    key={action}
                    type="button"
                    className={`workflow-action-card ${index === activeActionIndex ? "active" : ""}`}
                    onMouseEnter={() => playSound(hoverSound)}
                    onClick={() => {
                      playSound(tapSound);
                      setActiveActionIndex(index);
                    }}
                  >
                    <span className="workflow-action-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong>{action}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="workflow-board-wrap">
              <div className={`workflow-board ${activeApp.accent}`}>
                <div className="workflow-board-header">
                  <div>
                    <small>{activeApp.browserLabel}</small>
                    <strong>{activeTab}</strong>
                  </div>
                  <span className="workflow-board-pill">{activeAction}</span>
                </div>

                <div className={`workflow-board-grid ${activeApp.board || "finance"}`}>
                  <div className="workflow-board-panel workflow-board-chart">
                    <small>{activeDetail.label}</small>
                    <BoardVisual
                      type={activeApp.board}
                      tabIndex={activeTabIndex}
                      values={detailValues}
                    />
                  </div>

                  <div className="workflow-board-panel workflow-board-insight">
                    <small>Current focus</small>
                    <strong>{activeDetail.label}</strong>
                    <p>{activeDetail.insight}</p>
                  </div>

                  <div className="workflow-board-panel workflow-board-list">
                    <small>Inputs</small>
                    {detailValues.map((value) => (
                      <span key={value}>{value}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.article>
  );
}

function BoardVisual({ type = "finance", tabIndex = 0, values = [] }) {
  if (type === "deck") {
    return (
      <div className={`workflow-deck-visual tab-${tabIndex + 1}`}>
        <div className="deck-slide-main">
          <span />
          <strong>{values[0]}</strong>
          <p>{values[1]}</p>
        </div>
        <div className="deck-slide-strip">
          {values.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "sync") {
    return (
      <div className={`workflow-sync-visual tab-${tabIndex + 1}`}>
        {values.map((value, index) => (
          <div key={value} className="sync-row">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (type === "research") {
    return (
      <div className={`workflow-research-visual tab-${tabIndex + 1}`}>
        {values.map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    );
  }

  return (
    <div className={`workflow-finance-visual tab-${tabIndex + 1}`}>
      <div className="finance-waterfall">
        {values.map((value, index) => (
          <span key={value} style={{ "--bar-index": index }}>
            <em>{value}</em>
          </span>
        ))}
      </div>
      <div className="finance-sensitivity">
        {values.map((value, index) => (
          <span key={`${value}-cell-${index}`} className={`cell-${index + 1}`}>
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WorkflowShowcase;
