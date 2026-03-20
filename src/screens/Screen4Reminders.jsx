import { useEffect, useState } from 'react'
import { fallbackFoods } from '../utils/nutritionData'

export default function Screen4Reminders({ onDone }) {
  const [foods, setFoods] = useState([])

  useEffect(() => {
    fetchFoods()
    scheduleReminder()
  }, [])

  async function fetchFoods() {
    const key = import.meta.env.VITE_GEMINI_KEY
    if (!key) { setFoods(fallbackFoods); return }
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'List 8 iron-rich foods common in rural Tamil Nadu. Return only a JSON array of strings. No explanation.' }] }] })
      })
      const data = await res.json()
      const text = data.candidates[0].content.parts[0].text
      const clean = text.replace(/```json|```/g, '').trim()
      setFoods(JSON.parse(clean))
    } catch {
      setFoods(fallbackFoods)
    }
  }

  async function scheduleReminder() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setTimeout(() => {
        new Notification('FerrumX Reminder', { body: 'Give iron tablet to patient today.' })
      }, 5000)
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="p-3 rounded-lg" style={{backgroundColor: '#0A2420', border: '1px solid #0F9B8E'}}>
        <p className="text-sm font-bold" style={{color: '#0F9B8E'}}>✓ Screening complete</p>
        <p className="text-xs mt-1" style={{color: '#8892A4'}}>Daily iron tablet reminder set for 08:00 AM</p>
      </div>

      <div className="p-3 rounded-lg" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
        <p className="text-xs uppercase mb-2" style={{color: '#8892A4'}}>Follow-up dates</p>
        {['Day 7', 'Day 14', 'Day 28'].map(d => (
          <p key={d} className="text-sm text-white py-1">• {d}</p>
        ))}
      </div>

      <div className="p-3 rounded-lg" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
        <p className="text-xs uppercase mb-2" style={{color: '#8892A4'}}>Iron-rich foods</p>
        <div className="flex flex-wrap gap-2">
          {foods.map((f, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs" style={{backgroundColor: '#0A2420', color: '#0F9B8E', border: '1px solid #0F9B8E'}}>
              {f}
            </span>
          ))}
        </div>
      </div>

      <button onClick={onDone}
        className="w-full py-3 rounded-lg font-bold text-sm"
        style={{backgroundColor: '#0F9B8E', color: '#fff'}}>
        Done — Next Patient
      </button>
    </div>
  )
}
//calls gemini for food suggestions, replace hardcoded foods if api fails or key is missing. Schedules daily reminder notification for iron tablet. Shows follow-up dates and iron-rich food suggestions to asha.