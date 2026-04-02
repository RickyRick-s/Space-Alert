import {createContext, useContext, useState} from "react";

const AsteroidContext = createContext();

export function AsteroidProvider({children}){
    const [asteroids, setAsteroids] = useState([]);

    return(
        <AsteroidContext.Provider value={{asteroids, setAsteroids}}>
            {children}
        </AsteroidContext.Provider>
    );
}

export function useAsteroids(){
    return useContext(AsteroidContext)
}