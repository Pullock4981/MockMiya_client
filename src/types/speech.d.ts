// src/types/speech.d.ts

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onaudioend?: (event: Event) => void
  onaudiostart?: (event: Event) => void
  onend?: (event: Event) => void
  onerror?: (event: Event) => void
  onnomatch?: (event: Event) => void
  onresult?: (event: SpeechRecognitionEvent) => void
  onsoundend?: (event: Event) => void
  onsoundstart?: (event: Event) => void
  onspeechend?: (event: Event) => void
  onspeechstart?: (event: Event) => void
  onstart?: (event: Event) => void
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  readonly isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition
  webkitSpeechRecognition: new () => SpeechRecognition
}

