import { useState } from 'react'
import { calculateRisk } from '../utils/riskEngine'

const SYMPTOMS = [
  { key: 'eyelid',  label: 'Pale inner eyelid' },
  { key: 'nails',   label: 'Pale nail beds' },
  { key: 'breath',  label: 'Breathless at rest' },
  { key: 'heart',   label: 'Heart pounding / racing' },
  { key: 'dizzy',   label: 'Dizziness or fainting' },
  { key: 'fatigue', label: 'Severe fatigue' },
  { key: 'days',    label: 'Delivered within last 3 days' },
]

export default function Screen2Symptoms({ patientData, onNext }) {
  const [answers, setAnswers] = useState({})

  const toggle = (key, val) => setAnswers(prev => ({ ...prev, [key]: val }))

  const handleCalculate = () => {
    const fullAnswers = { ...answers, bleeding: patientData.blood === 'Heavy' }
    const result = calculateRisk(fullAnswers)
    onNext(fullAnswers, result)
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="text-xs uppercase" style={{color: '#8892A4'}}>Symptom Checklist</p>

      {SYMPTOMS.map(s => (
        <div key={s.key} className="flex items-center justify-between p-3 rounded-lg"
          style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
          <span className="text-sm text-white">{s.label}</span>
          <div className="flex gap-2">
            {['Yes', 'No'].map(v => (
              <button key={v} onClick={() => toggle(s.key, v === 'Yes')}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: answers[s.key] === (v === 'Yes') && answers[s.key] !== undefined
                    ? (v === 'Yes' ? '#E94560' : '#0F9B8E')
                    : '#2A2D3A',
                  color: '#fff'
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleCalculate}
        className="w-full py-3 rounded-lg font-bold text-sm mt-2"
        style={{backgroundColor: '#E94560', color: '#fff'}}>
        Calculate Risk Score
      </button>
    </div>
  )
}
//7 symptoms toggles
//calls calculateRisk function from risk engine with answers and patient data (for bleeding) to get risk score. This is used to determine the care plan in the next screen.