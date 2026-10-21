import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import StandaloneApp from './app/StandaloneApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StandaloneApp />
  </StrictMode>,
)
