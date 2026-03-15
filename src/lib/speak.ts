/** Robust speech helper that waits for voices to load */
let voicesLoaded = false;

function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }
    // Voices load async in most browsers
    const onVoicesChanged = () => {
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Fallback timeout — some browsers never fire voiceschanged
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

export async function speak(text: string, lang: string = "id-ID") {
  if (!("speechSynthesis" in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const voices = await ensureVoices();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1.1;

  // Try to find a matching voice for the language
  const matchingVoice = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  // Chrome bug workaround: speech stops after ~15s of inactivity
  // Also some browsers need a small delay after cancel()
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 50);
}
