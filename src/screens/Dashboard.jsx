import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export default function Dashboard() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
    if (!supabase) return
    
    const sub = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchPatients() // Refresh list on any change
      })
      .subscribe()
      
    return () => supabase.removeChannel(sub)
  }, [])

  async function fetchPatients() {
    if (!supabase) return
    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('risk_level', 'red')
      .order('created_at', { ascending: false })
    
    if (data) setPatients(data)
    setLoading(false)
  }

  async function acknowledge(id) {
    if (!supabase) return
    await supabase.from('patients').update({ acknowledged: true }).eq('id', id)
    setPatients(prev => prev.map(p => p.id === id ? { ...p, acknowledged: true } : p))
  }

  const pendingCount = patients.filter(p => !p.acknowledged).length

  return (
    <div className="min-h-screen pb-20" style={{backgroundColor: '#0F1117', color: '#fff'}}>
      {/* Dashboard Header */}
      <div className="sticky top-0 z-10 px-4 py-6 mb-6" style={{backgroundColor: '#0F1117', borderBottom: '1px solid #2A2D3A'}}>
        <div className="max-w-[720px] mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PHC Centre</h1>
            <p className="text-xs uppercase mt-1" style={{color: '#8892A4', letterSpacing: '0.1em'}}>Maternal Health Monitor</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black" style={{color: pendingCount > 0 ? '#E94560' : '#0F9B8E'}}>
              {pendingCount}
            </span>
            <p className="text-[10px] uppercase font-bold" style={{color: '#8892A4'}}>Pending Alerts</p>
          </div>
        </div>
      </div>

      <div className="px-4 mx-auto" style={{maxWidth: '720px'}}>
        {/* Stats Mini-Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
            <p className="text-[10px] uppercase mb-1" style={{color: '#8892A4'}}>Total Red Alerts</p>
            <p className="text-xl font-bold">{patients.length}</p>
          </div>
          <div className="p-4 rounded-xl" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A'}}>
            <p className="text-[10px] uppercase mb-1" style={{color: '#8892A4'}}>System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#0F9B8E'}}></div>
              <p className="text-sm font-bold text-white">Live Connection</p>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-4">
          {loading ? (
             <p className="text-center py-10 text-sm" style={{color: '#8892A4'}}>Loading alerts...</p>
          ) : patients.length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{border: '2px dashed #2A2D3A'}}>
              <p style={{color: '#8892A4'}}>No high-risk patients detected.</p>
            </div>
          ) : (
            patients.map(p => (
              <div key={p.id} className="relative overflow-hidden p-6 rounded-2xl transition-all" 
                   style={{
                     backgroundColor: '#1A1D27', 
                     border: `1px solid ${p.acknowledged ? '#2A2D3A' : '#E94560'}`,
                     opacity: p.acknowledged ? 0.7 : 1
                   }}>
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-[10px] font-black uppercase"
                     style={{
                       backgroundColor: p.acknowledged ? '#0F9B8E' : '#E94560',
                       color: '#fff'
                     }}>
                  {p.acknowledged ? 'Safe / Handled' : 'Action Required'}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="text-sm" style={{color: '#0F9B8E'}}>{p.village} Village</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y" style={{borderColor: '#2A2D3A'}}>
                    <div>
                      <p className="text-[10px] uppercase" style={{color: '#8892A4'}}>PICME / RCH ID</p>
                      <p className="text-sm font-mono text-white tracking-widest">{p.picme_number || '--- ---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase" style={{color: '#8892A4'}}>Score</p>
                      <p className="text-sm font-bold" style={{color: '#E94560'}}>{p.risk_score}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px]" style={{color: '#8892A4'}}>
                      Logged: {new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(p.created_at).toLocaleDateString()}
                    </p>
                    
                    {!p.acknowledged ? (
                      <button 
                        onClick={() => acknowledge(p.id)} 
                        className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-transform active:scale-95" 
                        style={{backgroundColor: '#E94560', color: '#fff'}}>
                        Acknowledge
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span style={{color: '#0F9B8E'}}>✓</span>
                        <span className="text-xs font-bold uppercase" style={{color: '#0F9B8E'}}>Recorded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
//phs staff view.realtime updates on new inserts