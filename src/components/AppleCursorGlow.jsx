import React, { useEffect } from "react";

function AppleCursorGlow() {
  useEffect(() => {
    const canTrackPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!canTrackPointer.matches) return undefined;

    let ticking = false;
    let frameId = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const move = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (ticking) return;

      ticking = true;
      frameId = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", `${pointerX}px`);
        document.documentElement.style.setProperty("--my", `${pointerY}px`);
        document.documentElement.style.setProperty(
          "--mxp",
          ((pointerX / window.innerWidth) * 100).toFixed(2)
        );
        document.documentElement.style.setProperty(
          "--myp",
          ((pointerY / window.innerHeight) * 100).toFixed(2)
        );
        ticking = false;
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <div className="cursor-glow" aria-hidden="true" />;
}

export default AppleCursorGlow;
