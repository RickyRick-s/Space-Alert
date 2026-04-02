import Radar3D from "./Radar3d.jsx";
import { useAsteroids } from "../context/AsteroidContext";
import { useEffect } from "react";
import axios from "axios";

export default function Radar() {

  const { asteroids, setAsteroids } = useAsteroids();
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {

    const fetchFallback = async () =>{
      if(asteroids.length === 0){
        const resFallback = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
          params: { api_key: apiKey }
        })
        const allAsteroids = Object.values(resFallback.data.near_earth_objects).flat();
        setAsteroids(allAsteroids)
      }
    }
    fetchFallback();
  }, [asteroids.length])
  return (
    <div className="bg-neutral-900 p-4">
  <Radar3D asteroids={asteroids} />
  </div>
  )
}