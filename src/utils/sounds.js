function createSound(path, volume = 0.2) {
  const audio = new Audio(path);
  audio.volume = volume;
  audio.preload = "auto";
  return audio;
}

export const tapSound = createSound("/audio/ui-tap.wav", 0.22);
export const hoverSound = createSound("/audio/ui-hover.wav", 0.12);
export const toggleSound = createSound("/audio/ui-toggle.wav", 0.18);
export const selectSound = createSound("/audio/ui-select.wav", 0.2);
export const swoshSound = createSound("/audio/swosh.mp3", 0.16);

const lastPlayedAt = new WeakMap();

export function playSound(sound) {
  if (!sound) return Promise.resolve(false);

  try {
    const now = performance.now();
    const minimumGap = sound === hoverSound ? 180 : 90;
    const previous = lastPlayedAt.get(sound) || 0;

    if (now - previous < minimumGap) return Promise.resolve(false);
    lastPlayedAt.set(sound, now);

    sound.pause();
    sound.currentTime = 0;
    const playback = sound.play();
    if (!playback?.then) return Promise.resolve(true);
    return playback.then(() => true).catch(() => false);
  } catch {
    // Ignore browsers blocking autoplay for UI sounds.
    return Promise.resolve(false);
  }
}
