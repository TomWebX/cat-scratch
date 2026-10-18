const LINES = [
  'Timmi Tatz hat Hunger. Das Abendessen ist weg. Jemand wird dafür bezahlen.',
  'Ein Sofa. Es hat nichts getan. Noch nicht.',
  'Die Vase war unschuldig. Aber auch sehr zerbrechlich.',
  'Chaos ist keine Sünde, sondern ein Lebensstil.',
]

let lineIndex = 0

export function speak(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'de-DE'
  const voice = synth.getVoices().find((v) => v.lang.startsWith('de'))
  if (voice) u.voice = voice
  u.rate = 0.95
  synth.speak(u)
}

export function nextLine(): string {
  const line = LINES[lineIndex % LINES.length]
  lineIndex++
  return line
}
