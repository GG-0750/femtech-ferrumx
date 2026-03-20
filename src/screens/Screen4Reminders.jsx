import { useEffect, useState } from 'react'
import { fallbackFoods } from '../utils/nutritionData'

export default function Screen4Reminders({ onDone, result }) {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  // Mapping some common foods to icons for better UI
  const foodIcons = {
    "Moringa": "🌿", "Drumstick": "🌿", "Spinach": "🥬", "Dates": "🌴",
    "Jaggery": "🍯", "Beetroot": "🧶", "Amla": "🍏", "Ragi": "🌾",
    "Horse gram": "🫘", "Liver": "🥩", "Sesame": "🍪"
  }

  const getIcon = (name) => {
    const key = Object.keys(foodIcons).find(k => name.includes(k))
    return foodIcons[key] || "📍"
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  async function fetchFoods() {
    const key = import.meta.env.VITE_GEMINI_KEY
    if (!key) { setFoods(fallbackFoods); setLoading(false); return }
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: 'List 8 iron-rich foods common in rural Tamil Nadu. Return only a JSON array of strings. Keep names short.' }] }] 
        })
      })
      const data = await res.json()
      const text = data.candidates[0].content.parts[0].text
      const clean = text.replace(/```json|```/g, '').trim()
      setFoods(JSON.parse(clean))
    } catch {
      setFoods(fallbackFoods)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Quick Status */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Care Plan</h2>
        <p style={{ color: '#8892A4' }} className="text-sm">Regional Nutrition & Follow-up</p>
      </div>

      {/* 2. Iron Rich Foods - BIG GRID */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#1A1D27', border: '1px solid #2A2D3A' }}>
        <p className="text-xs uppercase font-bold mb-4 tracking-widest" style={{ color: '#0F9B8E' }}>
          Recommended Local Foods
        </p>
        
        {loading ? (
          <div className="py-10 text-center text-[#8892A4]">Consulting Nutrition AI...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {foods.map((food, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg" 
                   style={{ backgroundColor: '#0F1117', border: '1px solid #2A2D3A' }}>
                <span className="text-2xl">{getIcon(food)}</span>
                <span className="text-sm font-bold text-white leading-tight">{food}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Follow-up Timeline - List Style */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#1A1D27', border: '1px solid #2A2D3A' }}>
        <p className="text-xs uppercase font-bold mb-4 tracking-widest" style={{ color: '#F5A623' }}>
          Mandatory Home Visits
        </p>
        <div className="space-y-3">
          {[7, 14, 28].map(days => (
            <div key={days} className="flex justify-between items-center p-3 rounded-lg" 
                 style={{ backgroundColor: '#0F1117' }}>
              <div>
                <p className="text-xs text-[#8892A4]">Visit {days === 7 ? '1' : days === 14 ? '2' : '3'}</p>
                <p className="text-sm font-bold text-white">In {days} Days</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2A1A00', border: '1px solid #F5A623' }}>
                <span className="text-[#F5A623] text-xs">📅</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Button */}
      <button onClick={onDone}
        className="w-full py-5 rounded-lg font-bold text-base transition-transform active:scale-95"
        style={{ backgroundColor: '#0F9B8E', color: '#fff' }}>
        FINISH & SYNC DATA
      </button>
    </div>
  )
}
//calls gemini for food suggestions, replace hardcoded foods if api fails or key is missing. Schedules daily reminder notification for iron tablet. Shows follow-up dates and iron-rich food suggestions to asha.