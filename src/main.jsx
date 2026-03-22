import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { addSkipLink } from './utils/accessibility'

// Recover from stale lazy-loaded chunks after a deploy.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  window.location.reload()
})

// Add accessibility skip link
addSkipLink()

const hideBootLoader = () => {
  const bootLoader = document.getElementById('app-boot-loader')
  if (!bootLoader) return
  bootLoader.classList.add('is-hidden')
  window.setTimeout(() => {
    bootLoader.remove()
  }, 260)
}

const renderStartupError = (error) => {
  hideBootLoader()
  const root = document.getElementById('root')
  if (!root) return

  const message = error instanceof Error ? error.message : String(error || 'Unknown startup error')
  root.innerHTML = `
    <section style="
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #0b0b0d;
      color: #f1f1f2;
      font-family: 'Space Grotesk', sans-serif;
      padding: 24px;
      box-sizing: border-box;
    ">
      <div style="
        width: min(760px, 100%);
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 12px;
        background: rgba(255,255,255,0.03);
        box-shadow: 0 24px 60px rgba(0,0,0,0.45);
        padding: 24px;
      ">
        <h1 style="margin: 0 0 8px; font-size: 1.5rem; letter-spacing: 0.02em;">Lumiere failed to start</h1>
        <p style="margin: 0 0 14px; color: rgba(241,241,242,0.8); line-height: 1.5;">
          A runtime error occurred during app startup. Check the browser console for stack details.
        </p>
        <pre style="
          margin: 0;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.35);
          white-space: pre-wrap;
          word-break: break-word;
          color: #ffd6d6;
          font-size: 0.9rem;
          line-height: 1.45;
        ">${message}</pre>
      </div>
    </section>
  `
}

const isDev = import.meta.env.DEV

const ensureDevRuntimePanel = () => {
  if (!isDev) return null

  let panel = document.getElementById('dev-runtime-panel')
  if (panel) return panel

  panel = document.createElement('aside')
  panel.id = 'dev-runtime-panel'
  panel.setAttribute('aria-live', 'polite')
  panel.style.position = 'fixed'
  panel.style.right = '12px'
  panel.style.bottom = '12px'
  panel.style.width = 'min(680px, calc(100vw - 24px))'
  panel.style.maxHeight = '42vh'
  panel.style.overflow = 'auto'
  panel.style.zIndex = '3000'
  panel.style.padding = '10px'
  panel.style.borderRadius = '10px'
  panel.style.border = '1px solid rgba(255,255,255,0.2)'
  panel.style.background = 'rgba(10,10,12,0.92)'
  panel.style.backdropFilter = 'blur(6px)'
  panel.style.color = '#f5f5f7'
  panel.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
  panel.style.fontSize = '12px'
  panel.style.lineHeight = '1.45'
  panel.style.boxShadow = '0 20px 60px rgba(0,0,0,0.45)'
  panel.style.display = 'none'
  document.body.appendChild(panel)
  return panel
}

const stringifyIssue = (value) => {
  if (value instanceof Error) return value.stack || value.message
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const reportDevRuntimeIssue = (label, issue) => {
  const panel = ensureDevRuntimePanel()
  if (!panel) return

  panel.style.display = 'block'
  const item = document.createElement('div')
  item.style.padding = '8px 10px'
  item.style.borderBottom = '1px solid rgba(255,255,255,0.08)'

  const now = new Date().toLocaleTimeString()
  const text = `${now} [${label}] ${stringifyIssue(issue)}`
  item.textContent = text
  panel.appendChild(item)
  panel.scrollTop = panel.scrollHeight
}

if (isDev) {
  const originalConsoleError = console.error.bind(console)
  console.error = (...args) => {
    reportDevRuntimeIssue('console.error', args)
    originalConsoleError(...args)
  }
}

window.addEventListener('error', (event) => {
  reportDevRuntimeIssue('window.error', event.error || event.message)
  if (!document.getElementById('root')?.hasChildNodes()) {
    renderStartupError(event.error || event.message)
  }
})

window.addEventListener('unhandledrejection', (event) => {
  reportDevRuntimeIssue('unhandledrejection', event.reason)
  if (!document.getElementById('root')?.hasChildNodes()) {
    renderStartupError(event.reason)
  }
})

const deferredInit = async () => {
  try {
    const [analyticsModule, performanceModule, serviceWorkerModule] = await Promise.all([
      import('./services/analytics'),
      import('./services/performanceMonitor'),
      import('./utils/serviceWorker'),
    ])

    analyticsModule.default.init()
    performanceModule.default.init()
    serviceWorkerModule.registerServiceWorker()
  } catch (error) {
    console.error('Deferred initialization failed:', error)
  }
}

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(deferredInit, { timeout: 2000 })
} else {
  window.setTimeout(deferredInit, 0)
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  window.__LUMIERE_APP_MOUNTED__ = true
  window.dispatchEvent(new Event('lumiere:app-mounted'))
} catch (error) {
  console.error('Startup render failed:', error)
  renderStartupError(error)
}

// Prevent a stale boot overlay if startup is slow.
const failSafeHide = window.setTimeout(() => {
  hideBootLoader()
}, 4000)

requestAnimationFrame(() => {
  window.clearTimeout(failSafeHide)
  hideBootLoader()
})
