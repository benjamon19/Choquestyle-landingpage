import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/Tailwind.css'
import App from './App'

// Silenciar advertencia de depreciación interna de THREE.Clock en @react-three/fiber + Three.js r183+
if (typeof window !== 'undefined') {
  const originalWarn = console.warn
  console.warn = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('THREE.Clock: This module has been deprecated')
    ) {
      return
    }
    originalWarn(...args)
  }
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)