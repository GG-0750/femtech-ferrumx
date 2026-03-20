// src/App.jsx
import { useState } from 'react'
import Header from './components/header'
import Sidebar from './components/Sidebar' // New Sidebar component
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

  // Handle PHC Dashboard route
  if (window.location.pathname === '/dashboard') return <Dashboard />

  // Progress percentage for mobile top-bar
  const progress = (screen / 4) * 100

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#0F1117', color: '#FFFFFF' }}>
      
      {/* 1. Sidebar: Visible only on desktop (md+) */}
      <Sidebar screen={screen} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header (Logo + Worker Info) */}
        <Header />

        {/* 3. Mobile Progress Bar: Visible only on small screens */}
        <div className="h-1 w-full bg-[#1A1D27] md:hidden">
          <div 
            className="h-full transition-all duration-500" 
            style={{ width: `${progress}%`, backgroundColor: '#0F9B8E' }}
          ></div>
        </div>

        {/* 4. Screen Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:py-12">
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            
            {/* Screen 1: Intake */}
            {screen === 1 && (
              <Screen1Intake 
                onNext={(data) => { 
                  setPatientData(data); 
                  setScreen(2); 
                }} 
              />
            )}

            {/* Screen 2: Symptoms */}
            {screen === 2 && (
              <Screen2Symptoms 
                patientData={patientData} 
                onNext={(ans, res) => { 
                  setAnswers(ans); 
                  setResult(res); 
                  setScreen(3); 
                }} 
              />
            )}

            {/* Screen 3: Result & Action */}
            {screen === 3 && (
              <Screen3Result 
                result={result} 
                patientData={patientData} 
                onNext={() => setScreen(4)} 
              />
            )}

            {/* Screen 4: Care Plan & AI Nutrition */}
            {screen === 4 && (
              <Screen4Reminders 
                onDone={() => { 
                  setScreen(1); 
                  setPatientData({}); 
                  setAnswers({}); 
                  setResult(null); 
                }} 
              />
            )}

          </div>
        </main>

        {/* Optional: Mobile Bottom Label (Shows step name on mobile) */}
        <div className="md:hidden p-3 text-center border-t" style={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3A' }}>
           <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8892A4' }}>
             Step {screen} of 4: {
               screen === 1 ? 'Intake' : 
               screen === 2 ? 'Symptoms' : 
               screen === 3 ? 'Analysis' : 'Care Plan'
             }
           </p>
        </div>

      </div>
    </div>
  )
}