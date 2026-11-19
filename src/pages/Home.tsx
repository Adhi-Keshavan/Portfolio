import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Download, LampDesk, Moon, RotateCcw, Sun } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Navigation } from '../components/layout/Navigation'
import { StaticWorkspace } from '../components/workspace/StaticWorkspace'
import { WorkspacePanel } from '../components/workspace/WorkspacePanel'
import { PortfolioSections } from '../components/workspace/PortfolioSections'
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

function canUseWebGL() {
  if (window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches) return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return false
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}

function WorkspaceStage({ selected, scrollFocus, onSelect }: { selected: WorkspaceObject | null; scrollFocus: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void }) {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const theme = useWorkspaceStore(state => state.theme)
  const desktopOpen = useWorkspaceStore(state => state.mode === 'desktop')
  const lampOn = useWorkspaceStore(state => state.lampOn)
  const setTheme = useWorkspaceStore(state => state.setTheme)
  const toggleLamp = useWorkspaceStore(state => state.toggleLamp)
  const reducedMotion = useReducedMotion() ?? false
  useEffect(() => {
    if (!canUseWebGL()) return
    const id = window.setTimeout(() => setEnabled(true), 280)
    return () => clearTimeout(id)
  }, [])
  return <div className={`workspace-stage${ready ? ' workspace-stage--ready' : ''}`}>
    <StaticWorkspace onSelect={onSelect} lampOn={lampOn} />
    {enabled && <SceneBoundary onFailure={() => { setEnabled(false); setReady(false) }}><Suspense fallback={null}><WorkspaceExperience selected={selected} scrollFocus={scrollFocus} onSelect={onSelect} onReady={() => setReady(true)} reducedMotion={reducedMotion} theme={theme} lampOn={lampOn} onToggleLamp={toggleLamp} paused={desktopOpen} /></Suspense></SceneBoundary>}
    <div className="stage-controls" aria-label="Workspace preferences"><button type="button" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')} aria-label={`Switch to ${theme === 'night' ? 'day' : 'night'} mode`}>{theme === 'night' ? <Sun size={17} /> : <Moon size={17} />}<span>{theme === 'night' ? 'Day' : 'Night'}</span></button><button type="button" onClick={toggleLamp} aria-pressed={lampOn} aria-label={`${lampOn ? 'Turn off' : 'Turn on'} desk lamp`}><LampDesk size={17} /><span>Lamp {lampOn ? 'on' : 'off'}</span></button></div>
    <div className="stage-label stage-label--top"><span className="live-dot" /> INTERACTIVE WORKSPACE <span> / 01</span></div>
    <div className="stage-label stage-label--bottom">DRAG TO ORBIT <span>·</span> SELECT AN OBJECT TO FOCUS</div>
    <div className="stage-coordinate" aria-hidden="true">X 02.486 &nbsp; Y 00.740<br />STUDIO / DEV.2026</div>
  </div>
}

function ResumeAction({ className = '' }: { className?: string }) {
  return <a className={className} href={person.resume || `mailto:${person.email}?subject=Resume%20request`}{...(person.resume ? { download: true } : {})}>{person.resume ? 'Download résumé' : 'Request résumé'} {person.resume ? <Download size={16} /> : <ArrowUpRight size={16} />}</a>
}

export default function Home() {
  const { selected, select, clear } = useWorkspaceSelection()
  const mode = useWorkspaceStore(state => state.mode)
  const theme = useWorkspaceStore(state => state.theme)
  const openApp = useWorkspaceStore(state => state.openApp)
  const [active, setActive] = useState('home')
  const [scrollFocus, setScrollFocus] = useState<WorkspaceObject | null>(null)
  const progress = useRef<HTMLDivElement>(null)
  const focusTimer = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()
  const handleSelect = (object: WorkspaceObject) => {
    if (focusTimer.current !== null) window.clearTimeout(focusTimer.current)
    select(object)
    if (object === 'monitor' || object === 'keyboard') focusTimer.current = window.setTimeout(() => openApp(object === 'monitor' ? 'projects' : 'terminal'), reducedMotion ? 0 : 500)
  }
  const handleClear = () => { if (focusTimer.current !== null) window.clearTimeout(focusTimer.current); focusTimer.current = null; clear() }

  useEffect(() => {
    document.title = 'The Living Workspace — Adhi Keshavan B'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = 'Explore The Living Workspace: real software, backend, and data projects in an interactive developer studio.'
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-22% 0px -55% 0px', threshold: [0, .2, .5] })
    for (const id of ['home', 'about', 'projects', 'skills', 'contact']) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      const heroHeight = document.getElementById('home')?.offsetHeight || 1
      const ratio = window.scrollY / heroHeight
      const next: WorkspaceObject | null = ratio < .18 ? null : ratio < .38 ? 'notebook' : ratio < .58 ? 'monitor' : ratio < .78 ? 'keyboard' : 'phone'
      setScrollFocus(next)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    if (window.location.hash) window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 60)
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); if (focusTimer.current !== null) window.clearTimeout(focusTimer.current) }
  }, [])

  return <div className="workspace-site" data-theme={theme}>
    <div className="scroll-progress" ref={progress} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation active={active} />
    <main id="main">
      <section id="home" className={`workspace-hero${selected ? ' workspace-hero--focused' : ''}`} aria-labelledby="hero-title">
        <div className="hero-studio-grid" aria-hidden="true" />
        <div className="hero-introduction">
          <span className="eyebrow"><span className="eyebrow-stroke" /> PORTFOLIO / 2026 <span className="eyebrow-separator">·</span> AVAILABLE FOR OPPORTUNITIES</span>
          <motion.h1 id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>The Living<br /><em>Workspace<span>.</span></em></motion.h1>
          <p className="hero-intro-line">Hi, I'm <strong>{person.shortName}.</strong></p>
          <p className="hero-description">Final-year CSBS student building useful software, thoughtful interfaces, reliable backend systems, and data-led solutions.</p>
          <div className="hero-availability"><span className="live-dot" /> OPEN TO INTERNSHIPS & ENTRY-LEVEL ROLES</div>
          <div className="hero-actions"><button type="button" className="button button-primary" onClick={() => handleSelect('monitor')}>Enter the desktop <ArrowUpRight size={17} /></button><ResumeAction className="button button-secondary" /></div>
          <div className="hero-side-note"><div className="hero-side-note-copy"><span>THE DESK IS THE NAVIGATION.</span><span>EVERY OBJECT OPENS A PART OF MY WORK.</span></div><a className="hero-scroll" href="#about">SCROLL TO EXPLORE <ArrowDown size={15} /></a></div>
        </div>
        <WorkspaceStage selected={selected} scrollFocus={reducedMotion ? null : scrollFocus} onSelect={handleSelect} />
        <p className="sr-only">Select the monitor for the project desktop, keyboard for the terminal, notebook for about and education, or phone for contact. All information is also available in the sections below.</p>
        <WorkspacePanel selected={selected === 'notebook' || selected === 'phone' ? selected : null} onClose={handleClear} />
        <div className="object-dock" aria-label="Explore workspace objects">{workspaceObjects.map(object => <button key={object.id} type="button" className={selected === object.id ? 'object-dock-item active' : 'object-dock-item'} onClick={() => handleSelect(object.id)} aria-pressed={selected === object.id}><span className="dock-number">{object.number}</span><span><strong>{object.title}</strong><small>{object.hint}</small></span><ArrowUpRight size={15} /></button>)}<button className="dock-overview" type="button" onClick={handleClear} disabled={!selected} aria-label="Return to workstation overview"><RotateCcw size={16} /><span>Overview</span></button></div>
      </section>
      <PortfolioSections reducedMotion={!!reducedMotion} />
    </main>
    <Suspense fallback={null}><AnimatePresence>{mode === 'desktop' && <DesktopEnvironment />}</AnimatePresence></Suspense>
  </div>
}
