


'use client'

import { useState } from 'react'
import { User, Award, Building, Clock, Play, Video } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  onStart: (config: { name: string; jobRole: string; duration: 10 | 15 | 30; company?: string }) => void
}

export default function VideoInterviewSetup({ onStart }: Props) {
  const [interviewConfig, setInterviewConfig] = useState({
    name: '',
    jobRole: '',
    company: '',
    duration: 10 as 10 | 15 | 30,
  })

  const startInterview = () => {
    const { name, jobRole } = interviewConfig
    if (!name || !jobRole) {
      alert('Please fill all required fields')
      return
    }
    onStart(interviewConfig)
  }

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="text-2xl sm:text-3xl">🎥</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--card-foreground)]">
            AI Video Interview
          </h1>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto px-4">
          Practice realistic face-to-face interviews with live AI feedback
        </p>
      </div>

      {/* Configuration Card */}
      <div className="max-w-2xl mx-auto px-2 sm:px-0">
        <div className="border-[var(--border)] bg-[var(--card)] shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
          <CardHeader className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-light)]/5 border-b border-[var(--border)]">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--card-foreground)] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg sm:rounded-xl">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              Video Interview Setup
            </CardTitle>
            <p className="text-sm sm:text-base text-[var(--foreground-muted)] mt-2">
              Configure your camera interview session with AI
            </p>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                Your Name *
              </label>
              <input
                type="text"
                value={interviewConfig.name}
                onChange={e => setInterviewConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm sm:text-base"
                placeholder="Enter your full name"
              />
            </div>

            {/* Job Role Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                Job Role *
              </label>
              <select
                value={interviewConfig.jobRole}
                onChange={e => setInterviewConfig(prev => ({ ...prev, jobRole: e.target.value }))}
                className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] text-sm sm:text-base"
              >
                <option value="">Select Job Role</option>
                {[
                  'UX Designer',
                  'Sales Representative',
                  'Marketing Manager',
                  'Data Scientist',
                  'Product Manager',
                  'Software Engineer',
                ].map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                <Building className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                Company
              </label>
              <input
                type="text"
                value={interviewConfig.company}
                onChange={e => setInterviewConfig(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm sm:text-base"
                placeholder="Target company (optional)"
              />
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                Interview Duration
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[10, 15, 30].map(duration => (
                  <Button
                    key={duration}
                    type="button"
                    onClick={() => setInterviewConfig(prev => ({ ...prev, duration: duration as 10 | 15 | 30 }))}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 text-xs sm:text-sm ${
                      interviewConfig.duration === duration
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-lg'
                        : 'border-[var(--border)] text-[var(--foreground)] bg-[var(--background)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {duration} min
                  </Button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={startInterview}
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              size="lg"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start Video Interview
            </Button>
          </CardContent>
        </div>
      </div>
    </div>
  )
}
