import React, { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import {
  hoverSound,
  playSound,
  selectSound,
  swoshSound,
  tapSound,
  toggleSound,
} from "./utils/sounds";
import {
  audioIntro,
  calendarCard,
  contactCards,
  currentPodcast,
  experienceCards,
  photoCards,
  profile,
  quickFacts,
  spotlightCards,
  workflowApps,
} from "./data/content.js";
import PhotoCard from "./components/PhotoCard.jsx";
import CalendarCard from "./components/CalendarCard.jsx";
import AudioCard from "./components/AudioCard.jsx";
import AppleCursorGlow from "./components/AppleCursorGlow.jsx";
import WorkflowShowcase from "./components/WorkflowShowcase.jsx";
import MessageCard from "./components/MessageCard.jsx";
import PodcastCard from "./components/PodcastCard.jsx";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
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

const cockpitCards = [
  {
    title: "Valuation",
    label: "Cash flow logic",
    text: "Flujo de fondos, valuation views and sensitivity thinking.",
    tone: "valuation",
  },
  {
    title: "Risk",
    label: "Scenario lens",
    text: "Costs, financial risk and critical decisions under real constraints.",
    tone: "risk",
  },
  {
    title: "Digital Finance",
    label: "Blockchain / DeFi",
    text: "A business view on new financial infrastructure and adoption.",
    tone: "defi",
  },
];

const contactTopics = [
  {
    label: "Networking",
    subject: "Networking conversation",
    body: "Hi Francisco, I would like to connect and talk about consulting, finance and your current path.",
  },
  {
    label: "Recruiting / CV",
    subject: "Profile and CV conversation",
    body: "Hi Francisco, I reviewed your portfolio and would like to discuss your profile and CV.",
  },
  {
    label: "Valuation",
    subject: "Valuation and finance conversation",
    body: "Hi Francisco, I would like to talk about valuation, cash flow analysis and finance topics.",
  },
  {
    label: "Coffee chat",
    subject: "Coffee chat",
    body: "Hi Francisco, I would like to schedule a quick coffee chat.",
  },
];

const aboutPrinciples = [
  {
    title: "Clarity",
    eyebrow: "PRINCIPLE 01",
    text: "Turn ambiguous questions into a clean decision path.",
    detail: "Clear assumptions, structured synthesis and executive-ready output.",
    tags: ["Synthesis", "Signal", "Judgment"],
  },
  {
    title: "Structured thinking",
    eyebrow: "PRINCIPLE 02",
    text: "Break complex situations into drivers, scenarios and trade-offs.",
    detail: "A consulting rhythm for framing problems before solving them.",
    tags: ["Problem solving", "Drivers", "Scenarios"],
  },
  {
    title: "Finance lens",
    eyebrow: "PRINCIPLE 03",
    text: "Read strategy through cash flow, risk and enterprise value.",
    detail: "Valuation, sensitivity and capital logic as practical decision tools.",
    tags: ["Valuation", "CFO & EV", "Risk"],
  },
  {
    title: "Execution mindset",
    eyebrow: "PRINCIPLE 04",
    text: "Move from analysis to polished materials people can act on.",
    detail: "Clean slides, concise updates and disciplined communication.",
    tags: ["Output", "Pace", "Communication"],
  },
];

const aboutTimeline = [
  { year: "2023", label: "Foundation", text: "Finance, analysis and business fundamentals." },
  { year: "2024", label: "Accenture", text: "Consulting standards, structure and client-ready output." },
  { year: "2025", label: "CFO & EV", text: "Valuation, enterprise value and strategic finance lens." },
  { year: "2026", label: "Growth", text: "Sharper judgment, digital finance and executive presence." },
];

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState("light");
  const [introVisible, setIntroVisible] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);

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
    let hasPlayedIntroSound = false;
    const playIntroSound = () => {
      if (hasPlayedIntroSound) return;
      hasPlayedIntroSound = true;
      playSound(swoshSound);
    };
    const soundTimer = window.setTimeout(playIntroSound, 420);
    const firstInteraction = () => playIntroSound();
    const exitTimer = window.setTimeout(() => {
      setIntroVisible(false);
      setPageReady(true);
    }, 2550);

    window.addEventListener("pointerdown", firstInteraction, { once: true });
    window.addEventListener("keydown", firstInteraction, { once: true });

    return () => {
      window.clearTimeout(soundTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("pointerdown", firstInteraction);
      window.removeEventListener("keydown", firstInteraction);
    };
  }, []);

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
      link.href = "/cv/Fran-CV.pdf";
      link.download = "Fran-CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloadingCV(false);
    }, 520);
  };

  const handleNavigate = (sectionId) => {
    playSound(tapSound);
    setIsSwitchingView(true);
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        {introVisible ? <IntroOverlay /> : null}
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
                  handleMailClick={handleMailClick}
                  handleOpenLink={handleOpenLink}
                />
              ) : null}

              {activeSection === "about" ? <AboutView /> : null}

              {activeSection === "work" ? (
                <WorkView handleOpenLink={handleOpenLink} />
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

function IntroOverlay() {
  return (
    <div className="intro-overlay" aria-label="Francisco">
      <div className="intro-wordmark">
        <h1>Francisco</h1>
        <div className="intro-track">
          <span>Strategy</span>
          <span>Finance</span>
          <span>Enterprise Value</span>
        </div>
        <div className="intro-loader" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}

function HomeView({
  handleDownloadCV,
  handleNavigate,
  handleMailClick,
  handleOpenLink,
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
  };

  const handleHeroPointerLeave = (event) => {
    event.currentTarget.style.setProperty("--hero-rx", "0deg");
    event.currentTarget.style.setProperty("--hero-ry", "0deg");
    event.currentTarget.style.setProperty("--hero-mx", "72%");
    event.currentTarget.style.setProperty("--hero-my", "18%");
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
            <p className="eyebrow">FRANCISCO | CFO & ENTERPRISE VALUE</p>
            <h1>Francisco</h1>
            <p className="cockpit-subtitle">
              Strategy & Consulting Intern building a finance-driven consulting foundation at Accenture.
            </p>
            <div className="cockpit-actions">
              <button type="button" className="primary-button" onClick={() => handleNavigate("work")}>
                View work
              </button>
              <button type="button" className="secondary-button" onClick={handleDownloadCV}>
                Download CV
              </button>
              <button type="button" className="secondary-button" onClick={() => handleMailClick()}>
                Email
              </button>
            </div>
          </div>

          <div className="cockpit-profile">
            <div className="cockpit-visual" aria-hidden="true">
              <span className="cockpit-ring cockpit-ring-one" />
              <span className="cockpit-ring cockpit-ring-two" />
              <span className="cockpit-signal signal-one">EV</span>
              <span className="cockpit-signal signal-two">DCF</span>
              <span className="cockpit-signal signal-three">CFO</span>
            </div>
            <div className="cockpit-profile-copy">
              <span className="profile-status">Consulting ready</span>
              <h2>{profile.title}</h2>
              <div className="profile-meta">
                <span>{profile.team}</span>
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </section>
      </m.div>

      <m.section className="content-grid cockpit-grid" variants={sectionVariants}>
        {cockpitCards.map((card) => (
          <m.article
            key={card.title}
            className={`card cockpit-card cockpit-${card.tone} interactive-card span-4`}
            data-reveal="up"
            variants={cardVariants}
            whileHover={premiumHover}
            onMouseEnter={() => playSound(hoverSound)}
          >
            <span>{card.label}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </m.article>
        ))}
      </m.section>

      <m.section className="content-grid visual-band" variants={sectionVariants}>
        <m.div className="span-8" variants={cardVariants}>
          <WorkflowShowcase apps={workflowApps} />
        </m.div>
        <m.div className="span-4" variants={cardVariants}>
          <CalendarCard {...calendarCard} />
        </m.div>
      </m.section>

      <m.section className="content-grid lifestyle-band" variants={sectionVariants}>
        <m.div className="span-12" variants={cardVariants}>
          <PhotoCard {...photoCards[0]} depth={0.14} />
        </m.div>
      </m.section>

      <m.section className="content-grid home-bottom-grid" variants={sectionVariants}>
        <m.div className="span-4" variants={cardVariants}>
          <AudioCard {...audioIntro} />
        </m.div>
        <m.div className="span-4" variants={cardVariants}>
          <PodcastCard podcast={currentPodcast} onOpenLink={handleOpenLink} />
        </m.div>
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

function AboutView() {
  return (
    <>
      <m.section
        className="about-interactive-hero"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        <m.article className="about-human-copy about-story-lead" data-reveal="up" variants={cardVariants}>
          <p className="eyebrow">ABOUT</p>
          <h2>Finance thinking, consulting rhythm, personal clarity.</h2>
          <p>
            I like work that turns ambiguity into a useful decision path: clear assumptions,
            disciplined analysis and output people can act on.
          </p>
          <div className="mini-grid">
            {quickFacts.map((fact) => (
              <span key={fact} className="mini-pill">
                {fact}
              </span>
            ))}
          </div>
        </m.article>

        <m.div className="about-depth-panel" data-reveal="up" aria-hidden="true" variants={cardVariants}>
          <span className="about-depth-orbit orbit-one" />
          <span className="about-depth-orbit orbit-two" />
          <div className="about-depth-card">
            <span>CFO & EV</span>
            <strong>Structured profile</strong>
            <small>Strategy | Finance | Execution</small>
          </div>
        </m.div>
      </m.section>

      <m.section
        className="about-principles"
        aria-label="About principles"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        {aboutPrinciples.map((principle, index) => (
          <m.article
            key={principle.title}
            className="card about-principle-card interactive-card"
            data-reveal="up"
            style={{ "--principle-index": index }}
            variants={cardVariants}
            whileHover={premiumHover}
            onMouseEnter={() => playSound(hoverSound)}
          >
            <div className="about-skill-topline">
              <p className="eyebrow">{principle.eyebrow}</p>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{principle.title}</h2>
            <strong>{principle.text}</strong>
            <p>{principle.detail}</p>
            <div className="tag-row">
              {principle.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </m.article>
        ))}
      </m.section>

      <m.section
        className="about-timeline card"
        data-reveal="up"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        <div className="about-timeline-head">
          <p className="eyebrow">GROWTH PATH</p>
          <h2>From finance foundation to enterprise value lens.</h2>
        </div>
        <div className="about-timeline-track">
          {aboutTimeline.map((item) => (
            <article key={item.year} className="about-timeline-item">
              <span>{item.year}</span>
              <strong>{item.label}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </m.section>

      <m.section
        className="content-grid about-page-grid secondary"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        <div className="about-mosaic span-12">
          {spotlightCards.map((card, index) => (
            <m.article
              key={card.title}
              className={`card spotlight-card interactive-card spotlight-${card.accent}`}
              data-reveal="up"
              variants={cardVariants}
              whileHover={premiumHover}
              onMouseEnter={() => playSound(hoverSound)}
            >
              <span className="spotlight-stat">{card.stat || String(index + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </m.article>
          ))}
        </div>
      </m.section>
    </>
  );
}

function WorkView({ handleOpenLink }) {
  return (
    <>
      <m.section className="content-grid" variants={sectionVariants}>
        <m.div className="span-8" variants={cardVariants}>
          <WorkflowShowcase apps={workflowApps} />
        </m.div>
        <m.article
          className="card work-side-panel span-4 section-tone-product"
          data-reveal="up"
          variants={cardVariants}
          whileHover={premiumHover}
        >
          <p className="eyebrow">CAPABILITY ROOM</p>
          <h2>Finance work translated into decision-ready output.</h2>
          <p>
            Models, scenarios, research and executive decks arranged as practical consulting capabilities.
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => handleOpenLink(profile.linkedin)}
            onMouseEnter={() => playSound(hoverSound)}
          >
            Connect on LinkedIn
          </button>
        </m.article>
      </m.section>

      <m.section className="content-grid capability-grid" variants={sectionVariants}>
        {experienceCards.map((card, index) => (
          <m.article
            key={card.title}
            className={`card capability-card capability-${index + 1} interactive-card ${
              index === 0 ? "span-6" : "span-6"
            }`}
            data-reveal="up"
            variants={cardVariants}
            whileHover={premiumHover}
            onMouseEnter={() => playSound(hoverSound)}
          >
            <div className="card-topline">
              <p className="eyebrow">{card.eyebrow}</p>
              <span className="arrow-mark sound-trigger">&gt;</span>
            </div>
            <h3>{card.title}</h3>
            <p className="experience-subtitle">{card.subtitle}</p>
            <p>{card.description}</p>
            <div className="tag-row">
              {card.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </m.article>
        ))}
      </m.section>
    </>
  );
}

function ContactView({ handleMailClick, handleOpenLink, handleDownloadCV, isDownloadingCV }) {
  return (
    <>
      <m.section className="content-grid" variants={sectionVariants}>
        <m.article
          className="card contact-main span-7 section-tone-warm"
          data-reveal="up"
          variants={cardVariants}
          whileHover={premiumHover}
        >
          <p className="eyebrow">CONTACT</p>
          <h2>Start with a useful subject.</h2>
          <p>
            Pick a topic and the email opens with a clear subject and body. Less friction, better conversation.
          </p>

          <div className="topic-grid">
            {contactTopics.map((topic) => (
              <button
                key={topic.label}
                type="button"
                className="topic-button"
                onClick={() => handleMailClick(topic)}
                onMouseEnter={() => playSound(hoverSound)}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </m.article>

        <m.div className="contact-side span-5" variants={cardVariants}>
          <CalendarCard {...calendarCard} />
        </m.div>
      </m.section>

      <m.section className="content-grid" variants={sectionVariants}>
        <m.div className="span-7" variants={cardVariants}>
          <MessageCard
            name="Francisco"
            prompt="nice to meet you. what did you want to talk about?"
            reply="Happy to talk about consulting, valuation, finance and where I'm headed next."
            onEmail={() => handleMailClick(contactTopics[0])}
            avatar="/images/fran-photo-3.jpeg"
          />
        </m.div>

        <m.article
          className="card cv-preview-card interactive-card span-5"
          data-reveal="up"
          variants={cardVariants}
          whileHover={premiumHover}
        >
          <p className="eyebrow">PDF READY</p>
          <h3>Francisco Ariel Lopez</h3>
          <p>Strategy & Consulting | CFO & Enterprise Value | Accenture</p>
          <div className="cv-preview-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <button type="button" className="primary-button" onClick={handleDownloadCV}>
            Download CV
          </button>
        </m.article>
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

    playSound(tapSound);
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
  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeId));

  return (
    <header className={`floating-nav-wrap ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="floating-controls">
        <nav
          className="floating-nav"
          aria-label="Principal"
          style={{ "--nav-index": activeIndex }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button sound-trigger ${activeId === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => playSound(hoverSound)}
            >
              {item.label}
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
    about: "Profile, mindset and value lens",
    work: "Capability room",
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
