import React, { useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import { hoverSound, playSound, tapSound } from "../utils/sounds";

const premiumEase = [0.22, 1, 0.36, 1];

function PhotoCard({
  image,
  badge = "Photos",
  title,
  caption,
  meta,
  thumbnails = [],
  slides = [],
  depth = 0.2,
  compact = false,
}) {
  const preparedSlides = useMemo(() => {
    if (slides.length > 0) return slides;

    const uniqueImages = [image, ...thumbnails].filter(Boolean).filter((value, index, array) => (
      array.indexOf(value) === index
    ));

    return uniqueImages.map((slideImage, index) => ({
      image: slideImage,
      title,
      caption,
      meta,
      badge,
      label: String(index + 1).padStart(2, "0"),
    }));
  }, [badge, caption, image, meta, slides, thumbnails, title]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = preparedSlides[activeIndex] ?? preparedSlides[0];
  const cardRef = useRef(null);
  const boundsRef = useRef(null);
  const rafRef = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  if (!activeSlide) return null;

  const handlePointerEnter = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event) => {
    const element = cardRef.current;
    const rect = boundsRef.current;
    if (!element || !rect) return;

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerRef.current = {
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    };

    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(() => {
      const { x: nextX, y: nextY } = pointerRef.current;

      element.style.setProperty("--photo-mx", `${(nextX * 100).toFixed(2)}%`);
      element.style.setProperty("--photo-my", `${(nextY * 100).toFixed(2)}%`);
      element.style.setProperty("--photo-tilt-x", `${((0.5 - nextY) * 3).toFixed(2)}deg`);
      element.style.setProperty("--photo-tilt-y", `${((nextX - 0.5) * 4).toFixed(2)}deg`);
      element.style.setProperty("--photo-shift-x", `${((nextX - 0.5) * -18).toFixed(2)}px`);
      element.style.setProperty("--photo-shift-y", `${((nextY - 0.5) * -14).toFixed(2)}px`);
      rafRef.current = 0;
    });
  };

  const handlePointerLeave = (event) => {
    boundsRef.current = null;
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    event.currentTarget.style.setProperty("--photo-mx", "50%");
    event.currentTarget.style.setProperty("--photo-my", "50%");
    event.currentTarget.style.setProperty("--photo-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--photo-tilt-y", "0deg");
    event.currentTarget.style.setProperty("--photo-shift-x", "0px");
    event.currentTarget.style.setProperty("--photo-shift-y", "0px");
  };

  return (
    <m.article
      ref={cardRef}
      className={`card photo-card interactive-card ${compact ? "is-compact" : ""}`}
      data-reveal="up"
      style={{ "--parallax-depth": depth }}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.22, ease: premiumEase },
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="photo-media-wrap">
        <m.img
          key={activeSlide.image}
          src={activeSlide.image}
          alt={activeSlide.title || "Portfolio visual"}
          className="photo-card-image"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: activeSlide.objectPosition || "50% 50%" }}
          initial={{ opacity: 0.5, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: premiumEase }}
        />
        <div className="photo-overlay" />
      </div>

      <div className="photo-badge">{activeSlide.badge || badge}</div>

      <div className="photo-content">
        <div className="photo-copy">
          <p className="eyebrow">CURATED VISUALS</p>
          <h3>{activeSlide.title || title}</h3>
          <p>{activeSlide.caption || caption}</p>
        </div>

        <div className="photo-footer">
          <div className="photo-meta">
            <span>{activeSlide.meta || meta}</span>
          </div>
        </div>
      </div>

      <div className="photo-bottom-nav">
        {preparedSlides.map((slide, index) => (
          <button
            key={`${slide.image}-nav-${index}`}
            className={`photo-nav-btn ${index === activeIndex ? "active" : ""}`}
            type="button"
            onClick={() => {
              playSound(tapSound);
              setActiveIndex(index);
            }}
            onMouseEnter={() => playSound(hoverSound)}
            aria-label={`Show photo ${index + 1}`}
          >
            {slide.label || String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
    </m.article>
  );
}

export default PhotoCard;
