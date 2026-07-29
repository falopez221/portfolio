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
const lastSportPlayedAt = new Map();
let sportAudioContext = null;

function getSportAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  if (!sportAudioContext || sportAudioContext.state === "closed") {
    sportAudioContext = new AudioContextConstructor();
  }

  return sportAudioContext;
}

function scheduleTone(context, {
  delay = 0,
  duration = 0.1,
  endFrequency,
  frequency,
  type = "sine",
  volume = 0.04,
}) {
  const startAt = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function scheduleWaterNoise(context) {
  const duration = 0.24;
  const frameCount = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  let seed = 17;

  for (let index = 0; index < frameCount; index += 1) {
    seed = (seed * 16807) % 2147483647;
    data[index] = ((seed / 2147483647) * 2 - 1) * (1 - index / frameCount);
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const startAt = context.currentTime;

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(880, startAt);
  filter.frequency.exponentialRampToValueAtTime(420, startAt + duration);
  filter.Q.value = 0.8;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.022, startAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(startAt);
}

export function playSportSound(sportId) {
  try {
    const now = performance.now();
    const previous = lastSportPlayedAt.get(sportId) || 0;
    if (now - previous < 140) return Promise.resolve(false);
    lastSportPlayedAt.set(sportId, now);

    const context = getSportAudioContext();
    if (!context) return Promise.resolve(false);
    if (context.state === "suspended") context.resume().catch(() => {});

    if (sportId === "football") {
      scheduleTone(context, {
        frequency: 108,
        endFrequency: 58,
        duration: 0.14,
        volume: 0.075,
      });
    } else if (sportId === "tennis") {
      scheduleTone(context, {
        frequency: 430,
        endFrequency: 175,
        duration: 0.095,
        type: "triangle",
        volume: 0.05,
      });
      scheduleTone(context, {
        delay: 0.012,
        frequency: 920,
        endFrequency: 420,
        duration: 0.06,
        volume: 0.022,
      });
    } else if (sportId === "pingpong") {
      scheduleTone(context, {
        frequency: 1180,
        endFrequency: 760,
        duration: 0.045,
        type: "square",
        volume: 0.026,
      });
      scheduleTone(context, {
        delay: 0.075,
        frequency: 980,
        endFrequency: 620,
        duration: 0.04,
        type: "square",
        volume: 0.02,
      });
    } else if (sportId === "swimming") {
      scheduleWaterNoise(context);
      scheduleTone(context, {
        frequency: 220,
        endFrequency: 138,
        duration: 0.25,
        type: "sine",
        volume: 0.026,
      });
    } else {
      scheduleTone(context, {
        frequency: 126,
        endFrequency: 72,
        duration: 0.085,
        volume: 0.042,
      });
      scheduleTone(context, {
        delay: 0.16,
        frequency: 116,
        endFrequency: 66,
        duration: 0.08,
        volume: 0.034,
      });
    }

    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

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
