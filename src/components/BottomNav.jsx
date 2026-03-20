export default function BottomNav({ screen }) {
  const steps = [
    { label: 'Intake', num: 1 },
    { label: 'Symptoms', num: 2 },
    { label: 'Result', num: 3 },
    { label: 'Care Plan', num: 4 },
  ]

  return (
    <div className="fixed left-4 top-1/2 flex flex-col gap-3" style={{transform: 'translateY(-50%)', zIndex: 50}}>
      {steps.map(s => (
        <div key={s.num} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{backgroundColor: screen === s.num ? '#0F9B8E' : '#2A2D3A'}}></div>
          {screen === s.num && (
            <span className="text-xs uppercase" style={{color: '#0F9B8E', letterSpacing: '0.1em'}}>{s.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}
//shows current step highlighted in teal. Asha sees which screen she is on.