import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Download, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Navigation } from '../components/layout/Navigation'
import { StaticWorkspace } from '../components/workspace/StaticWorkspace'
import { WorkspacePanel } from '../components/workspace/WorkspacePanel'
import { PortfolioSections } from '../components/workspace/PortfolioSections'
import { useWorkspaceSelection, type WorkspaceObject } from '../hooks/useWorkspaceSelection'
import { person, workspaceObjects } from '../data/portfolio'

const WorkspaceExperience = lazy(() => import('../components/canvas/WorkspaceExperience'))

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

function WorkspaceStage({ selected, onSelect }: { selected: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void }) {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const reducedMotion = useReducedMotion() ?? false
  useEffect(() => {
    if (!canUseWebGL()) return
    const id = window.setTimeout(() => setEnabled(true), 280)
    return () => clearTimeout(id)
  }, [])
  return <div className={`workspace-stage${ready ? ' workspace-stage--ready' : ''}`}>
    <StaticWorkspace onSelect={onSelect} />
    {enabled && <SceneBoundary onFailure={() => { setEnabled(false); setReady(false) }}><Suspense fallback={null}><WorkspaceExperience selected={selected} onSelect={onSelect} onReady={() => setReady(true)} reducedMotion={reducedMotion} /></Suspense></SceneBoundary>}
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
  const [active, setActive] = useState('home')
  const progress = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    document.title = 'Inside My Workspace — Adhi Keshavan B'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = 'Explore the interactive developer workstation of Adhi Keshavan B, a final-year CSBS student building software, backend systems, and data analytics projects.'
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
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    if (window.location.hash) window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 60)
    return () => { observer.disconnect(); window.removeEventListener('scroll', update) }
  }, [])

  return <div className="workspace-site">
    <div className="scroll-progress" ref={progress} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation active={active} />
    <main id="main">
      <section id="home" className={`workspace-hero${selected ? ' workspace-hero--focused' : ''}`} aria-labelledby="hero-title">
        <div className="hero-studio-grid" aria-hidden="true" />
        <div className="hero-introduction">
          <span className="eyebrow"><span className="eyebrow-stroke" /> PORTFOLIO / 2026 <span className="eyebrow-separator">·</span> AVAILABLE FOR OPPORTUNITIES</span>
          <motion.h1 id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>Inside My<br /><em>Workspace<span>.</span></em></motion.h1>
          <p className="hero-intro-line">Hi, I'm <strong>{person.shortName}.</strong></p>
          <p className="hero-description">Final-year CSBS student building useful software, thoughtful interfaces, reliable backend systems, and data-led solutions.</p>
          <div className="hero-availability"><span className="live-dot" /> OPEN TO INTERNSHIPS & ENTRY-LEVEL ROLES</div>
          <div className="hero-actions"><button type="button" className="button button-primary" onClick={() => select('monitor')}>Explore my work <ArrowUpRight size={17} /></button><ResumeAction className="button button-secondary" /></div>
          <div className="hero-side-note"><div className="hero-side-note-copy"><span>THE DESK IS THE NAVIGATION.</span><span>EVERY OBJECT OPENS A PART OF MY WORK.</span></div><a className="hero-scroll" href="#about">SCROLL TO EXPLORE <ArrowDown size={15} /></a></div>
        </div>
        <WorkspaceStage selected={selected} onSelect={select} />
        <p className="sr-only">Select the monitor for projects, keyboard for skills, notebook for about and education, or phone for contact. All information is also available in the sections below.</p>
        <WorkspacePanel selected={selected} onClose={clear} />
        <div className="object-dock" aria-label="Explore workspace objects">{workspaceObjects.map(object => <button key={object.id} type="button" className={selected === object.id ? 'object-dock-item active' : 'object-dock-item'} onClick={() => select(object.id)} aria-pressed={selected === object.id}><span className="dock-number">{object.number}</span><span><strong>{object.title}</strong><small>{object.hint}</small></span><ArrowUpRight size={15} /></button>)}<button className="dock-overview" type="button" onClick={clear} disabled={!selected} aria-label="Return to workstation overview"><RotateCcw size={16} /><span>Overview</span></button></div>
      </section>
      <PortfolioSections reducedMotion={!!reducedMotion} />
    </main>
  </div>
}
