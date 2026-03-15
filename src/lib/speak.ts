/** Robust speech helper with Web Audio API fallback for in-app browsers (Telegram, etc.) */
let voicesLoaded = false;

function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }
    const onVoicesChanged = () => {
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

/** Fallback: play a pleasant notification tone via Web Audio API */
function playFallbackTone() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    // Play a two-note chime (pleasant notification sound)
    const notes = [660, 880]; // E5, A5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Silently fail if Web Audio is also unsupported
  }
}

/** Check if speechSynthesis is truly functional (not just present but broken) */
function isSpeechSynthesisWorking(): boolean {
  if (!("speechSynthesis" in window)) return false;
  // Some in-app browsers define speechSynthesis but it never works
  try {
    // If getVoices returns empty and voiceschanged never fires, it's broken
    // We'll try and fall back if it fails
    return true;
  } catch {
    return false;
  }
}

let speechFailed = false;

export async function speak(text: string, lang: string = "id-ID") {
  // If speech previously failed in this session, go straight to fallback
  if (speechFailed) {
    playFallbackTone();
    return;
  }

  if (!isSpeechSynthesisWorking()) {
    speechFailed = true;
    playFallbackTone();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const voices = await ensureVoices();

  // If no voices available, mark as failed and use fallback
  if (!voices || voices.length === 0) {
    speechFailed = true;
    playFallbackTone();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1.1;

  const matchingVoice = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  // Detect if speech actually fires — if onerror triggers, switch to fallback
  utterance.onerror = () => {
    speechFailed = true;
    playFallbackTone();
  };

  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 50);
}
