export const AsteroidCard = ({ name, type, moid, pha, lastObs, size, onSelect }) => {
  return (
    <div
    onClick={onSelect}
    className="relative group [@media(max-width:768px)]:w-[90vw] [@media(max-width:768px)]:mx-auto [@media(max-width:768px)]:p-4 w-72 bg-[#0E21A0]/20 backdrop-blur-md border border-[#B153D7]/30 rounded-2xl p-6 shadow-lg transition-all hover:border-[#F375C2]/50 hover:shadow-[#4D2FB2]/40 hover:scale-105">
    
      <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg 
      ${
        pha ? 'bg-[#F375C2] text-white animate-pulse' : 'bg-[#4D2FB2] text-neutral-300'
      }`}>
        {pha ? '⚠️ Danger' : 'Safe'}
      </div>

      <header className="mb-4">
        <h3 className="text-white text-xl font-black truncate">{name}</h3>
        <span className="text-[#B153D7] text-[10px] font-bold uppercase tracking-widest">{type}</span>
      </header>

      <div className="space-y-4">
        {/* Distancia Mínima (MOID) */}
        <div>
          <p className="text-neutral-400 text-[9px] uppercase font-bold tracking-widest">Maximum Proximty (MOID)</p>
          <p className="text-white font-mono text-lg">{moid} <span className="text-xs text-[#F375C2]">AU</span></p>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
          <div>
            <p className="text-neutral-500 text-[8px] uppercase font-bold">Size</p>
            <p className="text-neutral-200 text-xs font-mono">{size} km</p>
          </div>

          <div>
            <p className="text-neutral-500 text-[8px] uppercase font-bold">Last observation date</p>
            <p className="text-neutral-200 text-xs font-mono">{lastObs}</p>
          </div>

      </div>

      {/* Decoración: línea de progreso estética */}
      <div className="mt-5 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
        <div className="h-full bg-linear-to-r from-[#4D2FB2] to-[#F375C2] w-3/4 shadow-[0_0_10px_#B153D7]"></div>
      </div>
      </div>
    </div>
  );
};
