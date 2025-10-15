
'use client'

import { useState } from 'react'
import InterviewSetup from '@/components/interviewComponents/InterviewSetup'
import InterviewAppClient from '@/components/interviewComponents/InterviewAppClient'

export default function LiveInterview () {
  const [started, setStarted] = useState(false)
  const [config, setConfig] = useState<{ name: string; jobRole: string; duration: 10 | 15 | 30 } | null>(null)

  const handleStart = (cfg: { name: string; jobRole: string; duration: 10 | 15 | 30 }) => {
    setConfig(cfg)
    setStarted(true)
  }

  const handleEnd = () => {
    alert('Interview completed!')
    setStarted(false)
    setConfig(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {!started && <InterviewSetup onStart={handleStart} />}
      {/* {started && config && <VoiceChat config={config} onEnd={handleEnd} />} */}
      {started && config && <InterviewAppClient config={config} onEnd={handleEnd} />}
    </div>
  )
}