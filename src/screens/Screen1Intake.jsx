import { useState } from 'react'

const dayOptions = ['0–3 days', '4–7 days', '8–14 days', '15+ days']
const bloodOptions = ['Low', 'Medium', 'Heavy']

export default function Screen1Intake({ onNext }) {
  const [village, setVillage] = useState('')
  const [name, setName] = useState('')
  const [days, setDays] = useState('')
  const [blood, setBlood] = useState('')

  const ready = village && name && days && blood

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full" style={{maxWidth: '720px'}}>
        
        <p className="text-xs uppercase mb-6" style={{color: '#8892A4', letterSpacing: '0.1em'}}>Patient Intake</p>

        <div className="p-6 rounded-xl mb-4" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
          <p className="text-xs uppercase mb-3" style={{color: '#8892A4'}}>Patient Details</p>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Village name" value={village} onChange={e => setVillage(e.target.value)}
              className="w-full p-3 rounded-lg text-white text-sm outline-none"
              style={{backgroundColor: '#0F1117', border: '1px solid #2A2D3A'}} />
            <input placeholder="Patient name" value={name} onChange={e => setName(e.target.value)}
              className="w-full p-3 rounded-lg text-white text-sm outline-none"
              style={{backgroundColor: '#0F1117', border: '1px solid #2A2D3A'}} />
          </div>
        </div>

        <div className="p-6 rounded-xl mb-4" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
          <p className="text-xs uppercase mb-3" style={{color: '#8892A4'}}>Days since delivery</p>
          <div className="flex gap-2 flex-wrap">
            {dayOptions.map(d => (
              <button key={d} onClick={() => setDays(d)}
                className="px-4 py-2 rounded-full text-sm"
                style={{backgroundColor: days === d ? '#0F9B8E' : '#0F1117', border: '1px solid #2A2D3A', color: '#fff'}}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl mb-6" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
          <p className="text-xs uppercase mb-3" style={{color: '#8892A4'}}>Blood loss at delivery</p>
          <div className="grid grid-cols-3 gap-3">
            {bloodOptions.map(b => (
              <button key={b} onClick={() => setBlood(b)}
                className="py-3 rounded-lg text-sm font-bold"
                style={{backgroundColor: blood === b ? '#E94560' : '#0F1117', border: '1px solid #2A2D3A', color: '#fff'}}>
                {b}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onNext({ village, name, days, blood })} disabled={!ready}
          className="w-full py-3 rounded-lg font-bold text-sm"
          style={{backgroundColor: ready ? '#0F9B8E' : '#2A2D3A', color: ready ? '#fff' : '#8892A4'}}>
          Next — Symptoms →
        </button>

      </div>
    </div>
  )
}
//input form is filled out by asha.
//village, name, days since delivery, blood loss at delivery are collected. This data is used in the risk engine and care plan. 
