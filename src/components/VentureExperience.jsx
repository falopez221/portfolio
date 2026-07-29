import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowUpRight,
  Bank,
  Brain,
  CaretDown,
  ChartLineUp,
  CheckCircle,
  Cube,
  Fingerprint,
  GitBranch,
  Graph,
  ShieldCheck,
  Target,
  UserCircle,
} from "@phosphor-icons/react";
import { playSound, selectSound, tapSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

const journeyBlocks = [
  {
    id: "finance",
    title: "Finance & DeFi",
    hash: "0x7A21",
    status: "Foundation",
    icon: Bank,
    summary: "Cash flow, valuation and incentive design establish the financial logic.",
    context: "A finance lens keeps emerging systems grounded in value, risk and adoption.",
    connection: "Moves from capital structure and scenarios into protocol and market mechanics.",
    output: "Comparable assumptions and explicit economic trade-offs.",
    limits: "Models inform judgment; they do not remove market, regulatory or execution risk.",
  },
  {
    id: "agents",
    title: "Agentic Systems",
    hash: "0x3B9F",
    status: "Synthesis",
    icon: Brain,
    summary: "Specialist perspectives compress research without hiding disagreement.",
    context: "Finance, strategy, risk and models contribute through bounded roles.",
    connection: "Turns scattered signals into inspectable hypotheses and evidence gaps.",
    output: "Faster cross-domain synthesis with visible provenance.",
    limits: "No autonomous decisions, capital deployment or private reasoning claims.",
  },
  {
    id: "venture",
    title: "Venture Governance",
    hash: "0xC1D4",
    status: "Building",
    icon: ShieldCheck,
    summary: "A governed environment for exploring opportunities and uncertainty.",
    context: "Venture Governance System starts with a human thesis and explicit authority.",
    connection: "Routes evidence through public specialist agents and quantitative models.",
    output: "Inspectable opportunities, risks, experiments and decision records.",
    limits: "The public Lab is synthetic and decision support remains human-in-command.",
  },
  {
    id: "human",
    title: "Human Gate",
    hash: "0x9E7B",
    status: "Final authority",
    icon: UserCircle,
    summary: "A named person keeps ownership, context and the final decision.",
    context: "Authority is explicit before the system explores alternatives.",
    connection: "Receives evidence, assumptions, dissent and model sensitivity.",
    output: "A decision record with conditions and next review.",
    limits: "The system can recommend what to learn next, never what a person must decide.",
  },
];

const networkNodes = [
  {
    id: "finance",
    title: "Finance",
    hash: "FIN-a1f9",
    status: "Evidence rich",
    icon: ChartLineUp,
    summary: "Capital structure, cash flow and enterprise value.",
    context: "Financial logic provides a common language for comparing alternatives.",
    connection: "Links valuation, scenario analysis and business model economics.",
    output: "Ranges, sensitivities and decision-relevant drivers.",
    limits: "Forecast quality remains bounded by assumptions and available evidence.",
  },
  {
    id: "strategy",
    title: "Strategy",
    hash: "STR-5c8e",
    status: "High signal",
    icon: Target,
    summary: "Positioning, trade-offs and strategic fit.",
    context: "Strategy frames what matters before analysis expands.",
    connection: "Connects market signals to priorities, capabilities and constraints.",
    output: "A clearer choice architecture and practical decision path.",
    limits: "Strategic fit still requires real customer and operating validation.",
  },
  {
    id: "risk",
    title: "Risk",
    hash: "RSK-b3d2",
    status: "Stress tested",
    icon: ShieldCheck,
    summary: "Downside scenarios, controls and uncertainty.",
    context: "Risk is treated as a design input rather than a final disclaimer.",
    connection: "Bridges model sensitivity, evidence quality and governance controls.",
    output: "Explicit failure modes, mitigants and review triggers.",
    limits: "Scenario coverage cannot guarantee completeness.",
  },
  {
    id: "models",
    title: "Models",
    hash: "MOD-e7c4",
    status: "Inspectable",
    icon: Graph,
    summary: "Valuation, Monte Carlo and decision models.",
    context: "Models make assumptions and uncertainty discussable.",
    connection: "Tests whether rankings survive changes in weights and scenarios.",
    output: "Comparable cases with ranges instead of false precision.",
    limits: "Demonstrative outputs are not calibrated probabilities of success.",
  },
  {
    id: "defi",
    title: "DeFi",
    hash: "DFI-d9f1",
    status: "Emerging field",
    icon: Cube,
    summary: "Incentives, liquidity and governance mechanics.",
    context: "DeFi is examined through business value, risk and institutional adoption.",
    connection: "Connects protocol design to finance, behavior and control systems.",
    output: "Scenario-based views of incentives and economic pressure points.",
    limits: "Smart-contract, oracle, liquidity and regulatory risks stay explicit.",
  },
];

const connectionBlocks = [
  {
    id: "valuation",
    title: "Valuation",
    hash: "VLN-a1b2",
    status: "Evidence rich",
    icon: ChartLineUp,
    summary: "Translate assumptions into a defensible enterprise-value range.",
    context: "Cash flow and valuation create the financial baseline.",
    connection: "Links directly to risk, DeFi economics and model sensitivity.",
    output: "Decision ranges instead of a single-point answer.",
    limits: "Outputs remain sensitive to timing, discount rates and terminal assumptions.",
  },
  {
    id: "risk",
    title: "Risk",
    hash: "RSK-d4e5",
    status: "Moderate evidence",
    icon: ShieldCheck,
    summary: "Map material uncertainty to decision impact.",
    context: "Risk converts ambiguity into scenarios and control points.",
    connection: "Bridges valuation, governance and the human review threshold.",
    output: "Visible failure modes and named mitigants.",
    limits: "Unknown unknowns remain outside any bounded scenario set.",
  },
  {
    id: "strategy",
    title: "Strategy",
    hash: "STR-7a8b",
    status: "Evidence rich",
    icon: Target,
    summary: "Rank choices by value creation and strategic fit.",
    context: "Strategy identifies the decision before tools multiply.",
    connection: "Connects finance, market signals and execution priorities.",
    output: "A coherent narrative with explicit trade-offs.",
    limits: "Narrative quality cannot substitute for market evidence.",
  },
  {
    id: "defi",
    title: "DeFi",
    hash: "DFI-d1e2",
    status: "Moderate evidence",
    icon: Cube,
    summary: "Read protocol mechanics through risk and incentives.",
    context: "Digital finance expands the field of business-model design.",
    connection: "Links financial theory to governance and behavioral systems.",
    output: "Inspectable incentive and adoption scenarios.",
    limits: "Technical, market and jurisdictional risks require specialist review.",
  },
  {
    id: "agentic",
    title: "Agentic Systems",
    hash: "AGT-3c4d",
    status: "Evidence rich",
    icon: GitBranch,
    summary: "Orchestrate specialist workflows with traceability.",
    context: "Bounded agents organize parallel perspectives without claiming authority.",
    connection: "Compresses the cycle from analysis to monitoring and review.",
    output: "Faster synthesis with a full trail of assumptions and evidence.",
    limits: "Quality depends on source coverage, model design and governance.",
  },
  {
    id: "governance",
    title: "Venture Governance",
    hash: "GVN-6f7a",
    status: "Building",
    icon: Fingerprint,
    summary: "Keep accountability and optionality visible.",
    context: "The system converts a human thesis into inspectable alternatives.",
    connection: "Coordinates agents, models, evidence and authority boundaries.",
    output: "A governed exploration workflow and decision record.",
    limits: "It supports exploration; it does not validate a startup or authorize investment.",
  },
  {
    id: "decision",
    title: "Human Decision",
    hash: "HUM-9c0d",
    status: "Named owner",
    icon: UserCircle,
    summary: "Close the loop with judgment and ownership.",
    context: "Human accountability is designed into the first step, not added at the end.",
    connection: "Receives findings, uncertainty, dissent and next experiments.",
    output: "A decision with conditions, owner and review date.",
    limits: "The human gate cannot be delegated to the interface.",
  },
];

const tabs = [
  { id: "journey", label: "Journey", meta: "Decision ledger" },
  { id: "network", label: "Network", meta: "Agentic field" },
  { id: "connections", label: "Connections", meta: "Cross-domain synthesis" },
];

function VentureExperience({ onOpenLink }) {
  const [activeTab, setActiveTab] = useState("journey");
  const [selection, setSelection] = useState({
    journey: "venture",
    network: "finance",
    connections: "agentic",
  });
  const [expanded, setExpanded] = useState(true);

  const handleTab = (tabId) => {
    playSound(tapSound);
    setActiveTab(tabId);
    setExpanded(true);
  };

  const handleSelect = (nodeId) => {
    playSound(selectSound);
    setSelection((current) => ({ ...current, [activeTab]: nodeId }));
    setExpanded(true);
  };

  const handleTilt = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--venture-rx", `${((0.5 - y) * 2.5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--venture-ry", `${((x - 0.5) * 3.5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--venture-mx", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--venture-my", `${(y * 100).toFixed(2)}%`);
  };

  const resetTilt = (event) => {
    event.currentTarget.style.setProperty("--venture-rx", "0deg");
    event.currentTarget.style.setProperty("--venture-ry", "0deg");
    event.currentTarget.style.setProperty("--venture-mx", "50%");
    event.currentTarget.style.setProperty("--venture-my", "18%");
  };

  return (
    <div className="venture-page">
      <m.section
        className="venture-intro"
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: premiumEase }}
      >
        <div>
          <p className="eyebrow">FOUNDER | VENTURE GOVERNANCE SYSTEM</p>
          <h1>
            Connecting fields.
            <span> Clarifying decisions.</span>
          </h1>
          <p>
            I move across finance, strategy, DeFi and agentic systems to find the structure
            behind complex problems, while keeping evidence and human ownership visible.
          </p>
        </div>
        <button
          type="button"
          className="venture-link-button"
          onClick={() => onOpenLink("https://venturegovernance.com/")}
        >
          Explore the public system
          <ArrowUpRight size={18} weight="bold" />
        </button>
      </m.section>

      <div className="experience-tabbar" role="tablist" aria-label="Venture views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => handleTab(tab.id)}
          >
            <span>{tab.label}</span>
            <small>{tab.meta}</small>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <m.section
          key={activeTab}
          className={`venture-surface venture-${activeTab}`}
          initial={{ opacity: 0, x: 24, rotateY: -2, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -18, rotateY: 2, filter: "blur(6px)" }}
          transition={{ duration: 0.46, ease: premiumEase }}
          onPointerMove={handleTilt}
          onPointerLeave={resetTilt}
        >
          {activeTab === "journey" ? (
            <JourneyPanel
              nodes={journeyBlocks}
              selectedId={selection.journey}
              onSelect={handleSelect}
              expanded={expanded}
              onToggle={() => setExpanded((current) => !current)}
            />
          ) : null}

          {activeTab === "network" ? (
            <NetworkPanel
              nodes={networkNodes}
              selectedId={selection.network}
              onSelect={handleSelect}
              expanded={expanded}
              onToggle={() => setExpanded((current) => !current)}
            />
          ) : null}

          {activeTab === "connections" ? (
            <ConnectionsPanel
              nodes={connectionBlocks}
              selectedId={selection.connections}
              onSelect={handleSelect}
              expanded={expanded}
              onToggle={() => setExpanded((current) => !current)}
            />
          ) : null}
        </m.section>
      </AnimatePresence>

      <div className="venture-principle">
        <ShieldCheck size={20} weight="duotone" />
        <span>Every link keeps its assumptions, evidence and human owner visible.</span>
      </div>
    </div>
  );
}

function JourneyPanel({ nodes, selectedId, onSelect, expanded, onToggle }) {
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  return (
    <>
      <div className="venture-surface-head">
        <div>
          <p className="eyebrow">CROSS-DOMAIN JOURNEY</p>
          <h2>From financial logic to governed intelligence.</h2>
        </div>
        <span className="surface-seal">HUMAN-IN-COMMAND</span>
      </div>

      <div className="journey-layout">
        <div className="journey-flow" aria-label="Decision journey">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <TraceCard
                node={node}
                active={selectedId === node.id}
                onSelect={() => onSelect(node.id)}
                index={index}
              />
              {index < nodes.length - 1 ? <span className="trace-connector" aria-hidden="true" /> : null}
            </React.Fragment>
          ))}
        </div>
        <NodeDetail node={selected} expanded={expanded} onToggle={onToggle} />
      </div>
    </>
  );
}

function NetworkPanel({ nodes, selectedId, onSelect, expanded, onToggle }) {
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  return (
    <>
      <div className="venture-surface-head">
        <div>
          <p className="eyebrow">GOVERNED INTELLIGENCE FIELD</p>
          <h2>Building systems for better decisions.</h2>
        </div>
        <span className="surface-seal">4 PUBLIC AGENTS | HUMAN GATE</span>
      </div>

      <div className="network-layout">
        <div className="network-field">
          <div className="network-core" aria-label="Venture Governance System">
            <Fingerprint size={34} weight="duotone" />
            <span>VENTURE GOVERNANCE</span>
            <strong>SYSTEM</strong>
            <small>Governed intelligence</small>
          </div>
          <div className="network-human-gate">
            <UserCircle size={18} weight="fill" />
            Human gate
          </div>
          {nodes.map((node, index) => (
            <TraceCard
              key={node.id}
              node={node}
              active={selectedId === node.id}
              onSelect={() => onSelect(node.id)}
              index={index}
              compact
            />
          ))}
        </div>
        <NodeDetail node={selected} expanded={expanded} onToggle={onToggle} />
      </div>
    </>
  );
}

function ConnectionsPanel({ nodes, selectedId, onSelect, expanded, onToggle }) {
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  return (
    <>
      <div className="venture-surface-head">
        <div>
          <p className="eyebrow">CROSS-DOMAIN KNOWLEDGE LEDGER</p>
          <h2>Fast connections, full trace.</h2>
        </div>
        <span className="surface-seal">SELECT A FIELD</span>
      </div>

      <div className="connections-layout">
        <div className="connections-stack">
          {nodes.map((node, index) => (
            <TraceCard
              key={node.id}
              node={node}
              active={selectedId === node.id}
              onSelect={() => onSelect(node.id)}
              index={index}
              horizontal
            />
          ))}
        </div>
        <NodeDetail node={selected} expanded={expanded} onToggle={onToggle} />
      </div>
    </>
  );
}

function TraceCard({ node, active, onSelect, index, compact = false, horizontal = false }) {
  const Icon = node.icon;

  return (
    <m.button
      type="button"
      className={`trace-card ${active ? "active" : ""} ${compact ? "compact" : ""} ${
        horizontal ? "horizontal" : ""
      }`}
      onClick={onSelect}
      style={{ "--trace-index": index }}
      data-node={node.id}
      whileHover={{ y: -5, z: 30, transition: { duration: 0.2, ease: premiumEase } }}
      whileTap={{ scale: 0.985 }}
    >
      <span className="trace-icon">
        <Icon size={22} weight="duotone" />
      </span>
      <span className="trace-copy">
        <span className="trace-meta">
          <small>{node.hash}</small>
          <small>{node.status}</small>
        </span>
        <strong>{node.title}</strong>
        <span>{node.summary}</span>
      </span>
      <CheckCircle size={17} weight={active ? "fill" : "regular"} className="trace-check" />
    </m.button>
  );
}

function NodeDetail({ node, expanded, onToggle }) {
  return (
    <aside className="node-detail" aria-live="polite">
      <div className="node-detail-head">
        <span className="node-detail-hash">{node.hash}</span>
        <span>{node.status}</span>
      </div>
      <h3>{node.title}</h3>
      <p>{node.summary}</p>

      <button
        type="button"
        className="node-detail-toggle"
        aria-expanded={expanded}
        onClick={() => {
          playSound(tapSound);
          onToggle();
        }}
      >
        {expanded ? "Show less" : "Show more"}
        <m.span animate={{ rotate: expanded ? 180 : 0 }}>
          <CaretDown size={16} weight="bold" />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <m.div
            className="node-detail-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: premiumEase }}
          >
            <DetailRow label="Context" text={node.context} />
            <DetailRow label="Connection" text={node.connection} />
            <DetailRow label="Output" text={node.output} />
            <DetailRow label="Limits" text={node.limits} />
          </m.div>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}

function DetailRow({ label, text }) {
  return (
    <div className="node-detail-row">
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
  );
}

export default VentureExperience;
