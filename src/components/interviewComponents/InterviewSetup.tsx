'use client'

import { useState } from 'react'

interface Props {
  onStart: (config: { name: string; jobRole: string; duration: 10 | 15 | 30 }) => void
}

export default function InterviewSetup({ onStart }: Props) {
  const [name, setName] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [duration, setDuration] = useState<10 | 15 | 30>(10)

  const roles = [
    'UX Designer',
    'Sales Representative',
    'Marketing Manager',
    'Data Scientist',
    'Product Manager',
    'Software Engineer',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !jobRole) return alert('Please fill all fields')
    onStart({ name, jobRole, duration })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-card p-6 rounded-2xl shadow flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">Start Interview</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border bg-gray-900 rounded-lg p-2"
      />

      <select
        value={jobRole}
        onChange={e => setJobRole(e.target.value)}
        className="border bg-gray-900 rounded-lg p-2"
      >
        <option value="">Select Job Role</option>
        {roles.map(r => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <select
        value={duration}
        onChange={e => setDuration(Number(e.target.value) as 10 | 15 | 30)}
        className="border bg-gray-900 rounded-lg p-2"
      >
        <option value={10}>10 minutes</option>
        <option value={15}>15 minutes</option>
        <option value={30}>30 minutes</option>
      </select>

      <button
        type="submit"
        className="bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90"
      >
        Start Voice AI Chat
      </button>
    </form>
  )
}