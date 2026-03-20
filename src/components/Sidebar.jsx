// src/components/Sidebar.jsx
const steps = [
  { id: 1, label: 'Intake', icon: '📋' },
  { id: 2, label: 'Symptoms', icon: '🩺' },
  { id: 3, label: 'Result', icon: '📊' },
  { id: 4, label: 'Care Plan', icon: '🛡️' },
];

export default function Sidebar({ screen }) {
  return (
    <aside className="w-64 hidden md:flex flex-col border-r h-screen sticky top-0" 
           style={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3A' }}>
      
      <div className="p-6 mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#8892A4' }}>
          Assessment Progress
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {steps.map((step) => {
          const isActive = screen === step.id;
          const isCompleted = screen > step.id;

          return (
            <div key={step.id} className="relative flex items-center gap-4 p-4 rounded-lg transition-all"
                 style={{ 
                   backgroundColor: isActive ? '#0A2420' : 'transparent',
                   border: isActive ? '1px solid #0F9B8E' : '1px solid transparent'
                 }}>
              
              {/* Vertical line connector */}
              {step.id !== 4 && (
                <div className="absolute left-[27px] top-12 w-[2px] h-8" 
                     style={{ backgroundColor: isCompleted ? '#0F9B8E' : '#2A2D3A' }} />
              )}

              {/* Step Indicator Dot */}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10"
                   style={{ 
                     backgroundColor: isActive || isCompleted ? '#0F9B8E' : '#2A2D3A',
                     color: '#FFFFFF'
                   }}>
                {isCompleted ? '✓' : step.id}
              </div>

              <span className="text-sm font-medium" 
                    style={{ color: isActive ? '#FFFFFF' : '#8892A4' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="p-6 border-t" style={{ borderColor: '#2A2D3A' }}>
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F1117' }}>
          <p className="text-[10px] text-white opacity-50 uppercase">Worker ID</p>
          <p className="text-xs font-mono text-white">ASHA-TN-4201</p>
        </div>
      </div>
    </aside>
  );
}