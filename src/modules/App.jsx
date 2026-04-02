import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Inicio from '../modules/Inicio.jsx' 
import Radar from '../modules/Radar.jsx' 

function App() {

  return (
    <>
    <Header />
    <Routes>
<Route path="/" element={<Inicio/>}/>
<Route path="/radar" element={<Radar/>}/>
    </Routes>
    </>
  )
}

export default App
