// Озвучка испанского слова через Web Speech API.
// Чистим многоточие и вариант после "/" (как в исходнике): "Sin / Con" → "Sin".

export function speak(text) {
  const clean = text.replace('…', '').replace(/\/.*/, '');
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'es-ES';
  u.rate = .85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
