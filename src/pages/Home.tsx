import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'
import { ArrowUpRight, LampDesk, Moon, RotateCcw, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Navigation } from '../components/layout/Navigation'
import { StaticWorkspace } from '../components/workspace/StaticWorkspace'
import { WorkspacePanel } from '../components/workspace/WorkspacePanel'
import { useWorkspaceSelection, type WorkspaceObject } from '../hooks/useWorkspaceSelection'
import { person, workspaceObjects } from '../data/portfolio'
import { useWorkspaceStore } from '../store/workspaceStore'

const WorkspaceExperience = lazy(() => import('../components/canvas/WorkspaceExperience'))
const DesktopEnvironment = lazy(() => import('../components/desktop/DesktopEnvironment').then(module => ({ default: module.DesktopEnvironment })))

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}

function canUseWebGL(reducedMotion: boolean) {
  if (window.matchMedia('(max-width: 760px)').matches || reducedMotion) return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return false
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}

function WorkspaceStage({ selected, onSelect, onFocusArrived, onReadyChange }: { selected: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void; onFocusArrived: (object: WorkspaceObject, frame?: { top: number; right: number; bottom: number; left: number }) => void; onReadyChange: (ready: boolean) => void }) {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const theme = useWorkspaceStore(state => state.theme)
  const desktopOpen = useWorkspaceStore(state => state.mode === 'desktop')
  const lampOn = useWorkspaceStore(state => state.lampOn)
  const setTheme = useWorkspaceStore(state => state.setTheme)
  const toggleLamp = useWorkspaceStore(state => state.toggleLamp)
  const reducedMotion = useWorkspaceStore(state => state.reducedMotion)
  useEffect(() => {
    if (!canUseWebGL(reducedMotion)) { const id = window.setTimeout(() => { setEnabled(false); setReady(false); onReadyChange(false) }, 0); return () => clearTimeout(id) }
    const id = window.setTimeout(() => setEnabled(true), 280)
    return () => clearTimeout(id)
  }, [reducedMotion, onReadyChange])
  return <div className={`workspace-stage${ready ? ' workspace-stage--ready' : ''}`}>
    <StaticWorkspace onSelect={onSelect} lampOn={lampOn} />
    {enabled && <SceneBoundary onFailure={() => { setEnabled(false); setReady(false); onReadyChange(false) }}><Suspense fallback={null}><WorkspaceExperience selected={selected} scrollFocus={null} onSelect={onSelect} onFocusArrived={onFocusArrived} onReady={() => { setReady(true); onReadyChange(true) }} reducedMotion={reducedMotion} theme={theme} lampOn={lampOn} onToggleLamp={toggleLamp} paused={desktopOpen} /></Suspense></SceneBoundary>}
    <div className="stage-controls" aria-label="Workspace preferences"><button type="button" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')} aria-label={`Switch to ${theme === 'night' ? 'day' : 'night'} mode`}>{theme === 'night' ? <Sun size={17} /> : <Moon size={17} />}<span>{theme === 'night' ? 'Day' : 'Night'}</span></button><button type="button" onClick={toggleLamp} aria-pressed={lampOn} aria-label={`${lampOn ? 'Turn off' : 'Turn on'} desk lamp`}><LampDesk size={17} /><span>Lamp {lampOn ? 'on' : 'off'}</span></button></div>
    <div className="stage-label stage-label--top"><span className="live-dot" /> INTERACTIVE WORKSPACE <span> / 01</span></div>
    <div className="stage-label stage-label--bottom">DRAG TO ORBIT <span>·</span> SELECT AN OBJECT TO FOCUS</div>
    <div className="stage-coordinate" aria-hidden="true">X 02.486 &nbsp; Y 00.740<br />STUDIO / DEV.2026</div>
  </div>
}

export default function Home() {
  const { selected, select, clear } = useWorkspaceSelection()
  const mode = useWorkspaceStore(state => state.mode)
  const theme = useWorkspaceStore(state => state.theme)
  const reducedMotion = useWorkspaceStore(state => state.reducedMotion)
  const openApp = useWorkspaceStore(state => state.openApp)
  const setMode = useWorkspaceStore(state => state.setMode)
  const [sceneReady, setSceneReady] = useState(false)
  const [desktopOrigin, setDesktopOrigin] = useState({ top: 80, right: 0, bottom: 100, left: 0 })
  const handleSelect = (object: WorkspaceObject) => {
    if (object === 'monitor') {
      void import('../components/desktop/DesktopEnvironment')
      if (!sceneReady) {
        const rect = document.querySelector('.static-screen')?.getBoundingClientRect() ?? document.querySelector('.workspace-stage')?.getBoundingClientRect()
        if (rect) setDesktopOrigin({ top: Math.max(0, rect.top), right: Math.max(0, window.innerWidth - rect.right), bottom: Math.max(0, window.innerHeight - rect.bottom), left: Math.max(0, rect.left) })
      }
    }
    select(object)
    if (!sceneReady) { if (object === 'monitor') setMode('desktop'); else if (object === 'keyboard') openApp('terminal') }
  }
  const handleFocusArrived = useCallback((object: WorkspaceObject, frame?: { top: number; right: number; bottom: number; left: number }) => {
    if (object === 'monitor') { if (frame) setDesktopOrigin(frame); setMode('desktop') }
    else if (object === 'keyboard') openApp('terminal')
  }, [openApp, setMode])
  const handleClear = () => clear()

  useEffect(() => {
    document.title = 'DESK.OS — Adhi Keshavan B'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = 'Explore DESK.OS, the interactive developer workspace of Adhi Keshavan B.'
  }, [])

  return <div className="workspace-site" data-theme={theme}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation />
    <main id="main">
      <section id="home" className={`workspace-hero${selected ? ' workspace-hero--focused' : ''}`} aria-labelledby="hero-title">
        <div className="hero-studio-grid" aria-hidden="true" />
        <div className="hero-introduction">
          <span className="eyebrow"><span className="eyebrow-stroke" /> PORTFOLIO / 2026 <span className="eyebrow-separator">·</span> AVAILABLE FOR OPPORTUNITIES</span>
          <motion.h1 id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>A workspace<br /><em>with a pulse<span>.</span></em></motion.h1>
          <p className="hero-intro-line">Hi, I'm <strong>{person.shortName}.</strong></p>
          <p className="hero-description">Final-year CSBS student building useful software, thoughtful interfaces, reliable backend systems, and data-led solutions.</p>
          <div className="hero-availability"><span className="live-dot" /> OPEN TO INTERNSHIPS & ENTRY-LEVEL ROLES</div>
          <div className="hero-actions"><button type="button" className="button button-primary" onClick={() => handleSelect('monitor')}>Enter Workspace <ArrowUpRight size={17} /></button><Link className="button button-secondary" to="/quick-view">Quick View</Link></div>
          <div className="hero-side-note"><span>MONITOR / DESK.OS &nbsp;·&nbsp; KEYBOARD / TERMINAL</span></div>
        </div>
        <WorkspaceStage selected={selected} onSelect={handleSelect} onFocusArrived={handleFocusArrived} onReadyChange={setSceneReady} />
        <p className="sr-only">Select the monitor to enter DESK.OS, keyboard for the terminal, notebook for about and education, or phone for contact. Quick View provides direct access to every section.</p>
        <WorkspacePanel selected={selected === 'notebook' || selected === 'phone' ? selected : null} onClose={handleClear} />
        <div className="object-dock" aria-label="Explore workspace objects">{workspaceObjects.map(object => <button key={object.id} type="button" className={selected === object.id ? 'object-dock-item active' : 'object-dock-item'} onClick={() => handleSelect(object.id)} aria-pressed={selected === object.id}><span className="dock-number">{object.number}</span><span><strong>{object.title}</strong><small>{object.hint}</small></span><ArrowUpRight size={15} /></button>)}<button className="dock-overview" type="button" onClick={handleClear} disabled={!selected} aria-label="Return to workstation overview"><RotateCcw size={16} /><span>Overview</span></button></div>
      </section>
    </main>
    <Suspense fallback={null}><AnimatePresence>{mode === 'desktop' && <DesktopEnvironment origin={desktopOrigin} />}</AnimatePresence></Suspense>
  </div>
}
