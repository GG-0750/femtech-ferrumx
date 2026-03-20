export default function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{backgroundColor: '#1A1D27', borderBottom: '1px solid #2A2D3A'}}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#E94560'}}></div>
        <span className="font-bold text-white" style={{fontSize: '16px'}}>FerrumX</span>
      </div>
      <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#1A1D27', border: '1px solid #2A2D3A', color: '#8892A4'}}>ASHA Portal</span>
    </div>
  )
}