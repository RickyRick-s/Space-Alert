import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AsteroidProvider } from "./context/AsteroidContext";
import './styles/index.css'
import App from './modules/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AsteroidProvider>
      <App />
      </AsteroidProvider>
    </BrowserRouter>
  </StrictMode>,
)