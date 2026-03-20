import { useEffect, useState } from 'react'
import { savePatient } from '../utils/supabase'
import { supabase } from '../utils/supabase'

const themes = {
  red:   { bg: '#2A0A0E', border: '#E94560', label: 'HIGH RISK', color: '#E94560' },
  amber: { bg: '#2A1A00', border: '#F5A623', label: 'MODERATE RISK', color: '#F5A623' },
  green: { bg: '#0A2420', border: '#0F9B8E', label: 'LOW RISK', color: '#0F9B8E' },
}

export default function Screen3Result({ result, patientData, onNext }) {
  const t = themes[result.level]
  const [picme, setPicme] = useState('')

    async function handleAlert() {
    const { data, error } = await supabase
        .from('patients')
        .insert([{
        name: patientData.name,
        village: patientData.village,
        blood_loss: patientData.blood,
        days_postpartum: patientData.days,
        risk_level: result.level,
        risk_score: result.score,
        action: result.action,
        picme_number: picme,
        }])
        .select()
    if (data && data[0]) onNext(data[0].id)
    }

  const whatsappMsg = encodeURIComponent(
    `🚨 RED ALERT — FerrumX\nPatient: ${patientData.name}\nVillage: ${patientData.village}\nPICME No: ${picme || 'Not entered'}\nScore: ${result.score}\nAction: ${result.action}`
  )
  const whatsappNum = import.meta.env.VITE_PHC_WHATSAPP || '910000000000'

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full" style={{maxWidth: '720px'}}>
        <div className="p-6 rounded-xl mb-4" style={{backgroundColor: t.bg, border: `2px solid ${t.border}`}}>
          <p className="text-xs uppercase font-bold" style={{color: t.color}}>{t.label}</p>
          <p className="text-5xl font-bold mt-2" style={{color: t.color}}>
            {result.override ? '!' : result.score}
          </p>
          <p className="text-sm mt-3 text-white">{result.action}</p>
          {result.override && (
            <p className="text-xs mt-2" style={{color: '#E94560'}}>Override: Pale eyelid + Heavy bleeding detected</p>
          )}
        </div>

        {result.level === 'red' && (
          <>
            <div className="p-5 rounded-xl mb-4" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
              <p className="text-xs uppercase mb-2" style={{color: '#8892A4'}}>PICME Number</p>
              <input
                placeholder="Enter 12-digit PICME / RCH ID"
                value={picme}
                onChange={e => setPicme(e.target.value)}
                maxLength={12}
                className="w-full p-3 rounded-lg text-white text-sm outline-none"
                style={{backgroundColor: '#0F1117', border: '1px solid #2A2D3A'}}
              />
            </div>

            <a href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`} target="_blank"
            onClick={handleAlert}
            className="w-full py-3 rounded-lg font-bold text-sm text-center block mb-3"
            style={{backgroundColor: '#25D366', color: '#fff'}}>
            Send WhatsApp Alert to PHC
            </a>
          </>
        )}

        <button onClick={onNext}
          className="w-full py-3 rounded-lg font-bold text-sm"
          style={{backgroundColor: '#0F9B8E', color: '#fff'}}>
          Next — Care Plan →
        </button>
      </div>
    </div>
  )
}
//shows risk score with color theme .
//if red alert, shows button to send whatsapp message to PHC with patient details and risk score.