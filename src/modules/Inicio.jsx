import axios from "axios"
import { useEffect, useState } from "react"
import PaginatedItems from "./Pagination.jsx";
import { useAsteroids } from "../context/AsteroidContext";
import icon from "../assets/meteorito.png"
import fallback from "../assets/background.png"



export default function Inicio() {

  const PLACEHOLDER_DATA = {
  title: "A Galaxy Beyond",
  url: fallback,
  hdurl: fallback,
  explanation: "The NASA's services are experimenting issues, please wait until we can reconnect",
  media_type: "image"
};

  const [Data, setData] = useState(null);
  const [Info, setInfo] = useState([]);
  const [Error, setError] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [NameFilter, setNameFilter] = useState("");
  const [HazardousOnly, setHazardousOnly] = useState(false);
  const { setAsteroids } = useAsteroids();

  const apiKey = import.meta.env.VITE_API_KEY;

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
  
      const [resApod, resNeo] = await Promise.allSettled([
        axios.get("https://api.nasa.gov/planetary/apod", {
          params: { api_key: apiKey, thumbs: true },
          validateStatus: () => true
        }),
        axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
          params: { api_key: apiKey}
        })
      ]);

  try{ 

  
if (resApod.status === "fulfilled" && resApod.value.status === 200){
  setData(resApod.value.data);
} else {
  setData(PLACEHOLDER_DATA);
  setError("APOD failed");
}

if (
  resNeo.status === "fulfilled" &&
  resNeo.value.data?.near_earth_objects
) {
  const allAsteroids = Object.values(
    resNeo.value.data.near_earth_objects
  ).flat();

  setInfo(allAsteroids);
  setAsteroids(allAsteroids);
} else {
  console.error("NEO failed");
  setInfo([]);
}
  } finally {
    setLoading(false);
  }
}

  fetchData();
}, [setAsteroids]);

const filteredAsteroids = Info ?  Info.filter((asteroid) => {
  const matchesName = asteroid.name.toLowerCase().includes(NameFilter.toLowerCase());
  const matchesHazard = HazardousOnly ? asteroid.is_potentially_hazardous_asteroid : true;
  return matchesName && matchesHazard
}) : [];

if(Loading){
  return (
    <>
    <div className="h-screen w-full flex flex-col justify-center items-center bg-neutral-900">
      <div className="animate-pulse w-full flex justify-center">
        <img src={icon}/>
      </div>
    </div>
    </>
    )
  } else {
   return (
      <>
        <div className="h-screen [@media(max-width:768px)]:h-[50vh] w-full bg-neutral-900 border-b">
          <div className="group relative h-10/12 w-full overflow-hidden">
          {Data && Data.media_type === "image" ? (
            
            <img 
              className="h-full w-full object-cover" 
              src={Data?.hdurl || Data?.url} 
              alt={Data?.title}
              onLoad={(e) => e.currentTarget.classList.add('opacity-100')
              }
            />
          ) : (
            
          <video
            className="h-full w-full object-cover"
            src={Data?.url}
            controls
            autoPlay
            loop
            muted
            />
          )}

          <div className={`
        absolute inset-0 flex flex-col justify-center bg-black/60 p-8 
        opacity-0 transition-opacity duration-500 group-hover:opacity-100
        ${Data?.media_type === "video" ? "pointer-events-none" : ""}
        ${Data?.media_type === "video" ? "" : "backdrop-blur-sm"}
        `}>
    
    <h3 className=" @media(max-width:768px)]:opacity-100 [@media(max-width:768px)]:p-4 text-[#F375C2] font-black text-xl mb-2 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
      {Data?.title}
    </h3>
    <p className=" text-white text-sm line-clamp-6 transform translate-y-4 transition-transform duration-700 group-hover:translate-y-0">
      {Data?.explanation}
    </p>
    <br />
    <a href={`${Data.hdurl}`} target="_blank" className={`${Data?.media_type === "video" ? "opacity-0" : "opacity-100"} btn-primary hover:text-space-accent transition self-center [@media(max-width:768px)]:pointer-events-none`}>Full image</a>

  </div>
      </div>
          <div className="bg-neutral-900 min-h-screen">
            <div className=" w-3/5 [@media(max-width:768px)]:w-[95%] mx-auto grid grid-rows-2 justify-items-center mt-10 bg-[#0E21A0]/20 backdrop-blur-md border border-[#B153D7]/30 rounded-2xl p-6 shadow-lg">
            <label className="text-white text-2xl">Search an asteroid...</label>
            <input type="text" className = "w-2/3 [@media(max-width:768px)]:w-full rounded-2xl border border-[#B153D7]/30 p-3 shadow-lg text-white" onChange={(e) => setNameFilter(e.target.value)} />
            <br />
            <label className={`text-2xl [@media(max-width:768px)]:text-base mb-1 ${HazardousOnly ? "text-red-500 font-bold uppercase animate-pulse" : " text-[#00ccff] font-bold uppercase" }`}>{HazardousOnly ? "Hazardous Only!" : "All Asteroids"}</label>
            <label className="relative cursor-pointer">
              <input type="checkbox" className="sr-only peer" onChange={(e) => setHazardousOnly(e.target.checked)}/>
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-red-500 rounded-full transition-all duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>

            </label>
             </div>
          <PaginatedItems items={filteredAsteroids}/>
          <footer className="grid grid-rows-2 bg-[#0E21A0]/20 shadow-xl text-white justify-items-center pb-5">
           
           <p className="pt-3 font-thin">2026 | Ricardo Nacif Paez Henaine</p>
           <a href="https://github.com/RickyRick-s" target="_blank">
            <img className="h-10 invert" src="https://www.svgrepo.com/show/394174/github.svg"/>
            </a>
            <span className="mt-5 font-thin text-sm">
              Data provided by NASA Open APIs
            </span>
          </footer>
     
      </div>
        </div>
      </>
   );
  }
}