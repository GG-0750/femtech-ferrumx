import { useState } from 'react'
import Header from './components/header'
import BottomNav from './components/BottomNav'
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

  if (window.location.pathname === '/dashboard') return <Dashboard />

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#0F1117', color: '#FFFFFF'}}>
      <Header />
      <div className="flex-1 overflow-y-auto">
        <BottomNav screen={screen} />
        {screen === 1 && <Screen1Intake onNext={(data) => { setPatientData(data); setScreen(2) }} />}
        {screen === 2 && <Screen2Symptoms patientData={patientData} onNext={(ans, res) => { setAnswers(ans); setResult(res); setScreen(3) }} />}
        {screen === 3 && <Screen3Result result={result} patientData={patientData} onNext={() => setScreen(4)} />}
        {screen === 4 && <Screen4Reminders onDone={() => { setScreen(1); setPatientData({}); setAnswers({}); setResult(null) }} />}
      </div>
    </div>
  )
}