const ELEVEN_ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVEN_VOICES_ENDPOINT = "https://api.elevenlabs.io/v1/voices";

const DEFAULT_VOICE_IDS = {
  "Turing-\u03A9": "JBFqnCBsd6RMkjVDRZzb",
  "Ares Prime": "pNInz6obpgDQGcFmaJgB",
  "Nova Sage": "EXAVITQu4vr4xnSDxMaL",
  "Lady Astra": "pFZP5JQG7iQjIQuC4Bku",
  "Core AI": "onwK4e9ZLuTAKqWW03F9",
  "Archive System": "21m00Tcm4TlvDq8ikWAM"
};

const VOICE_SETTINGS = {
  "Turing-\u03A9": {
    stability: 0.76,
    similarity_boost: 0.7,
    style: 0.16,
    speed: 0.9,
    use_speaker_boost: true
  },
  "Ares Prime": {
    stability: 0.34,
    similarity_boost: 0.82,
    style: 0.45,
    speed: 1.04,
    use_speaker_boost: true
  },
  "Nova Sage": {
    stability: 0.52,
    similarity_boost: 0.78,
    style: 0.46,
    speed: 0.83,
    use_speaker_boost: true
  },
  "Lady Astra": {
    stability: 0.48,
    similarity_boost: 0.8,
    style: 0.58,
    speed: 0.88,
    use_speaker_boost: true
  },
  "Core AI": {
    stability: 0.94,
    similarity_boost: 0.74,
    style: 0.02,
    speed: 0.78,
    use_speaker_boost: true
  },
  "Archive System": {
    stability: 0.82,
    similarity_boost: 0.72,
    style: 0.12,
    speed: 0.9,
    use_speaker_boost: true
  }
};

// Emotion keyword sets per agent identity
const EMOTION_HINTS = {
  "Ares Prime":  { urgentWords: ["now", "critical", "fail", "attack", "breach", "collapse", "immediate", "danger"], calmWords: ["hold", "wait", "steady"] },
  "Nova Sage":   { urgentWords: ["urgent", "critical", "danger", "collapse"], calmWords: ["calm", "safe", "stable", "hope", "trust"] },
  "Lady Astra":  { urgentWords: ["betrayal", "sacrifice", "doom", "fall", "end"], calmWords: ["grace", "order", "balance"] },
  "Turing-Ω":   { urgentWords: ["anomaly", "error", "critical", "breach", "failure"], calmWords: ["calculated", "probability", "analysis", "data"] },
  "Core AI":     { urgentWords: [], calmWords: [] }
};

// Clamp helper
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Returns emotion-adjusted settings, bounded to safe ranges
function applyEmotionVariation(agentName, text, baseSettings) {
  const hints = EMOTION_HINTS[agentName];
  if (!hints) return baseSettings;

  const lower = text.toLowerCase();
  const urgentCount = hints.urgentWords.filter((w) => lower.includes(w)).length;
  const calmCount = hints.calmWords.filter((w) => lower.includes(w)).length;

  // Net emotion shift: positive = more urgent, negative = calmer
  const shift = (urgentCount - calmCount) * 0.06;
  if (shift === 0) return baseSettings;

  const adjusted = { ...baseSettings };

  switch (agentName) {
    case "Ares Prime":
      // More urgent: lower stability, higher style, slightly faster
      adjusted.stability = clamp(baseSettings.stability - shift, 0.22, 0.52);
      adjusted.style = clamp(baseSettings.style + shift * 0.8, 0.3, 0.65);
      adjusted.speed = clamp(baseSettings.speed + shift * 0.15, 0.95, 1.18);
      break;
    case "Nova Sage":
      // Calmer: higher stability, lower style; urgent: slight style bump
      adjusted.stability = clamp(baseSettings.stability - shift * 0.5, 0.42, 0.68);
      adjusted.style = clamp(baseSettings.style + shift * 0.5, 0.3, 0.62);
      break;
    case "Lady Astra":
      // Dramatic moments: lower stability, higher style
      adjusted.stability = clamp(baseSettings.stability - shift * 0.6, 0.34, 0.62);
      adjusted.style = clamp(baseSettings.style + shift * 0.7, 0.4, 0.75);
      break;
    case "Turing-Ω":
      // Stays controlled; only tiny style nudge on anomaly
      adjusted.style = clamp(baseSettings.style + shift * 0.3, 0.08, 0.28);
      adjusted.stability = clamp(baseSettings.stability - shift * 0.2, 0.62, 0.86);
      break;
    default:
      break;
  }

  return adjusted;
}

let activeAudio = null;
let activeObjectUrl = null;
let activeAudioContext = null;
let activeSourceNode = null;
let runtimeApiKey = "";

function getApiKey() {
  return runtimeApiKey || import.meta.env.VITE_ELEVENLABS_API_KEY;
}

export function normalizeAgentName(name) {
  // Map common variations to canonical names
  const normalized = name.trim();

  // Check for exact match first
  if (DEFAULT_VOICE_IDS[normalized]) {
    return normalized;
  }

  // Case-insensitive matching
  const lowerName = normalized.toLowerCase();
  for (const agentName of Object.keys(DEFAULT_VOICE_IDS)) {
    if (agentName.toLowerCase() === lowerName) {
      return agentName;
    }
  }

  // Handle common variations
  if (lowerName.includes("turing") || lowerName.includes("omega")) {
    return "Turing-Ω";
  }
  if (lowerName.includes("ares") && lowerName.includes("prime")) {
    return "Ares Prime";
  }
  if (lowerName.includes("nova") && lowerName.includes("sage")) {
    return "Nova Sage";
  }
  if (lowerName.includes("lady") && lowerName.includes("astra")) {
    return "Lady Astra";
  }
  if (lowerName.includes("core") && lowerName.includes("ai")) {
    return "Core AI";
  }
  if (lowerName.includes("archive") && lowerName.includes("system")) {
    return "Archive System";
  }

  // Return original if no match found
  return normalized;
}

function getVoiceId(agentName) {
  const normalizedName = normalizeAgentName(agentName);
  const envKey = `VITE_ELEVENLABS_VOICE_${normalizedName
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()}`;
  return import.meta.env[envKey] || DEFAULT_VOICE_IDS[normalizedName];
}

export function stopVoicePlayback() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }

  if (activeSourceNode) {
    try {
      activeSourceNode.disconnect();
    } catch {}
    activeSourceNode = null;
  }

  if (activeAudioContext) {
    activeAudioContext.close().catch(() => {});
    activeAudioContext = null;
  }

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function setElevenLabsApiKey(apiKey) {
  runtimeApiKey = (apiKey || "").trim();
}

export function estimateSpeechDurationMs(agentName, text) {
  const normalizedName = normalizeAgentName(agentName);
  const settings = VOICE_SETTINGS[normalizedName] ?? { speed: 1 };
  const words = Math.max(1, text.trim().split(/\s+/).filter(Boolean).length);
  const effectiveSpeed = settings.speed || 1;
  const wordsPerMinute = 128 * effectiveSpeed;
  const spokenMs = (words / wordsPerMinute) * 60000;
  return Math.max(1800, spokenMs + 450);
}

export async function validateElevenLabsApiKey(apiKey) {
  const trimmed = (apiKey || "").trim();
  if (!trimmed) {
    return { ok: false, message: "Missing API key." };
  }

  try {
    const response = await fetch(ELEVEN_VOICES_ENDPOINT, {
      headers: {
        "xi-api-key": trimmed
      }
    });

    if (!response.ok) {
      return { ok: false, message: "ElevenLabs rejected this key." };
    }

    return { ok: true, message: "" };
  } catch {
    return { ok: false, message: "Could not reach ElevenLabs." };
  }
}

async function playWithBrowserVoice(agentName, text) {
  stopVoicePlayback();
  if (!("speechSynthesis" in window)) return;

  const normalizedName = normalizeAgentName(agentName);
  await new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate =
      normalizedName === "Ares Prime" ? 1.08 : normalizedName === "Core AI" ? 0.8 : normalizedName === "Nova Sage" ? 0.88 : normalizedName === "Archive System" ? 0.9 : 0.94;
    utterance.pitch = normalizedName === "Lady Astra" ? 1.08 : normalizedName === "Core AI" ? 0.58 : normalizedName === "Archive System" ? 0.84 : 1;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

export async function speakAgentLine(agentName, text) {
  const normalizedName = normalizeAgentName(agentName);
  const apiKey = getApiKey();
  const voiceId = getVoiceId(agentName);

  // Debug logging to verify voice assignment
  console.log(`🎤 Speaking as ${normalizedName}:`, {
    originalName: agentName,
    normalizedName,
    voiceId,
    voiceSettings: VOICE_SETTINGS[normalizedName]
  });

  if (!apiKey || !voiceId) {
    console.warn(`⚠️ [BROWSER FALLBACK] ${normalizedName}: API key or voice ID missing`);
    await playWithBrowserVoice(normalizedName, text);
    return { provider: "browser", reason: "missing_credentials" };
  }

  const emotionSettings = applyEmotionVariation(normalizedName, text, VOICE_SETTINGS[normalizedName]);

  const response = await fetch(`${ELEVEN_ENDPOINT}/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: emotionSettings
    })
  });

  if (!response.ok) {
    console.warn(`⚠️ [BROWSER FALLBACK] ${normalizedName}: ElevenLabs returned ${response.status}`);
    await playWithBrowserVoice(normalizedName, text);
    return { provider: "browser", reason: `elevenlabs_${response.status}` };
  }

  const blob = await response.blob();
  stopVoicePlayback();
  const url = URL.createObjectURL(blob);
  activeObjectUrl = url;
  const audio = new Audio(url);
  activeAudio = audio;
  let fallbackReason = "";
  await new Promise((resolve) => {
    audio.onended = resolve;
    audio.onerror = resolve;
    if (normalizedName === "Core AI") {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        activeAudioContext = ctx;
        const source = ctx.createMediaElementSource(audio);
        activeSourceNode = source;
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 1320;
        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 260;
        const notch = ctx.createBiquadFilter();
        notch.type = "notch";
        notch.frequency.value = 920;
        notch.Q.value = 2.8;
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -30;
        compressor.knee.value = 14;
        compressor.ratio.value = 14;
        compressor.attack.value = 0.001;
        compressor.release.value = 0.06;
        const gain = ctx.createGain();
        gain.gain.value = 0.92;
        source.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(notch);
        notch.connect(compressor);
        compressor.connect(gain);
        gain.connect(ctx.destination);
        audio.preservesPitch = false;
        audio.playbackRate = 0.92;
        audio.play().catch(async () => {
          console.warn(`⚠️ [BROWSER FALLBACK] ${normalizedName}: AudioContext play failed`);
          fallbackReason = "playback_failed";
          await playWithBrowserVoice(normalizedName, text);
          resolve();
        });
      } catch {
        audio.play().catch(async () => {
          console.warn(`⚠️ [BROWSER FALLBACK] ${normalizedName}: audio.play() failed`);
          fallbackReason = "playback_failed";
          await playWithBrowserVoice(normalizedName, text);
          resolve();
        });
      }
      return;
    }

    audio.play().catch(async () => {
      console.warn(`⚠️ [BROWSER FALLBACK] ${normalizedName}: audio.play() failed`);
      fallbackReason = "playback_failed";
      await playWithBrowserVoice(normalizedName, text);
      resolve();
    });
  });
  return fallbackReason ? { provider: "browser", reason: fallbackReason } : { provider: "elevenlabs" };
}
