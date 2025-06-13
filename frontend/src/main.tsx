import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TimelyApp from './TimelyApp.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TimelyApp />
    </BrowserRouter>
  </StrictMode>,
)
