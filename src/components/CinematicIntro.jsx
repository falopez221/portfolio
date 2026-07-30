import React, { useEffect, useRef } from "react";
import "../cinematic-intro.css";

const ORBIT_NODES = [
  { label: "MATH", detail: "∑ · ∂ · π", angle: -2.62 },
  { label: "STRATEGY", detail: "SCENARIOS", angle: -1.04 },
  { label: "FINANCE", detail: "DCF · ROIC", angle: 0.38 },
  { label: "MARKETING", detail: "LTV · CAC", angle: 2.02 },
];

const FORMULAS = [
  { text: "NPV = Σ CFₜ/(1+r)ᵗ", x: 0.16, y: 0.28 },
  { text: "ROIC > WACC", x: 0.82, y: 0.25 },
  { text: "∂f / ∂x", x: 0.24, y: 0.72 },
  { text: "LTV / CAC ≥ 3", x: 0.78, y: 0.74 },
  { text: "EV = Σ FCF", x: 0.5, y: 0.16 },
  { text: "Δ REVENUE", x: 0.5, y: 0.84 },
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const smoothstep = (start, end, value) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};

const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

function makeParticles(count) {
  const random = seededRandom(221);
  return Array.from({ length: count }, (_, index) => ({
    angle: random() * Math.PI * 2,
    radius: 0.1 + random() * 0.62,
    depth: 0.3 + random() * 0.7,
    size: 0.45 + random() * 1.55,
    speed: 0.22 + random() * 0.62,
    drift: (random() - 0.5) * 0.09,
    tone: index % 4,
  }));
}

function drawBackground(context, width, height, progress) {
  const centerX = width / 2;
  const centerY = height / 2;
  const background = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    Math.max(width, height) * 0.82
  );

  background.addColorStop(0, progress > 0.48 ? "#061225" : "#0b1a32");
  background.addColorStop(0.42, "#061123");
  background.addColorStop(1, "#01040b");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(
    centerX,
    centerY * 0.96,
    0,
    centerX,
    centerY,
    Math.min(width, height) * 0.62
  );
  glow.addColorStop(0, `rgba(75, 145, 255, ${0.18 * (1 - progress * 0.45)})`);
  glow.addColorStop(0.5, "rgba(21, 64, 124, 0.07)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function drawLightRays(context, width, height, progress) {
  const centerX = width / 2;
  const centerY = height / 2;
  const rayOpacity = 0.032 + Math.sin(progress * Math.PI) * 0.028;

  context.save();
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2 + progress * 0.28;
    const spread = 0.035 + (index % 3) * 0.012;
    const length = Math.max(width, height) * 0.82;
    const gradient = context.createLinearGradient(
      centerX,
      centerY,
      centerX + Math.cos(angle) * length,
      centerY + Math.sin(angle) * length
    );

    gradient.addColorStop(0, `rgba(115, 177, 255, ${rayOpacity})`);
    gradient.addColorStop(1, "rgba(115, 177, 255, 0)");
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(
      centerX + Math.cos(angle - spread) * length,
      centerY + Math.sin(angle - spread) * length
    );
    context.lineTo(
      centerX + Math.cos(angle + spread) * length,
      centerY + Math.sin(angle + spread) * length
    );
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
  }
  context.restore();
}

function getNodePosition(index, progress, width, height) {
  const collapse = smoothstep(0.5, 0.9, progress);
  const orbitProgress = progress * Math.PI * 2 * 1.04;
  const base = ORBIT_NODES[index].angle;
  const angle = base + orbitProgress + collapse * Math.PI * 5.5;
  const radiusX = Math.min(width * 0.37, 540) * (1 - collapse);
  const radiusY = Math.min(height * 0.285, 260) * (1 - collapse);
  const depth = (Math.sin(angle) + 1) / 2;

  return {
    x: width / 2 + Math.cos(angle) * radiusX,
    y: height / 2 + Math.sin(angle) * radiusY,
    depth,
    collapse,
  };
}

function drawNetwork(context, width, height, progress) {
  const reveal = smoothstep(0.08, 0.24, progress);
  const disappear = 1 - smoothstep(0.72, 0.93, progress);
  const opacity = reveal * disappear;
  const points = ORBIT_NODES.map((_, index) =>
    getNodePosition(index, progress, width, height)
  );

  context.save();
  context.globalCompositeOperation = "screen";
  context.lineWidth = 1;

  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const gradient = context.createLinearGradient(point.x, point.y, next.x, next.y);
    gradient.addColorStop(0, `rgba(124, 181, 255, ${0.34 * opacity})`);
    gradient.addColorStop(0.5, `rgba(217, 235, 255, ${0.58 * opacity})`);
    gradient.addColorStop(1, `rgba(85, 138, 224, ${0.28 * opacity})`);
    context.strokeStyle = gradient;
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.quadraticCurveTo(width / 2, height / 2, next.x, next.y);
    context.stroke();

    context.strokeStyle = `rgba(133, 190, 255, ${0.16 * opacity})`;
    context.beginPath();
    context.moveTo(width / 2, height / 2);
    context.lineTo(point.x, point.y);
    context.stroke();
  });

  context.restore();
}

function drawParticles(context, width, height, progress, particles) {
  const centerX = width / 2;
  const centerY = height / 2;
  const collapse = smoothstep(0.49, 0.96, progress);
  const maxRadius = Math.hypot(width, height) * 0.54;

  context.save();
  context.globalCompositeOperation = "screen";

  particles.forEach((particle) => {
    const angle =
      particle.angle +
      progress * Math.PI * 2 * particle.speed +
      collapse * Math.PI * (7 + particle.depth * 8);
    const radius =
      particle.radius *
      maxRadius *
      (1 - Math.pow(collapse, 1.25)) *
      (1 + particle.drift * Math.sin(progress * Math.PI * 6));
    const flatten = 0.63 + particle.depth * 0.22;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * flatten;
    const trailRadius = radius + 13 + collapse * 34 * particle.depth;
    const trailX = centerX + Math.cos(angle - 0.06 - collapse * 0.12) * trailRadius;
    const trailY =
      centerY +
      Math.sin(angle - 0.06 - collapse * 0.12) * trailRadius * flatten;
    const alpha =
      (0.16 + particle.depth * 0.48) *
      (1 - smoothstep(0.9, 1, progress));
    const color =
      particle.tone === 0
        ? `rgba(231, 243, 255, ${alpha})`
        : `rgba(101, 164, 255, ${alpha})`;

    if (collapse > 0.08) {
      context.strokeStyle = color;
      context.lineWidth = Math.max(0.45, particle.size * 0.52);
      context.beginPath();
      context.moveTo(trailX, trailY);
      context.lineTo(x, y);
      context.stroke();
    }

    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, particle.size * (0.72 + particle.depth * 0.45), 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawBlackHole(context, width, height, progress) {
  const formation = smoothstep(0.42, 0.58, progress);
  const implosion = smoothstep(0.88, 0.96, progress);
  if (formation <= 0) return;

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * (0.075 + formation * 0.045);

  context.save();
  context.translate(centerX, centerY);
  context.rotate(-0.12 + Math.sin(progress * Math.PI * 2) * 0.035);
  context.globalCompositeOperation = "screen";
  context.shadowBlur = 28 + formation * 34;
  context.shadowColor = "rgba(98, 168, 255, 0.8)";

  for (let ring = 0; ring < 7; ring += 1) {
    const ringProgress = ring / 6;
    context.strokeStyle = `rgba(${160 + ring * 10}, ${202 + ring * 6}, 255, ${
      formation * (0.42 - ringProgress * 0.045)
    })`;
    context.lineWidth = 1.1 + (1 - ringProgress) * 2.3;
    context.beginPath();
    context.ellipse(
      0,
      0,
      baseRadius * (1.45 + ringProgress * 1.35),
      baseRadius * (0.32 + ringProgress * 0.16),
      ringProgress * 0.035,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

  context.shadowBlur = 0;
  context.globalCompositeOperation = "source-over";
  const core = context.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 1.2);
  core.addColorStop(0, "#000");
  core.addColorStop(0.68, "#000106");
  core.addColorStop(0.86, `rgba(3, 8, 19, ${0.98 - implosion * 0.2})`);
  core.addColorStop(1, "rgba(80, 145, 255, 0)");
  context.fillStyle = core;
  context.beginPath();
  context.arc(0, 0, baseRadius * (1 - implosion * 0.34), 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function CinematicIntro({ durationMs = 7800, onComplete }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!root || !canvas || !context) {
      onComplete?.();
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const effectiveDuration = prefersReducedMotion ? 480 : durationMs;
    const particleCount =
      prefersReducedMotion || window.innerWidth < 700 ? 82 : 158;
    const particles = makeParticles(particleCount);
    const nodes = Array.from(root.querySelectorAll(".cinematic-intro__node"));
    const formulas = Array.from(
      root.querySelectorAll(".cinematic-intro__formula")
    );
    const fragments = Array.from(
      root.querySelectorAll(".cinematic-intro__fragment")
    );
    const title = root.querySelector(".cinematic-intro__title-core");
    const hole = root.querySelector(".cinematic-intro__black-hole");
    const flash = root.querySelector(".cinematic-intro__flash");
    const previousOverflow = document.body.style.overflow;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let completed = false;
    const startedAt = performance.now();

    document.body.style.overflow = "hidden";

    const resize = () => {
      width = Math.max(window.innerWidth, 1);
      height = Math.max(window.innerHeight, 1);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete?.();
    };

    const renderDom = (progress) => {
      const reveal = smoothstep(0.02, 0.15, progress);
      const collapse = smoothstep(0.5, 0.91, progress);
      const vanish = smoothstep(0.83, 0.97, progress);

      nodes.forEach((node, index) => {
        const point = getNodePosition(index, progress, width, height);
        const scale =
          (0.8 + point.depth * 0.28) * (1 - point.collapse * 0.72);
        const opacity =
          smoothstep(0.08 + index * 0.025, 0.22 + index * 0.025, progress) *
          (1 - smoothstep(0.76, 0.92, progress));

        node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.filter = `blur(${(point.collapse * 6.5).toFixed(2)}px)`;
        node.style.zIndex = String(Math.round(point.depth * 20 + 10));
      });

      formulas.forEach((formula, index) => {
        const definition = FORMULAS[index];
        const baseX = (definition.x - 0.5) * width;
        const baseY = (definition.y - 0.5) * height;
        const angle = collapse * Math.PI * (4.5 + index * 0.32);
        const radiusMultiplier = 1 - collapse;
        const x =
          width / 2 +
          (Math.cos(angle) * baseX - Math.sin(angle) * baseY) * radiusMultiplier;
        const y =
          height / 2 +
          (Math.sin(angle) * baseX + Math.cos(angle) * baseY) * radiusMultiplier;
        const opacity =
          smoothstep(0.12 + index * 0.018, 0.28 + index * 0.018, progress) *
          (1 - smoothstep(0.67, 0.9, progress));

        formula.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${
          1 - collapse * 0.72
        }) rotate(${collapse * 180}deg)`;
        formula.style.opacity = opacity.toFixed(3);
        formula.style.filter = `blur(${(collapse * 5).toFixed(2)}px)`;
      });

      if (title) {
        const pull = smoothstep(0.58, 0.91, progress);
        const titleOpacity =
          reveal *
          (1 - smoothstep(0.69, 0.75, progress)) *
          (1 - vanish);
        const titleScale = (0.92 + reveal * 0.08) * (1 - pull * 0.93);
        const rotateY = Math.sin(progress * Math.PI * 2) * 18 + pull * 530;
        const rotateZ = pull * 640;

        title.style.opacity = titleOpacity.toFixed(3);
        title.style.transform = `translate(-50%, -50%) perspective(1100px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${titleScale})`;
        title.style.filter = `blur(${(pull * 7).toFixed(2)}px)`;
      }

      fragments.forEach((fragment, index) => {
        const fragmentation = smoothstep(0.66 + index * 0.006, 0.74, progress);
        const fragmentVanish = smoothstep(0.88, 0.97, progress);
        const direction = index % 2 === 0 ? -1 : 1;
        const orbit = fragmentation * Math.PI * (2.5 + index * 0.6);
        const radius = (1 - fragmentation) * (24 + index * 9);
        const x = Math.cos(orbit) * radius * direction;
        const y = Math.sin(orbit) * radius + (index - 2) * 5 * (1 - fragmentation);
        const scale = 1 - fragmentation * 0.96;

        fragment.style.opacity = (
          fragmentation *
          (1 - fragmentVanish)
        ).toFixed(3);
        fragment.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateZ(${
          fragmentation * direction * (420 + index * 85)
        }deg) scale(${scale})`;
        fragment.style.filter = `blur(${(fragmentation * 4).toFixed(2)}px)`;
      });

      if (hole) {
        const formation = smoothstep(0.42, 0.58, progress);
        const endCollapse = smoothstep(0.9, 0.97, progress);
        hole.style.opacity = (formation * (1 - endCollapse)).toFixed(3);
        hole.style.transform = `translate(-50%, -50%) scale(${
          0.55 + formation * 0.45 - endCollapse * 0.28
        }) rotate(${progress * 180}deg)`;
      }

      if (flash) {
        const flashIn = smoothstep(0.905, 0.935, progress);
        const flashOut = smoothstep(0.94, 0.985, progress);
        flash.style.opacity = (flashIn * (1 - flashOut)).toFixed(3);
      }

      root.style.opacity = String(1 - smoothstep(0.94, 1, progress));
      root.style.setProperty("--cinematic-progress", progress.toFixed(4));
    };

    const render = (now) => {
      const progress = prefersReducedMotion
        ? 0.32
        : clamp((now - startedAt) / effectiveDuration);

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawBackground(context, width, height, progress);
      drawLightRays(context, width, height, progress);
      drawNetwork(context, width, height, progress);
      drawParticles(context, width, height, progress, particles);
      drawBlackHole(context, width, height, progress);
      renderDom(progress);

      if (!prefersReducedMotion && progress < 1) {
        frame = window.requestAnimationFrame(render);
      } else if (!prefersReducedMotion) {
        finish();
      }
    };

    resize();
    if (prefersReducedMotion) {
      render(performance.now());
      frame = window.setTimeout(finish, effectiveDuration);
    } else {
      frame = window.requestAnimationFrame(render);
    }
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      if (prefersReducedMotion) {
        window.clearTimeout(frame);
      } else {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("resize", resize);
      document.body.style.overflow = previousOverflow;
    };
  }, [durationMs, onComplete]);

  return (
    <section
      ref={rootRef}
      className="cinematic-intro"
      aria-label="Francisco. Math, strategy, finance and marketing interconnected in a cinematic three-dimensional network."
      role="img"
    >
      <canvas ref={canvasRef} className="cinematic-intro__canvas" aria-hidden="true" />

      <div className="cinematic-intro__black-hole" aria-hidden="true">
        <span className="cinematic-intro__accretion cinematic-intro__accretion--outer" />
        <span className="cinematic-intro__accretion cinematic-intro__accretion--inner" />
        <span className="cinematic-intro__event-horizon" />
      </div>

      <div className="cinematic-intro__scene">
        {FORMULAS.map((formula) => (
          <span
            key={formula.text}
            className="cinematic-intro__formula"
            aria-hidden="true"
          >
            {formula.text}
          </span>
        ))}

        {ORBIT_NODES.map((node) => (
          <div key={node.label} className="cinematic-intro__node">
            <span>{node.label}</span>
            <small>{node.detail}</small>
          </div>
        ))}

        <div className="cinematic-intro__title-stack">
          <h1 className="cinematic-intro__title-core">Francisco</h1>
          {[0, 1, 2, 3, 4].map((band) => (
            <span
              key={band}
              className="cinematic-intro__fragment"
              style={{
                "--fragment-top": `${band * 20}%`,
                "--fragment-bottom": `${80 - band * 20}%`,
              }}
              aria-hidden="true"
            >
              Francisco
            </span>
          ))}
        </div>
      </div>

      <div className="cinematic-intro__orbit-line cinematic-intro__orbit-line--one" aria-hidden="true" />
      <div className="cinematic-intro__orbit-line cinematic-intro__orbit-line--two" aria-hidden="true" />
      <div className="cinematic-intro__vignette" aria-hidden="true" />
      <div className="cinematic-intro__flash" aria-hidden="true" />
    </section>
  );
}

export default CinematicIntro;
