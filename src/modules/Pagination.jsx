import { useState } from 'react';
import { AsteroidCard } from './asteroidCard.jsx';

export default function PaginatedItems({ items }) {

    const [selectedAsteroid, setSelectedAsteroid] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);


    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 900, behavior: 'smooth' });
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 900, behavior: 'smooth' });
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 900, behavior: 'smooth' });
        }
    };

    // Generar números de página
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col items-center w-full relative">
            <div 
            key={currentPage}
            className="flex flex-wrap gap-6 justify-center p-10 animate-fade-in">
                {currentItems.map((asteroide) => (
                    <AsteroidCard        
                        onSelect={() => setSelectedAsteroid(asteroide)}
                        key={asteroide.id}
                        name={asteroide.name}
                        type={asteroide.is_potentially_hazardous_asteroid ? "Hazardous" : "NEO"}
                        moid={asteroide.close_approach_data?.[0]?.miss_distance?.astronomical || "N/A"} 
                        pha={asteroide.is_potentially_hazardous_asteroid} 
                        lastObs={asteroide.close_approach_data?.[0]?.close_approach_date || "N/A"} 
                        size={asteroide.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) || "N/A"}
                    />
                ))}
            </div>

            {selectedAsteroid && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 transition-all animate-fade-in"
        onClick={() => setSelectedAsteroid(null)}
      >
        <div 
          className="bg-[#0E21A0]/20 backdrop-blur-md border border-[#F375C2]/30 p-8 rounded-3xl max-w-xl w-full shadow-[0_0_50px_rgba(243,117,194,0.2)]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-3xl font-black mb-2">{selectedAsteroid.name}</h2>
          <span className="text-[#F375C2] font-bold tracking-widest text-sm uppercase">Detailed Data</span>
          
          <div className="mt-6 space-y-6 text-white">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Name</p>
                <p className="font-mono text-lg">{selectedAsteroid.name}</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Hazardous</p>
                <p className="font-mono text-lg">{selectedAsteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}</p>
              </div>

                <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Minimum Orbit Intersection Distance</p>
                <p className="font-mono text-lg">{selectedAsteroid.close_approach_data?.[0]?.miss_distance?.astronomical || "N/A"}</p>
              </div>

                <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Last Observation Date</p>
                <p className="font-mono text-lg">{selectedAsteroid.close_approach_data?.[0]?.close_approach_date}</p>
              </div>

                <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Size</p>
                <p className="font-mono text-lg">{selectedAsteroid. estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) || "N/A"} Km</p>
              </div>
    
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Velocity</p>
                <p className="font-mono text-lg">{Number(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)} km/h</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-neutral-400 text-[10px] uppercase font-bold mb-1">Miss Distance</p>
                <p className="font-mono text-lg">{Number(selectedAsteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setSelectedAsteroid(null)}
            className="mt-8 w-full py-3 bg-[#F375C2] hover:bg-[#B153D7] text-white font-black rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )}
          
            <div className="flex flex-wrap justify-center gap-2 items-center my-8 w-full">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="shrink-0 px-4 py-2 border border-[#B153D7]/50 rounded-lg hover:bg-[#F375C2] transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    &lt; Ant
                </button>
                
                <div className="flex flex-wrap justify-center gap-2">
                {getPageNumbers().map(number => (
                    <button
                        key={number}
                        onClick={() => goToPage(number)}
                        className={` px-3 md:px-4 md:py-2 mdpx-4 py-2 rounded-lg transition-colors ${
                            currentPage === number
                                ? 'bg-[#F375C2] text-white shadow-[0_0_10px_#F375C2]'
                                : 'border border-[#B153D7]/50 hover:bg-[#F375C2] text-white'
                        }`}
                    >
                        {number}
                    </button>
                ))}
                </div>
                
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-[#B153D7]/50 rounded-lg hover:bg-[#F375C2] transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Sig &gt;
                </button>
            </div>
        </div>
    );
}