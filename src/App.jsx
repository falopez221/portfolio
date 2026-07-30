import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import {
  hoverSound,
  playEpicIntroSound,
  playSound,
  selectSound,
  stopEpicIntroSound,
  tapSound,
  toggleSound,
} from "./utils/sounds";
import {
  calendarCard,
  contactCards,
  experienceCards,
  profile,
  workflowApps,
} from "./data/content.js";
import CalendarCard from "./components/CalendarCard.jsx";
import AppleCursorGlow from "./components/AppleCursorGlow.jsx";
import WorkflowShowcase from "./components/WorkflowShowcase.jsx";
import MessageCard from "./components/MessageCard.jsx";
import VentureExperience from "./components/VentureExperience.jsx";
import LifeExperience from "./components/LifeExperience.jsx";
import CinematicIntro from "./components/CinematicIntro.jsx";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Work", id: "work" },
  { label: "Venture", id: "venture" },
  { label: "Life", id: "life" },
  { label: "Contact", id: "contact" },
];

const premiumEase = [0.22, 1, 0.36, 1];

const viewVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      ease: premiumEase,
      staggerChildren: 0.09,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(8px)",
    transition: { duration: 0.28, ease: premiumEase },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: premiumEase, staggerChildren: 0.09 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: premiumEase },
  },
};

const premiumHover = {
  y: -4,
  scale: 1.02,
  transition: { duration: 0.22, ease: premiumEase },
};

const homePaths = [
  {
    id: "work",
    title: "Executive toolkit",
    label: "WORK",
    text: "Valuation, scenarios, research and decision-ready output.",
    tone: "work",
  },
  {
    id: "venture",
    title: "Governed intelligence",
    label: "VENTURE",
    text: "Three interactive 3D views connecting finance, agents and human authority.",
    tone: "venture",
  },
  {
    id: "life",
    title: "Movement and sound",
    label: "LIFE",
    text: "Sport, music and personal context with the same deliberate design.",
    tone: "life",
  },
];

const contactTopics = [
  {
    label: "Networking",
    description: "Consulting, finance and shared interests.",
    subject: "Networking conversation",
    body: "Hi Francisco, I would like to connect and talk about consulting, finance and your current path.",
  },
  {
    label: "Recruiting / CV",
    description: "Profile fit, roles and next steps.",
    subject: "Profile and CV conversation",
    body: "Hi Francisco, I reviewed your portfolio and would like to discuss your profile and CV.",
  },
  {
    label: "Valuation",
    description: "Cash flow, scenarios and enterprise value.",
    subject: "Valuation and finance conversation",
    body: "Hi Francisco, I would like to talk about valuation, cash flow analysis and finance topics.",
  },
  {
    label: "Coffee chat",
    description: "A focused, informal introduction.",
    subject: "Coffee chat",
    body: "Hi Francisco, I would like to schedule a quick coffee chat.",
  },
];

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState("light");
  const [introVisible, setIntroVisible] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);

  const handleIntroComplete = useCallback(() => {
    stopEpicIntroSound();
    setIntroVisible(false);
    setPageReady(true);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("fran-theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(storedTheme || (preferredDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("fran-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleRipple = (event) => {
      const target = event.target.closest(
        "button, .primary-button, .secondary-button, .contact-action-button, .podcast-primary, .podcast-secondary"
      );
      if (!target || target.disabled) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      ripple.className = "button-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 560);
    };

    document.addEventListener("pointerdown", handleRipple, { passive: true });
    return () => document.removeEventListener("pointerdown", handleRipple);
  }, []);

  useEffect(() => {
    if (!introVisible) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let hasStartedSound = false;
    let isStartingSound = false;

    const removeSoundFallback = () => {
      window.removeEventListener("pointerdown", startIntroSound);
      window.removeEventListener("keydown", startIntroSound);
    };

    const startIntroSound = async () => {
      if (hasStartedSound || isStartingSound) return;
      isStartingSound = true;
      hasStartedSound = await playEpicIntroSound();
      isStartingSound = false;
      if (hasStartedSound) removeSoundFallback();
    };

    startIntroSound();
    window.addEventListener("pointerdown", startIntroSound);
    window.addEventListener("keydown", startIntroSound);

    return () => {
      removeSoundFallback();
    };
  }, [introVisible]);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealTargets.forEach((node, index) => {
      node.style.setProperty("--reveal-index", String(index % 8));
      revealObserver.observe(node);
    });
    return () => revealObserver.disconnect();
  }, [activeSection, pageReady]);

  useEffect(() => {
    let ticking = false;

    const updateScrollVariables = () => {
      const scrollY = window.scrollY;
      const scrollProgress = Math.min(scrollY / 1200, 1);
      document.documentElement.style.setProperty("--scroll-y", `${scrollY.toFixed(2)}px`);
      document.documentElement.style.setProperty("--scroll-progress", scrollProgress.toFixed(3));
      setIsScrolled(scrollY > 18);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollVariables);
        ticking = true;
      }
    };

    updateScrollVariables();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDownloadCV = () => {
    playSound(selectSound);
    setIsDownloadingCV(true);

    window.setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/cv/Francisco_Ariel_Lopez_CV.pdf";
      link.download = "Francisco_Ariel_Lopez_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloadingCV(false);
    }, 520);
  };

  const handleNavigate = (sectionId, sourceElement) => {
    playSound(tapSound);
    setIsSwitchingView(true);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const commitNavigation = () => {
      setActiveSection(sectionId);
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    };

    if (sourceElement && !reduceMotion && typeof sourceElement.cloneNode === "function") {
      const rect = sourceElement.getBoundingClientRect();
      const launchCard = sourceElement.cloneNode(true);
      const scaleX = (window.innerWidth + 32) / Math.max(rect.width, 1);
      const scaleY = (window.innerHeight + 32) / Math.max(rect.height, 1);

      launchCard.classList.add("route-card-clone", `route-card-clone-${sectionId}`);
      launchCard.classList.remove("interactive-card");
      launchCard.setAttribute("aria-hidden", "true");
      launchCard.setAttribute("tabindex", "-1");
      launchCard.style.left = `${rect.left}px`;
      launchCard.style.top = `${rect.top}px`;
      launchCard.style.width = `${rect.width}px`;
      launchCard.style.height = `${rect.height}px`;
      document.body.appendChild(launchCard);

      const launchAnimation = launchCard.animate(
        [
          {
            transform: "translate3d(0, 0, 0) scale(1)",
            borderRadius: window.getComputedStyle(sourceElement).borderRadius,
            opacity: 0.98,
            filter: "blur(0px)",
          },
          {
            transform: `translate3d(${-rect.left - 16}px, ${-rect.top - 16}px, 0) scale(${scaleX}, ${scaleY})`,
            borderRadius: "28px",
            opacity: 0,
            filter: "blur(12px)",
          },
        ],
        {
          duration: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );

      window.setTimeout(commitNavigation, 150);
      launchAnimation.finished.finally(() => launchCard.remove());
      window.setTimeout(() => setIsSwitchingView(false), 640);
      return;
    }

    commitNavigation();
    window.setTimeout(() => setIsSwitchingView(false), 360);
  };

  const handleOpenLink = (url) => {
    playSound(tapSound);
    window.open(url, "_blank", "noreferrer");
  };

  const handleMailClick = (topic) => {
    playSound(tapSound);
    if (!topic) {
      window.location.href = `mailto:${profile.email}`;
      return;
    }

    const subject = encodeURIComponent(topic.subject);
    const body = encodeURIComponent(topic.body);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const toggleTheme = () => {
    playSound(toggleSound);
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`page-shell ${pageReady ? "is-ready" : "is-entering"} ${
          isSwitchingView ? "is-switching-view" : ""
        }`}
      >
        {introVisible ? (
          <CinematicIntro durationMs={7800} onComplete={handleIntroComplete} />
        ) : null}
        <AmbientField />
        <AppleCursorGlow />
        <FloatingNav
          activeId={activeSection}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          isScrolled={isScrolled}
        />

        <main className="layout app-view-shell">
          <ViewHeader activeSection={activeSection} />

          <AnimatePresence mode="wait">
            <m.section
              key={activeSection}
              className="app-view"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeSection === "home" ? (
                <HomeView
                  handleDownloadCV={handleDownloadCV}
                  isDownloadingCV={isDownloadingCV}
                  handleNavigate={handleNavigate}
                />
              ) : null}

              {activeSection === "work" ? (
                <WorkView handleOpenLink={handleOpenLink} />
              ) : null}

              {activeSection === "venture" ? (
                <VentureExperience onOpenLink={handleOpenLink} />
              ) : null}

              {activeSection === "life" ? (
                <LifeExperience onOpenLink={handleOpenLink} />
              ) : null}

              {activeSection === "contact" ? (
                <ContactView
                  handleMailClick={handleMailClick}
                  handleOpenLink={handleOpenLink}
                  handleDownloadCV={handleDownloadCV}
                  isDownloadingCV={isDownloadingCV}
                />
              ) : null}
            </m.section>
          </AnimatePresence>
        </main>
      </div>
    </LazyMotion>
  );
}

function HomeView({
  handleDownloadCV,
  handleNavigate,
  isDownloadingCV,
}) {
  const handleHeroPointerMove = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 7;
    const rotateX = (0.5 - y) * 5;

    event.currentTarget.style.setProperty("--hero-rx", `${rotateX.toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--hero-ry", `${rotateY.toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--hero-mx", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--hero-my", `${(y * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--hero-shift-x", `${((x - 0.5) * 18).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--hero-shift-y", `${((y - 0.5) * 14).toFixed(2)}px`);
  };

  const handleHeroPointerLeave = (event) => {
    event.currentTarget.style.setProperty("--hero-rx", "0deg");
    event.currentTarget.style.setProperty("--hero-ry", "0deg");
    event.currentTarget.style.setProperty("--hero-mx", "72%");
    event.currentTarget.style.setProperty("--hero-my", "18%");
    event.currentTarget.style.setProperty("--hero-shift-x", "0px");
    event.currentTarget.style.setProperty("--hero-shift-y", "0px");
  };

  const handlePathPointerMove = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    event.currentTarget.style.setProperty("--path-rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--path-ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--path-mx", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--path-my", `${(y * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--path-shift-x", `${((x - 0.5) * 14).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--path-shift-y", `${((y - 0.5) * 10).toFixed(2)}px`);
  };

  const handlePathPointerLeave = (event) => {
    event.currentTarget.style.setProperty("--path-rx", "0deg");
    event.currentTarget.style.setProperty("--path-ry", "0deg");
    event.currentTarget.style.setProperty("--path-mx", "78%");
    event.currentTarget.style.setProperty("--path-my", "14%");
    event.currentTarget.style.setProperty("--path-shift-x", "0px");
    event.currentTarget.style.setProperty("--path-shift-y", "0px");
  };

  return (
    <>
      <m.div
        className="motion-hero-shell"
        variants={cardVariants}
      >
        <section
          className="home-cockpit hero-tilt-card"
          data-reveal="up"
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
        >
          <div className="home-cockpit-main">
            <p className="eyebrow">FRANCISCO | STRATEGY, FINANCE & VENTURE GOVERNANCE</p>
            <h1>Francisco</h1>
            <p className="cockpit-subtitle">
              Strategy & Consulting Intern in CFO & Enterprise Value at Accenture, building
              governed systems for clearer, more inspectable decisions.
            </p>
            <div className="cockpit-actions">
              <button type="button" className="primary-button" onClick={() => handleNavigate("venture")}>
                Explore Venture
              </button>
              <button type="button" className="secondary-button" onClick={() => handleNavigate("work")}>
                View work
              </button>
              <button type="button" className="secondary-button" onClick={handleDownloadCV}>
                {isDownloadingCV ? "Preparing..." : "Download CV"}
              </button>
            </div>
          </div>

          <div className="cockpit-profile">
            <div className="cockpit-visual" aria-hidden="true">
              <span className="cockpit-grid-plane" />
              <span className="cockpit-core" />
              <span className="cockpit-beam cockpit-beam-one" />
              <span className="cockpit-beam cockpit-beam-two" />
              <span className="cockpit-ring cockpit-ring-one" />
              <span className="cockpit-ring cockpit-ring-two" />
              <span className="cockpit-signal signal-one">EV</span>
              <span className="cockpit-signal signal-two">DCF</span>
              <span className="cockpit-signal signal-three">CFO</span>
            </div>
            <div className="cockpit-profile-copy">
              <span className="profile-status">Consulting + founder</span>
              <h2>Finance, strategy and governed intelligence.</h2>
              <div className="profile-meta">
                <span>Accenture | {profile.team}</span>
                <span>Venture Governance System</span>
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </section>
      </m.div>

      <m.section className="content-grid home-path-grid" variants={sectionVariants}>
        {homePaths.map((card, index) => (
          <m.div
            key={card.id}
            className="home-path-motion span-4"
            variants={cardVariants}
          >
            <button
              type="button"
              className={`card home-path-card home-path-${card.tone} interactive-card`}
              style={{ "--path-stagger": index }}
              onClick={(event) => handleNavigate(card.id, event.currentTarget)}
              onMouseEnter={() => playSound(hoverSound)}
              onPointerMove={handlePathPointerMove}
              onPointerLeave={handlePathPointerLeave}
            >
              <span className="home-path-depth" aria-hidden="true" />
              <span className="home-path-index">{String(index + 1).padStart(2, "0")}</span>
              <HomePathVisual tone={card.tone} />
              <span className="home-path-copy">
                <span className="eyebrow">{card.label}</span>
                <span className="home-path-title">{card.title}</span>
                <span className="home-path-description">{card.text}</span>
                <strong>
                  Open view
                  <span aria-hidden="true">↗</span>
                </strong>
              </span>
            </button>
          </m.div>
        ))}
      </m.section>
    </>
  );
}

function HomePathVisual({ tone }) {
  return (
    <span className={`home-path-visual home-path-visual-${tone}`} aria-hidden="true">
      <span className="path-visual-halo" />
      <span className="path-visual-floor" />

      {tone === "work" ? (
        <span className="path-finance-scene">
          <span className="finance-panel finance-panel-back">
            <i />
            <i />
            <i />
          </span>
          <span className="finance-panel finance-panel-mid">
            <i />
            <i />
            <i />
          </span>
          <span className="finance-panel finance-panel-front">
            <b />
            <b />
            <b />
            <b />
            <em />
          </span>
        </span>
      ) : null}

      {tone === "venture" ? (
        <span className="path-intelligence-scene">
          <span className="intelligence-orbit intelligence-orbit-one" />
          <span className="intelligence-orbit intelligence-orbit-two" />
          <span className="intelligence-orbit intelligence-orbit-three" />
          <span className="intelligence-core">
            <i />
          </span>
          <span className="intelligence-node node-one" />
          <span className="intelligence-node node-two" />
          <span className="intelligence-node node-three" />
          <span className="intelligence-node node-four" />
        </span>
      ) : null}

      {tone === "life" ? (
        <span className="path-life-scene">
          <span className="life-disc">
            <i />
          </span>
          <span className="life-wave">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="life-ribbon life-ribbon-one" />
          <span className="life-ribbon life-ribbon-two" />
        </span>
      ) : null}
    </span>
  );
}

function WorkView({ handleOpenLink }) {
  return (
    <>
      <m.section className="content-grid" variants={sectionVariants}>
        <m.div className="span-12" variants={cardVariants}>
          <WorkflowShowcase apps={workflowApps} />
        </m.div>
      </m.section>

      <m.section className="content-grid capability-grid" variants={sectionVariants}>
        {experienceCards.map((card, index) => (
          <CapabilityCard
            key={card.title}
            card={card}
            index={index}
          />
        ))}
      </m.section>
    </>
  );
}

function CapabilityCard({ card, index }) {
  const [expanded, setExpanded] = useState(false);

  const handlePointerMove = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    event.currentTarget.style.setProperty("--capability-mx", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--capability-my", `${(y * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--capability-rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--capability-ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--capability-mx", "72%");
    event.currentTarget.style.setProperty("--capability-my", "18%");
    event.currentTarget.style.setProperty("--capability-rx", "0deg");
    event.currentTarget.style.setProperty("--capability-ry", "0deg");
  };

  return (
    <m.article
      className={`card capability-card capability-${index + 1} capability-theme-${card.visual} interactive-card span-4 ${
        expanded ? "is-expanded" : ""
      }`}
      data-reveal="up"
      variants={cardVariants}
      whileHover={premiumHover}
      onMouseEnter={() => playSound(hoverSound)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="card-topline">
        <p className="eyebrow">{card.eyebrow}</p>
        <span className="capability-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{card.title}</h3>
      <p className="experience-subtitle">{card.subtitle}</p>
      <CapabilityVisual type={card.visual} />
      <p>{card.description}</p>
      <div className="tag-row">
        {card.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="capability-toggle"
        aria-expanded={expanded}
        onClick={() => {
          playSound(tapSound);
          setExpanded((current) => !current);
        }}
      >
        {expanded ? "Show less" : card.architecture ? "View architecture" : "Show more"}
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <m.div
            className="capability-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: premiumEase }}
          >
            <ul className="capability-details">
              {card.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            {card.architecture ? (
              <div className="capability-architecture" aria-label="SAP Group Reporting architecture">
                <p className="eyebrow">ARCHITECTURE VIEW</p>
                <div className="architecture-flow">
                  {card.architecture.map((layer, layerIndex) => (
                    <div className="architecture-layer" key={layer.layer}>
                      <span>{String(layerIndex + 1).padStart(2, "0")} | {layer.layer}</span>
                      <strong>{layer.title}</strong>
                      <small>{layer.detail}</small>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.article>
  );
}

const capabilityVisualLabels = {
  accenture: "Strategy in motion",
  valuation: "Value compounds",
  risk: "Signals under control",
  process: "Process intelligence",
  reporting: "One consolidated view",
  blockchain: "Connected finance",
};

function CapabilityVisual({ type }) {
  const visualType = capabilityVisualLabels[type] ? type : "accenture";

  return (
    <div className={`capability-visual capability-visual-${visualType}`} aria-hidden="true">
      <span className="capability-visual-glow" />
      <span className="capability-particle capability-particle-one" />
      <span className="capability-particle capability-particle-two" />
      <span className="capability-particle capability-particle-three" />

      <div className="capability-scene">
        {visualType === "accenture" ? (
          <>
            <span className="accenture-orbit accenture-orbit-one" />
            <span className="accenture-orbit accenture-orbit-two" />
            <div className="accenture-cube">
              <span className="cube-face cube-front" data-glyph="&gt;" />
              <span className="cube-face cube-back" data-glyph="EV" />
              <span className="cube-face cube-right" data-glyph="CFO" />
              <span className="cube-face cube-left" data-glyph="S" />
              <span className="cube-face cube-top" data-glyph="+" />
              <span className="cube-face cube-bottom" />
            </div>
          </>
        ) : null}

        {visualType === "valuation" ? (
          <div className="valuation-object">
            <span className="valuation-arrow" />
            <div className="coin-stack coin-stack-one">
              <span />
              <span />
            </div>
            <div className="coin-stack coin-stack-two">
              <span />
              <span />
              <span />
            </div>
            <div className="coin-stack coin-stack-three">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : null}

        {visualType === "risk" ? (
          <div className="risk-gyro">
            <span className="risk-ring risk-ring-one" />
            <span className="risk-ring risk-ring-two" />
            <span className="risk-ring risk-ring-three" />
            <span className="risk-core" data-glyph="R" />
            <span className="risk-signal risk-signal-one" />
            <span className="risk-signal risk-signal-two" />
          </div>
        ) : null}

        {visualType === "process" ? (
          <div className="process-object">
            <span className="process-track" />
            <span className="process-node process-node-one" data-step="01" />
            <span className="process-node process-node-two" data-step="02" />
            <span className="process-node process-node-three" data-step="03" />
          </div>
        ) : null}

        {visualType === "reporting" ? (
          <div className="reporting-object">
            <span className="reporting-beam" />
            <span className="reporting-layer reporting-layer-one" data-layer="SOURCE" />
            <span className="reporting-layer reporting-layer-two" data-layer="JOURNAL" />
            <span className="reporting-layer reporting-layer-three" data-layer="GROUP" />
            <span className="reporting-layer reporting-layer-four" data-layer="VIEW" />
          </div>
        ) : null}

        {visualType === "blockchain" ? (
          <div className="blockchain-object">
            <span className="chain-link chain-link-one" />
            <span className="chain-link chain-link-two" />
            <span className="chain-core" data-glyph="DeFi" />
            <span className="chain-node chain-node-one" />
            <span className="chain-node chain-node-two" />
          </div>
        ) : null}
      </div>

      <span className="capability-visual-caption" data-label={capabilityVisualLabels[visualType]} />
      <span className="capability-visual-status" data-label="LIVE SYSTEM" />
    </div>
  );
}

function ContactView({ handleMailClick, handleOpenLink, handleDownloadCV, isDownloadingCV }) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const activeTopic = contactTopics[activeTopicIndex];

  const handleTopicSelect = (index) => {
    if (index !== activeTopicIndex) {
      playSound(selectSound);
      setActiveTopicIndex(index);
    }
  };

  return (
    <>
      <m.section className="content-grid contact-overview-grid" variants={sectionVariants}>
        <m.div className="contact-primary-stack span-7" variants={cardVariants}>
          <m.article
            className="card contact-main section-tone-warm"
            data-reveal="up"
            variants={cardVariants}
          >
            <div className="contact-main-header">
              <div>
                <p className="eyebrow">CONTACT</p>
                <h2>Start with a useful subject.</h2>
                <p>
                  Choose a direction, review the draft and open a focused email in one step.
                </p>
              </div>
              <span className="contact-availability-pill">Open to thoughtful conversations</span>
            </div>

            <div className="contact-composer">
              <div className="topic-grid" aria-label="Conversation topics">
                {contactTopics.map((topic, index) => (
                  <button
                    key={topic.label}
                    type="button"
                    className={`topic-button ${index === activeTopicIndex ? "active" : ""}`}
                    aria-pressed={index === activeTopicIndex}
                    onClick={() => handleTopicSelect(index)}
                    onMouseEnter={() => playSound(hoverSound)}
                  >
                    <span className="topic-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="topic-copy">
                      <strong>{topic.label}</strong>
                      <span>{topic.description}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="contact-draft-shell">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={activeTopic.label}
                    className="contact-draft-preview"
                    initial={{ opacity: 0, x: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.32, ease: premiumEase }}
                  >
                    <div className="contact-draft-topline">
                      <span>READY-TO-SEND DRAFT</span>
                      <span>EMAIL</span>
                    </div>

                    <div className="contact-draft-address">
                      <span>TO</span>
                      <strong>{profile.email}</strong>
                    </div>

                    <div className="contact-draft-copy">
                      <span>SUBJECT</span>
                      <h3>{activeTopic.subject}</h3>
                      <p>{activeTopic.body}</p>
                    </div>

                    <div className="contact-draft-footer">
                      <button
                        type="button"
                        className="contact-compose-button"
                        onClick={() => handleMailClick(activeTopic)}
                      >
                        Compose email
                      </button>
                      <span>Opens in your mail app</span>
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </m.article>

          <m.div className="contact-message-shell" data-reveal="up" variants={cardVariants}>
            <MessageCard
              name="Francisco"
              prompt="nice to meet you. what did you want to talk about?"
              reply="Happy to talk about consulting, valuation, finance and where I'm headed next."
              onEmail={() => handleMailClick(contactTopics[0])}
              avatar="/images/fran-photo-3.jpeg"
            />
          </m.div>
        </m.div>

        <m.div className="contact-side span-5" variants={cardVariants}>
          <CalendarCard {...calendarCard} />
        </m.div>
      </m.section>

      <m.section className="content-grid" variants={sectionVariants}>
        {contactCards.map((card) => (
          <ContactActionCard
            key={card.title}
            card={card}
            onEmail={handleMailClick}
            onOpenLink={handleOpenLink}
            onDownloadCV={handleDownloadCV}
            isDownloadingCV={isDownloadingCV}
          />
        ))}
      </m.section>
    </>
  );
}

function ContactActionCard({ card, onEmail, onOpenLink, onDownloadCV, isDownloadingCV }) {
  const handleClick = () => {
    if (card.type === "email") {
      onEmail();
      return;
    }

    if (card.type === "cv") {
      onDownloadCV();
      return;
    }

    onOpenLink(card.href);
  };

  return (
    <m.article
      className={`card contact-action-card interactive-card span-4 contact-${card.type} ${
        card.type === "cv" && isDownloadingCV ? "is-downloading" : ""
      }`}
      data-reveal="up"
      variants={cardVariants}
      whileHover={premiumHover}
      onMouseEnter={() => playSound(hoverSound)}
    >
      <div className="contact-action-glow" aria-hidden="true" />
      {card.type === "cv" ? <div className="cv-paper-sheet" aria-hidden="true" /> : null}
      <div className="contact-action-top">
        <p className="eyebrow">{card.eyebrow}</p>
        <span className="contact-action-mark">{card.metric}</span>
      </div>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      {card.type === "linkedin" ? (
        <div className="linkedin-preview-stats" aria-hidden="true">
          <span>Open to conversations</span>
          <span>Strategy / Finance</span>
          <span>Buenos Aires</span>
        </div>
      ) : null}
      <button type="button" className="contact-action-button" onClick={handleClick}>
        {card.type === "cv" && isDownloadingCV ? "Preparing..." : card.label}
      </button>
    </m.article>
  );
}

function FloatingNav({ activeId, onNavigate, theme, onToggleTheme, isScrolled }) {
  return (
    <header className={`floating-nav-wrap ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="floating-controls">
        <nav className="floating-nav" aria-label="Principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button sound-trigger ${activeId === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => playSound(hoverSound)}
            >
              {activeId === item.id ? (
                <m.span
                  className="nav-active-pill"
                  layoutId="nav-active-pill"
                  transition={{ duration: 0.38, ease: premiumEase }}
                />
              ) : null}
              <span className="nav-button-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="utility-dock" aria-label="Display controls">
          <button
            type="button"
            className="utility-button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={onToggleTheme}
            onMouseEnter={() => playSound(hoverSound)}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </header>
  );
}

function ViewHeader({ activeSection }) {
  const labels = {
    home: "Executive cockpit",
    work: "Capability room",
    venture: "Governed intelligence, DeFi and agentic systems",
    life: "Sport, music and personal context",
    contact: "Availability, connection and next steps",
  };

  return (
    <div className="view-header" data-reveal="up">
      <p className="eyebrow">ACTIVE VIEW</p>
      <h2>{navItems.find((item) => item.id === activeSection)?.label}</h2>
      <span>{labels[activeSection]}</span>
    </div>
  );
}

function AmbientField() {
  return (
    <div className="ambient-field" aria-hidden="true">
      <span className="ambient-grid" />
    </div>
  );
}

export default App;
