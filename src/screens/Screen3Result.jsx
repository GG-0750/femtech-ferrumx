import { useEffect } from 'react'
import { savePatient } from '../utils/supabase'

const themes = {
  red:   { bg: '#2A0A0E', border: '#E94560', label: 'HIGH RISK', color: '#E94560' },
  amber: { bg: '#2A1A00', border: '#F5A623', label: 'MODERATE RISK', color: '#F5A623' },
  green: { bg: '#0A2420', border: '#0F9B8E', label: 'LOW RISK', color: '#0F9B8E' },
}

export default function Screen3Result({ result, patientData, onNext }) {
  const t = themes[result.level]

  useEffect(() => {
    if (result.level === 'red') {
      savePatient({
        name: patientData.name,
        village: patientData.village,
        blood_loss: patientData.blood,
        days_postpartum: patientData.days,
        risk_level: result.level,
        risk_score: result.score,
        action: result.action,
      })
    }
  }, [])

  const whatsappMsg = encodeURIComponent(
    `🚨 RED ALERT — FerrumX\nPatient: ${patientData.name}\nVillage: ${patientData.village}\nScore: ${result.score}\nAction: ${result.action}`
  )
  const whatsappNum = import.meta.env.VITE_PHC_WHATSAPP || '910000000000'

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="p-4 rounded-xl" style={{backgroundColor: t.bg, border: `2px solid ${t.border}`}}>
        <p className="text-xs uppercase font-bold" style={{color: t.color}}>{t.label}</p>
        <p className="text-4xl font-bold mt-1" style={{color: t.color}}>
          {result.override ? '!' : result.score}
        </p>
        <p className="text-sm mt-2 text-white">{result.action}</p>
        {result.override && (
          <p className="text-xs mt-2" style={{color: '#E94560'}}>Override: Pale eyelid + Heavy bleeding detected</p>
        )}
      </div>

      {result.level === 'red' && (
        <a href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`} target="_blank"
          className="w-full py-3 rounded-lg font-bold text-sm text-center block"
          style={{backgroundColor: '#25D366', color: '#fff'}}>
          Send WhatsApp Alert to PHC
        </a>
      )}

      <button onClick={onNext}
        className="w-full py-3 rounded-lg font-bold text-sm"
        style={{backgroundColor: '#0F9B8E', color: '#fff'}}>
        Next — Care Plan →
      </button>
    </div>
  )
}
//shows risk score with color theme .
//if red alert, shows button to send whatsapp message to PHC with patient details and risk score.