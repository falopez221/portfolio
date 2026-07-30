import React, { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { hoverSound, playSound, selectSound, tapSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

const workflowModeLabels = {
  finance: "Financial Modeling Engine",
  deck: "Executive Storytelling System",
  sync: "Collaboration Network",
  research: "Intelligence Radar",
};

const collaborationNodes = ["Finance", "Strategy", "Leadership", "Delivery"];

function WorkflowShowcase({ apps = [] }) {
  const [activeId, setActiveId] = useState(apps[0]?.id ?? "");
  const activeApp = apps.find((app) => app.id === activeId) ?? apps[0];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeActionIndex, setActiveActionIndex] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();
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
  const detailValues = activeDetail.values?.length
    ? activeDetail.values
    : metrics.map((metric) => metric.value);
  const modeLabel = activeApp.systemName ?? workflowModeLabels[activeApp.board] ?? "Executive System";

  const handlePointerMove = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    event.currentTarget.style.setProperty("--workflow-mx", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--workflow-my", `${(y * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--workflow-rx", `${((0.5 - y) * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--workflow-ry", `${((x - 0.5) * 7).toFixed(2)}deg`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--workflow-mx", "72%");
    event.currentTarget.style.setProperty("--workflow-my", "18%");
    event.currentTarget.style.setProperty("--workflow-rx", "0deg");
    event.currentTarget.style.setProperty("--workflow-ry", "0deg");
  };

  const selectApp = (appId) => {
    if (appId === activeApp.id) return;
    playSound(selectSound);
    setActiveTabIndex(0);
    setActiveActionIndex(0);
    setActiveId(appId);
    setTransitionKey((current) => current + 1);
  };

  const selectTab = (index) => {
    if (index === activeTabIndex) return;
    playSound(tapSound);
    setActiveTabIndex(index);
    setTransitionKey((current) => current + 1);
  };

  const selectAction = (index) => {
    if (index === activeActionIndex) return;
    playSound(tapSound);
    setActiveActionIndex(index);
    setTransitionKey((current) => current + 1);
  };

  return (
    <m.article
      className={`card workflow-card workflow-command-center interactive-card workflow-${activeApp.accent}`}
      data-reveal="up"
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -2,
              scale: 1.003,
              transition: { duration: 0.24, ease: premiumEase },
            }
      }
    >
      <span className="workflow-command-glow" aria-hidden="true" />

      <div className="workflow-topline">
        <div>
          <p className="eyebrow">WORKFLOW STACK</p>
          <strong className="workflow-command-title">Executive Workflow Command Center</strong>
        </div>
        <div className="workflow-live-label">
          <span aria-hidden="true" />
          <small>LIVE WORKSPACE</small>
          <strong>{modeLabel}</strong>
        </div>
      </div>

      <div className="workflow-stage">
        <aside className="workflow-dock">
          <div className="workflow-app-bar" role="tablist" aria-label="Workflow apps">
            {apps.map((app) => {
              const isActive = app.id === activeApp.id;

              return (
                <button
                  key={app.id}
                  type="button"
                  role="tab"
                  className={`workflow-app-pill workflow-app-${app.accent} ${
                    isActive ? "active" : ""
                  }`}
                  aria-selected={isActive}
                  aria-controls="workflow-command-panel"
                  onClick={() => selectApp(app.id)}
                  onMouseEnter={() => playSound(hoverSound)}
                >
                  <span className="workflow-app-aura" aria-hidden="true" />
                  <span className={`workflow-app-icon ${app.accent}`}>{app.icon}</span>
                  <span className="workflow-app-copy">
                    <strong>{app.label}</strong>
                    <small>{workflowModeLabels[app.board]}</small>
                  </span>
                  <span className="workflow-app-signal" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className={`workflow-status-panel ${activeApp.accent}`}>
            <div className="workflow-status-head">
              <span className="workflow-status-pulse" aria-hidden="true" />
              <p className="eyebrow">ACTIVE MODE</p>
            </div>
            <strong>{modeLabel}</strong>
            <span className="workflow-system-active">System active</span>
            <div className="workflow-status-metrics">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <small>{metric.label}</small>
                  <span>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div
          id="workflow-command-panel"
          className={`workflow-browser ${activeApp.accent}`}
          role="tabpanel"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <span className="workflow-browser-grid" aria-hidden="true" />
          <span className="workflow-browser-orbit workflow-browser-orbit-one" aria-hidden="true" />
          <span className="workflow-browser-orbit workflow-browser-orbit-two" aria-hidden="true" />

          <div className="workflow-browser-head">
            <div>
              <span className="workflow-browser-mark" aria-hidden="true" />
              <span>{activeApp.browserLabel}</span>
            </div>
            <div className="workflow-browser-health">
              <span aria-hidden="true" />
              <small>CONNECTED</small>
            </div>
          </div>

          <div className="workflow-browser-tabs" role="tablist" aria-label={`${activeApp.label} views`}>
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={index === activeTabIndex}
                className={`workflow-browser-tab ${index === activeTabIndex ? "active" : ""}`}
                onMouseEnter={() => playSound(hoverSound)}
                onClick={() => selectTab(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{tab}</strong>
              </button>
            ))}
          </div>

          <div className="workflow-command-transition">
            <AnimatePresence mode="sync" initial={false}>
              <m.div
                key={`${activeApp.id}-${transitionKey}`}
                className="workflow-command-body"
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 0.965, rotateY: -7, filter: "blur(12px)" }
                }
                animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.97, rotateY: 8, filter: "blur(10px)" }
                }
                transition={{ duration: shouldReduceMotion ? 0 : 0.58, ease: premiumEase }}
              >
              <section className="workflow-copy">
                <div className="workflow-copy-heading">
                  <p className="eyebrow">{activeApp.eyebrow}</p>
                  <span>{activeTab}</span>
                </div>
                <h3>{activeApp.title}</h3>
                <p>{activeApp.summary}</p>

                <div className="workflow-action-list" aria-label={`${activeApp.label} workflow`}>
                  {actions.map((action, index) => (
                    <button
                      key={action}
                      type="button"
                      className={`workflow-action-card ${
                        index === activeActionIndex ? "active" : ""
                      }`}
                      aria-pressed={index === activeActionIndex}
                      onMouseEnter={() => playSound(hoverSound)}
                      onClick={() => selectAction(index)}
                    >
                      <span className="workflow-action-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="workflow-action-copy">
                        <small>{index === activeActionIndex ? "ACTIVE STEP" : "NEXT STEP"}</small>
                        <strong>{action}</strong>
                      </span>
                      <span className="workflow-action-node" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </section>

              <section className="workflow-command-visual">
                <div className="workflow-scene-header">
                  <div>
                    <small>{modeLabel}</small>
                    <strong>{activeDetail.label}</strong>
                  </div>
                  <span className="workflow-board-pill">{activeAction}</span>
                </div>

                <div className="workflow-scene-perspective">
                  <WorkflowModeScene
                    type={activeApp.board}
                    values={detailValues}
                    tabIndex={activeTabIndex}
                    actionIndex={activeActionIndex}
                  />
                </div>

                <div className="workflow-scene-footer">
                  <div className="workflow-scene-insight">
                    <small>CURRENT FOCUS</small>
                    <p>{activeDetail.insight}</p>
                  </div>
                  <div className="workflow-scene-values" aria-label="Active inputs">
                    {detailValues.map((value, index) => (
                      <span key={`${value}-${index}`}>{value}</span>
                    ))}
                  </div>
                </div>
              </section>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </m.article>
  );
}

function WorkflowModeScene({ type = "finance", values = [], tabIndex = 0, actionIndex = 0 }) {
  const sceneClassName = `workflow-mode-scene workflow-mode-${type} tab-${tabIndex + 1} action-${
    actionIndex + 1
  }`;

  if (type === "deck") {
    return (
      <div className={sceneClassName} aria-hidden="true">
        <div className="workflow-deck-engine">
          <span className="workflow-deck-halo" />
          <span className="workflow-story-path">
            <i />
          </span>
          {values.slice(0, 3).map((value, index) => (
            <div
              key={`${value}-${index}`}
              className={`workflow-slide workflow-slide-${index + 1}`}
              style={{ "--scene-index": index }}
            >
              <span className="workflow-slide-kicker" />
              <div className="workflow-slide-chart">
                <i />
                <i />
                <i />
              </div>
              <em data-label={value} />
            </div>
          ))}
          <div className="workflow-story-nodes">
            <span data-label="ANALYSIS" />
            <span data-label="INSIGHT" />
            <span data-label="DECISION" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "sync") {
    return (
      <div className={sceneClassName} aria-hidden="true">
        <div className="workflow-network-engine">
          <svg className="workflow-network-lines" viewBox="0 0 420 280" focusable="false">
            <path d="M210 140 L82 62" />
            <path d="M210 140 L338 62" />
            <path d="M210 140 L70 220" />
            <path d="M210 140 L350 220" />
          </svg>
          <span className="workflow-network-orbit workflow-network-orbit-one" />
          <span className="workflow-network-orbit workflow-network-orbit-two" />
          <div className="workflow-network-core" data-label="SYNC">
            <span />
          </div>
          {collaborationNodes.map((node, index) => (
            <span
              key={node}
              className={`workflow-network-node workflow-network-node-${index + 1}`}
              data-label={node}
            />
          ))}
          <span className="workflow-message-pulse workflow-message-pulse-one" />
          <span className="workflow-message-pulse workflow-message-pulse-two" />
          <span className="workflow-message-pulse workflow-message-pulse-three" />
        </div>
      </div>
    );
  }

  if (type === "research") {
    return (
      <div className={sceneClassName} aria-hidden="true">
        <div className="workflow-radar-engine">
          <div className="workflow-radar-disc">
            <span className="workflow-radar-ring workflow-radar-ring-one" />
            <span className="workflow-radar-ring workflow-radar-ring-two" />
            <span className="workflow-radar-ring workflow-radar-ring-three" />
            <span className="workflow-radar-axis workflow-radar-axis-x" />
            <span className="workflow-radar-axis workflow-radar-axis-y" />
            <span className="workflow-radar-sweep" />
            <span className="workflow-radar-core" />
          </div>
          {values.slice(0, 3).map((value, index) => (
            <span
              key={`${value}-${index}`}
              className={`workflow-radar-signal workflow-radar-signal-${index + 1}`}
              data-label={value}
            />
          ))}
          <span className="workflow-research-document workflow-research-document-one" />
          <span className="workflow-research-document workflow-research-document-two" />
          <span className="workflow-research-document workflow-research-document-three" />
        </div>
      </div>
    );
  }

  return (
    <div className={sceneClassName} aria-hidden="true">
      <div className="workflow-finance-engine">
        <span className="workflow-finance-orbit" />
        <div className="workflow-workbook-stack">
          {[0, 1, 2].map((sheetIndex) => (
            <div
              key={sheetIndex}
              className={`workflow-workbook-sheet workflow-workbook-sheet-${sheetIndex + 1}`}
            >
              <span className="workflow-sheet-tab" />
              <div className="workflow-sheet-grid">
                {Array.from({ length: 15 }, (_, cellIndex) => (
                  <i key={cellIndex} style={{ "--cell-index": cellIndex }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="workflow-engine-bars">
          {values.slice(0, 4).map((value, index) => (
            <span
              key={`${value}-${index}`}
              className={`workflow-engine-bar workflow-engine-bar-${index + 1}`}
              style={{ "--scene-index": index }}
            >
              <em data-label={value} />
            </span>
          ))}
        </div>
        <span className="workflow-value-beam">
          <i />
        </span>
      </div>
    </div>
  );
}

export default WorkflowShowcase;
