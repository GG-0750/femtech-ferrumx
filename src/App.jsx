import { useState } from 'react'
import Header from './components/header'
import Sidebar from './components/Sidebar'
import Screen1Intake from './screens/Screen1Intake'
import Screen2Symptoms from './screens/Screen2Symptoms'
import Screen3Result from './screens/Screen3Result'
import Screen4Reminders from './screens/Screen4Reminders'
import Dashboard from './screens/Dashboard'

export default function App() {
  const [screen, setScreen] = useState(1)
  const [patientData, setPatientData] = useState({})
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [patientId, setPatientId] = useState(null)

  if (window.location.pathname === '/dashboard') return <Dashboard />

  const progress = (screen / 4) * 100

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#0F1117', color: '#FFFFFF' }}>
      <Sidebar screen={screen} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <div className="h-1 w-full bg-[#1A1D27] md:hidden">
          <div className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#0F9B8E' }}></div>
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-6 md:py-12">
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            {screen === 1 && <Screen1Intake onNext={(data) => { setPatientData(data); setScreen(2) }} />}
            {screen === 2 && <Screen2Symptoms patientData={patientData} onNext={(ans, res) => { setAnswers(ans); setResult(res); setScreen(3) }} />}
            {screen === 3 && <Screen3Result result={result} patientData={patientData} onNext={(id) => { setPatientId(id); setScreen(4) }} />}
            {screen === 4 && <Screen4Reminders patientId={patientId} onDone={() => { setScreen(1); setPatientData({}); setAnswers({}); setResult(null); setPatientId(null) }} />}
          </div>
        </main>
        <div className="md:hidden p-3 text-center border-t" style={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3A' }}>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8892A4' }}>
            Step {screen} of 4: {screen === 1 ? 'Intake' : screen === 2 ? 'Symptoms' : screen === 3 ? 'Analysis' : 'Care Plan'}
          </p>
        </div>
      </div>
    </div>
  )
}