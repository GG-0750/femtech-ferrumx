import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export default function Dashboard() {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    fetchPatients()
    if (!supabase) return
    const sub = supabase
      .channel('patients')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'patients' }, payload => {
        setPatients(prev => [payload.new, ...prev])
      })
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  async function fetchPatients() {
    if (!supabase) return
    const { data } = await supabase.from('patients').select('*').eq('risk_level', 'red').order('created_at', { ascending: false })
    if (data) setPatients(data)
  }

  async function acknowledge(id) {
    if (!supabase) return
    await supabase.from('patients').update({ acknowledged: true }).eq('id', id)
    setPatients(prev => prev.map(p => p.id === id ? { ...p, acknowledged: true } : p))
  }

  return (
    <div className="min-h-screen p-4" style={{backgroundColor: '#0F1117', color: '#fff'}}>
      <p className="font-bold text-lg mb-4">PHC Dashboard — Red Alerts</p>
      {patients.length === 0 && <p style={{color: '#8892A4'}}>No red alerts.</p>}
      {patients.map(p => (
        <div key={p.id} className="p-4 rounded-xl mb-3" style={{backgroundColor: '#1A1D27', border: `1px solid ${p.acknowledged ? '#0F9B8E' : '#E94560'}`}}>
          <p className="font-bold text-white">{p.name} — {p.village}</p>
          <p className="text-xs mt-1" style={{color: '#8892A4'}}>Score: {p.risk_score} | {p.action}</p>
          {p.picme_number && <p className="text-xs mt-1" style={{color: '#8892A4'}}>PICME: {p.picme_number}</p>}
          <p className="text-xs" style={{color: '#8892A4'}}>{new Date(p.created_at).toLocaleString()}</p>
          {!p.acknowledged
            ? <button onClick={() => acknowledge(p.id)} className="mt-2 px-4 py-1 rounded-full text-xs font-bold" style={{backgroundColor: '#E94560', color: '#fff'}}>Acknowledge</button>
            : <p className="mt-2 text-xs font-bold" style={{color: '#0F9B8E'}}>✓ Acknowledged</p>
          }
        </div>
      ))}
    </div>
  )
}
//phs staff view.realtime updates on new inserts