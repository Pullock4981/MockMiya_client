import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, role, name } = body as { text: string; role: string; name: string }

    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 500 })

    const endpoint =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

    // Context-aware prompt
    const systemPrompt = `
You are an AI interviewer. You are interviewing ${name || 'the candidate'} 
for the position of ${role || 'a professional role'}.
Ask one interview question at a time, listen to their response, 
and give short, specific feedback before the next question.
The interview should feel natural, friendly, and time-limited.
`

    const payload = {
      contents: [
        { parts: [{ text: `${systemPrompt}\nUser: ${text}\nAI:` }] },
      ],
    }

    const res = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', errText)
      return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 500 })
    }

    const data = await res.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.'

    return NextResponse.json({ text: reply })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}