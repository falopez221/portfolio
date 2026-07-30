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
let introAudioContext = null;
let introSoundActiveUntil = 0;
let introSoundMaster = null;

function getSportAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  if (!sportAudioContext || sportAudioContext.state === "closed") {
    sportAudioContext = new AudioContextConstructor();
  }

  return sportAudioContext;
}

function getIntroAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  if (!introAudioContext || introAudioContext.state === "closed") {
    introAudioContext = new AudioContextConstructor();
    introSoundActiveUntil = 0;
  }

  return introAudioContext;
}

export async function playEpicIntroSound() {
  try {
    const context = getIntroAudioContext();
    if (!context) return false;
    if (context.state === "suspended") {
      await Promise.race([
        context.resume(),
        new Promise((resolve) => window.setTimeout(resolve, 140)),
      ]);
    }
    if (context.state !== "running") return false;
    if (context.currentTime < introSoundActiveUntil) return true;

    const startsAt = context.currentTime + 0.03;
    const cueDuration = 7.6;
    const endsAt = startsAt + cueDuration;
    introSoundActiveUntil = endsAt;
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const droneFilter = context.createBiquadFilter();
    const detailFilter = context.createBiquadFilter();
    introSoundMaster = master;

    compressor.threshold.value = -24;
    compressor.knee.value = 20;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.012;
    compressor.release.value = 0.32;
    master.gain.setValueAtTime(0.0001, startsAt);
    master.gain.exponentialRampToValueAtTime(0.18, startsAt + 0.14);
    master.gain.setValueAtTime(0.18, startsAt + 6.94);
    master.gain.linearRampToValueAtTime(0.105, startsAt + 7.12);
    master.gain.setValueAtTime(0.105, startsAt + 7.24);
    master.gain.exponentialRampToValueAtTime(0.0001, endsAt);

    droneFilter.type = "lowpass";
    droneFilter.Q.value = 0.72;
    droneFilter.frequency.setValueAtTime(380, startsAt);
    droneFilter.frequency.exponentialRampToValueAtTime(920, startsAt + 3.8);
    droneFilter.frequency.exponentialRampToValueAtTime(210, startsAt + 7.12);

    detailFilter.type = "lowpass";
    detailFilter.Q.value = 0.5;
    detailFilter.frequency.setValueAtTime(4200, startsAt);
    detailFilter.frequency.exponentialRampToValueAtTime(6200, startsAt + 3.8);
    detailFilter.frequency.exponentialRampToValueAtTime(880, startsAt + 7.1);

    droneFilter.connect(master);
    detailFilter.connect(master);
    master.connect(compressor);
    compressor.connect(context.destination);

    const scheduleOscillator = ({
      attack = 0.02,
      destination = detailFilter,
      detune = 0,
      duration,
      endFrequency,
      frequency,
      release = 0.24,
      startOffset,
      type = "sine",
      volume,
    }) => {
      const noteStartsAt = startsAt + startOffset;
      const noteEndsAt = noteStartsAt + duration;
      const peakAt = noteStartsAt + Math.min(attack, duration * 0.42);
      const releaseAt = Math.max(peakAt, noteEndsAt - Math.min(release, duration * 0.72));
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, noteStartsAt);
      if (endFrequency && endFrequency !== frequency) {
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(20, endFrequency),
          noteEndsAt
        );
      }
      oscillator.detune.setValueAtTime(detune, noteStartsAt);
      gain.gain.setValueAtTime(0.0001, noteStartsAt);
      gain.gain.exponentialRampToValueAtTime(volume, peakAt);
      gain.gain.setValueAtTime(volume, releaseAt);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEndsAt);
      oscillator.connect(gain);
      gain.connect(destination);
      oscillator.start(noteStartsAt);
      oscillator.stop(noteEndsAt + 0.03);
    };

    const scheduleNoise = ({
      attack = 0.01,
      duration,
      filterType = "lowpass",
      fromFrequency,
      q = 0.8,
      seedValue,
      startOffset,
      toFrequency,
      volume,
    }) => {
      const frameCount = Math.floor(context.sampleRate * duration);
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      let seed = seedValue;

      for (let index = 0; index < frameCount; index += 1) {
        seed = (seed * 16807) % 2147483647;
        data[index] = (seed / 2147483647) * 2 - 1;
      }

      const noiseStartsAt = startsAt + startOffset;
      const noiseEndsAt = noiseStartsAt + duration;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();

      source.buffer = buffer;
      filter.type = filterType;
      filter.Q.value = q;
      filter.frequency.setValueAtTime(fromFrequency, noiseStartsAt);
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(20, toFrequency),
        noiseEndsAt
      );
      gain.gain.setValueAtTime(0.0001, noiseStartsAt);
      gain.gain.exponentialRampToValueAtTime(
        volume,
        noiseStartsAt + Math.min(attack, duration * 0.9)
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, noiseEndsAt);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(noiseStartsAt);
      source.stop(noiseEndsAt + 0.02);
    };

    // Opening hit: a restrained low-frequency impact with a short dark tail.
    scheduleNoise({
      duration: 1.05,
      fromFrequency: 1450,
      seedValue: 31,
      startOffset: 0,
      toFrequency: 110,
      volume: 0.62,
    });
    scheduleOscillator({
      attack: 0.012,
      destination: droneFilter,
      duration: 1.16,
      endFrequency: 32,
      frequency: 72,
      release: 0.98,
      startOffset: 0,
      volume: 0.72,
    });
    scheduleOscillator({
      attack: 0.008,
      destination: droneFilter,
      duration: 0.74,
      endFrequency: 52,
      frequency: 148,
      release: 0.62,
      startOffset: 0,
      type: "triangle",
      volume: 0.19,
    });

    // Orchestral-style low drone. Its tuning bends downward once gravity takes over.
    [
      { detune: -4, frequency: 36.71, type: "sine", volume: 0.3 },
      { detune: 3, frequency: 55, type: "triangle", volume: 0.17 },
      { detune: 0, frequency: 73.42, type: "sine", volume: 0.13 },
      { detune: 5, frequency: 110, type: "triangle", volume: 0.045 },
    ].forEach(({ detune, frequency, type, volume }) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startsAt);
      oscillator.frequency.setValueAtTime(frequency, startsAt + 3.8);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.54, startsAt + 7.12);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.42, endsAt);
      oscillator.detune.setValueAtTime(detune, startsAt);
      gain.gain.setValueAtTime(0.0001, startsAt);
      gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.72);
      gain.gain.setValueAtTime(volume, startsAt + 3.72);
      gain.gain.linearRampToValueAtTime(volume * 1.16, startsAt + 5.9);
      gain.gain.exponentialRampToValueAtTime(0.0001, endsAt);
      oscillator.connect(gain);
      gain.connect(droneFilter);
      oscillator.start(startsAt);
      oscillator.stop(endsAt + 0.04);
    });

    // Sparse rising motif while the concepts orbit Francisco.
    [
      { frequency: 293.66, offset: 0.72 },
      { frequency: 349.23, offset: 1.27 },
      { frequency: 440, offset: 1.9 },
      { frequency: 523.25, offset: 2.58 },
      { frequency: 698.46, offset: 3.27 },
    ].forEach(({ frequency, offset }, index) => {
      scheduleOscillator({
        attack: 0.025,
        duration: 0.72,
        frequency,
        release: 0.55,
        startOffset: offset,
        type: "triangle",
        volume: 0.085 + index * 0.006,
      });
      scheduleOscillator({
        attack: 0.035,
        detune: index % 2 === 0 ? 4 : -4,
        duration: 0.56,
        frequency: frequency * 2,
        release: 0.46,
        startOffset: offset + 0.015,
        volume: 0.022,
      });
    });

    // The pulse spacing compresses from 3.8 s onward to create controlled tension.
    const pulseFrequencies = [146.83, 174.61, 220, 261.63];
    let pulseOffset = 3.82;
    let pulseInterval = 0.34;
    let pulseIndex = 0;

    while (pulseOffset < 6.74) {
      const progress = (pulseOffset - 3.82) / (6.74 - 3.82);
      scheduleOscillator({
        attack: 0.008,
        duration: Math.max(0.1, pulseInterval * 0.72),
        frequency: pulseFrequencies[pulseIndex % pulseFrequencies.length],
        release: Math.max(0.07, pulseInterval * 0.55),
        startOffset: pulseOffset,
        type: "triangle",
        volume: 0.052 + progress * 0.045,
      });
      pulseOffset += pulseInterval;
      pulseInterval = Math.max(0.12, pulseInterval * 0.89);
      pulseIndex += 1;
    }

    scheduleNoise({
      attack: 2.72,
      duration: 3.34,
      filterType: "bandpass",
      fromFrequency: 230,
      q: 1.1,
      seedValue: 47,
      startOffset: 3.76,
      toFrequency: 3400,
      volume: 0.13,
    });

    // Long glissandi and a narrowing noise sweep suggest the gravitational pull.
    [
      { duration: 1.72, end: 52, frequency: 520, offset: 5.4, volume: 0.105 },
      { duration: 1.42, end: 41, frequency: 350, offset: 5.7, volume: 0.09 },
      { duration: 1.12, end: 29, frequency: 230, offset: 6, volume: 0.07 },
    ].forEach(({ duration, end, frequency, offset, volume }, index) => {
      scheduleOscillator({
        attack: 0.18 + index * 0.04,
        destination: droneFilter,
        duration,
        endFrequency: end,
        frequency,
        release: 0.26,
        startOffset: offset,
        type: index === 1 ? "triangle" : "sine",
        volume,
      });
    });
    scheduleNoise({
      attack: 0.56,
      duration: 0.64,
      filterType: "bandpass",
      fromFrequency: 380,
      q: 0.9,
      seedValue: 61,
      startOffset: 6.47,
      toFrequency: 5600,
      volume: 0.25,
    });

    // Implosion and blue-white flash at 7.1 s, followed by a clean cinematic tail.
    scheduleNoise({
      attack: 0.006,
      duration: 0.38,
      fromFrequency: 1900,
      seedValue: 79,
      startOffset: 7.08,
      toFrequency: 75,
      volume: 0.5,
    });
    scheduleOscillator({
      attack: 0.006,
      destination: droneFilter,
      duration: 0.48,
      endFrequency: 25,
      frequency: 96,
      release: 0.42,
      startOffset: 7.07,
      volume: 0.78,
    });
    scheduleOscillator({
      attack: 0.003,
      destination: master,
      duration: 0.38,
      endFrequency: 880,
      frequency: 1174.66,
      release: 0.34,
      startOffset: 7.12,
      volume: 0.09,
    });
    scheduleOscillator({
      attack: 0.003,
      destination: master,
      detune: 3,
      duration: 0.3,
      endFrequency: 1320,
      frequency: 1760,
      release: 0.27,
      startOffset: 7.125,
      volume: 0.036,
    });

    return true;
  } catch {
    introSoundActiveUntil = 0;
    introSoundMaster = null;
    return false;
  }
}

export function stopEpicIntroSound(fadeDuration = 0.22) {
  if (!introAudioContext || !introSoundMaster) return;

  try {
    const master = introSoundMaster;
    const now = introAudioContext.currentTime;
    const fadeEndsAt = now + Math.max(0.03, fadeDuration);
    const currentGain = Math.max(master.gain.value, 0.0001);

    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(currentGain, now);
    master.gain.exponentialRampToValueAtTime(0.0001, fadeEndsAt);
    introSoundActiveUntil = fadeEndsAt;

    window.setTimeout(() => {
      try {
        master.disconnect();
      } catch {
        // The graph may already be disconnected after a browser context reset.
      }
      if (introSoundMaster === master) {
        introSoundMaster = null;
        introSoundActiveUntil = 0;
      }
    }, Math.ceil((fadeEndsAt - now) * 1000) + 40);
  } catch {
    introSoundMaster = null;
    introSoundActiveUntil = 0;
  }
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
