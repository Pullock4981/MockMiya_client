
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AiAvatar } from './AiAvatar'

interface InterviewConfig {
  name: string
  jobRole: string
  duration: 10 | 15 | 30
}

interface Props {
  config: InterviewConfig
  onEnd: () => void
}

export default function VoiceChat({ config, onEnd }: Props) {
  const [state, setState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const [timeLeft, setTimeLeft] = useState<number>(config.duration * 60)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis)

  // ✅ Speak function (stable reference)
  const speak = useCallback(
    (text: string) => {
      if (!text) return
      setState('speaking')

      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.onend = () => setTimeout(() => startListening(), 1000)

      synthRef.current.speak(utter)
    },
    [] // no dependency — static function
  )

  // ✅ Send to AI API
  const sendToServer = useCallback(
    async (text: string) => {
      try {
        setState('thinking')
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            role: config.jobRole,
            name: config.name,
          }),
        })
        if (!res.ok) throw new Error('AI server error')

        const data: { text: string } = await res.json()
        speak(data.text)
      } catch (err) {
        // console.error('AI error:', err)
        speak('Sorry, there was an error connecting to the AI.')
      }
    },
    [config.jobRole, config.name, speak]
  )

  // ✅ Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onEnd])

  // ✅ Setup speech recognition
  useEffect(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionClass) {
      alert('Speech Recognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognitionClass()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setState('listening')
    recognition.onend = () => setState('thinking')
    recognition.onresult = async (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript
      await sendToServer(transcript)
    }

    recognitionRef.current = recognition
  }, [sendToServer])

  const startListening = () => {
    recognitionRef.current?.start()
  }

  const startInterview = () => {
    setState('speaking')
    speak(
      `Hello ${config.name}. Let's begin your interview for ${config.jobRole}. Tell me about yourself.`
    )
  }

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <AiAvatar state={state} />

      <div className="text-center text-lg font-medium">
        Time left: {formatTime(timeLeft)}
      </div>

      <button
        onClick={startInterview}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90"
      >
        Start Interview
      </button>
    </div>
  )
}

