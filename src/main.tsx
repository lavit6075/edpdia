import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

// Prerendered pages ship with markup already in #root, so we hydrate rather than re-render.
// A cold/empty shell (e.g. a route that wasn't prerendered) still mounts normally.
if (container.hasChildNodes()) {
  // Flag read by prerender.mjs's verification pass. Without it a mis-served shell would look
  // like a clean run: no markup to hydrate means no mismatch to report.
  ;(window as unknown as { __HYDRATED__?: boolean }).__HYDRATED__ = true
  hydrateRoot(
    container,
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
