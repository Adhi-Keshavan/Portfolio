import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Download, MoveUpRight, X, Layers3, Database, BarChart3, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { person, projects, skillGroups } from '../data/portfolio'
import { sceneState } from '../components/canvas/sceneState'
import { ProjectPreview } from '../components/projects/ProjectPreview'
import { Navigation } from '../components/layout/Navigation'

const Experience = lazy(() => import('../components/canvas/Experience'))
gsap.registerPlugin(ScrollTrigger)

const disciplines = [
  { icon: Layers3, title: 'Software Development', text: 'Interfaces and applications shaped around the problem they need to solve.' },
  { icon: Database, title: 'Backend Engineering', text: 'APIs, data flow, validation, and clear boundaries between systems.' },
  { icon: BarChart3, title: 'Data Analytics', text: 'Evidence-led analysis that makes uncertainty visible instead of hiding it.' },
]

function canUseScene() {
  if (window.matchMedia('(max-width: 800px), (prefers-reduced-motion: reduce)').matches) return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return false
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}

function SceneLayer() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    if (!canUseScene()) return
    const start = () => setEnabled(true)
    const id = window.setTimeout(start, 350)
    return () => clearTimeout(id)
  }, [])
  return <div className="scene-layer" aria-hidden="true">{enabled && <Suspense fallback={null}><Experience /></Suspense>}</div>
}

function NexusFallback() {
  return <div className="nexus-fallback" aria-hidden="true"><span className="fallback-ring fallback-ring--one" /><span className="fallback-ring fallback-ring--two" /><span className="fallback-ring fallback-ring--three" /><span className="fallback-core" /></div>
}

function ResumeLink({ className = '', children }: { className?: string; children?: ReactNode }) {
  return <a className={className} href={person.resume || `mailto:${person.email}?subject=Resume%20request`}{...(person.resume ? { download: true } : {})}>{children || (person.resume ? 'Download résumé' : 'Request résumé')} {person.resume ? <Download size={16} /> : <ArrowUpRight size={16} />}</a>
}

function ProjectGallery({ selectedSlug, onSelect }: { selectedSlug: string | null; onSelect: (slug: string | null) => void }) {
  const selected = projects.find(project => project.slug === selectedSlug)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!selected) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSelect(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, onSelect])
  const handleArrow = (event: ReactKeyboardEvent, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    refs.current[(index + (event.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length]?.focus()
  }
  return <>
    <div className="gallery-grid">
      {projects.map((project, index) => <motion.article key={project.slug} className={`project-card ${selectedSlug === project.slug ? 'project-card--selected' : ''}`} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: index * 0.08 }} style={{ '--project-accent': project.accent } as CSSProperties}>
        <button ref={element => { refs.current[index] = element }} type="button" className="project-card-hit" onClick={() => onSelect(project.slug)} onKeyDown={event => handleArrow(event, index)} aria-label={`Select ${project.title}`} aria-pressed={selectedSlug === project.slug}>
          <span className="project-card-top"><span>PROJECT / {project.number}</span><span><MoveUpRight size={18} /></span></span>
          <ProjectPreview project={project} />
          <span className="project-card-content"><small>{project.eyebrow}</small><strong>{project.title}</strong><span>{project.summary}</span><span className="project-tags">{project.stack.slice(0, 3).map(tech => <em key={tech}>{tech}</em>)}</span></span>
        </button>
      </motion.article>)}
    </div>
    {selected && <motion.div className="project-focus" id="project-focus" tabIndex={-1} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} role="region" aria-label={`${selected.title} project details`}>
      <div className="project-focus-head"><span className="eyebrow">SELECTED / {selected.number}</span><button type="button" onClick={() => onSelect(null)} aria-label="Close project details"><X size={18} /></button></div>
      <div className="project-focus-grid"><div><h3>{selected.title}</h3><p>{selected.problem}</p></div><div><span className="mini-label">MY CONTRIBUTION</span><p>{selected.contribution}</p><div className="focus-links"><a href={`/projects/${selected.slug}`}>Read case study <ArrowUpRight size={16} /></a><a href={selected.repository} target="_blank" rel="noreferrer">Repository <ExternalLink size={15} /></a>{selected.demo && <a href={selected.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={15} /></a>}</div></div></div>
    </motion.div>}
  </>
}

export default function Home({ locationKey, navigate }: { locationKey: string; navigate: (url: string, scroll?: boolean) => void }) {
  const [active, setActive] = useState('home')
  const [category, setCategory] = useState(0)
  const [insight, setInsight] = useState(false)
  const [dragging, setDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const lastPointer = useRef({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  const selectedSlug = useMemo(() => new URLSearchParams(locationKey.split('?')[1] || '').get('project'), [locationKey])

  useEffect(() => {
    document.title = 'Adhi Keshavan B — Software Developer'
    const sections = ['home', 'about', 'skills', 'projects', 'journey', 'contact']
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.5] })
    sections.forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element) })
    const trigger = ScrollTrigger.create({ trigger: '#home', start: 'top top', endTrigger: '#contact', end: 'bottom bottom', onUpdate: self => { sceneState.progress = self.progress; if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})` } })
    ScrollTrigger.refresh()
    return () => { observer.disconnect(); trigger.kill(); sceneState.progress = 0 }
  }, [])

  useEffect(() => {
    if (window.location.hash && !window.location.search) {
      const id = window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 40)
      return () => clearTimeout(id)
    }
  }, [])

  const selectProject = (slug: string | null) => {
    navigate(slug ? `/?project=${slug}#projects` : '/#projects', false)
    if (slug) requestAnimationFrame(() => { const panel = document.getElementById('project-focus'); panel?.focus({ preventScroll: true }); panel?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'nearest' }) })
  }

  const magneticMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduced) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.09
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.09
    event.currentTarget.style.transform = `translate(${x}px, ${y}px)`
  }

  return <div className="site-shell" id="page-shell">
    <SceneLayer />
    <div className="ambient-grid" aria-hidden="true" />
    <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation active={active} />
    <main id="main">
      <section className="hero section-wrap" id="home" aria-labelledby="hero-title">
        <div className="hero-background-word" aria-hidden="true">NEXUS</div>
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> PORTFOLIO / 2026 <span className="eyebrow-cross">✦</span> SOFTWARE ENGINEERING</div>
          <p className="hero-intro">Hi, I'm <span>Adhi Keshavan.</span></p>
          <motion.h1 id="hero-title" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>I build systems<br />that <em>solve problems.</em></motion.h1>
          <p className="hero-description">Final-year CSBS student exploring software development, backend engineering, and data analytics through real projects.</p>
          <div className="hero-availability"><span className="status-dot" /> OPEN TO INTERNSHIPS & ENTRY-LEVEL ROLES</div>
          <div className="hero-actions"><a className="button button-primary" href="#projects" onPointerMove={magneticMove} onPointerLeave={event => { event.currentTarget.style.transform = '' }}>Explore my work <ArrowUpRight size={17} /></a><ResumeLink className="button button-quiet" /></div>
          <div className="hero-socials"><a href={person.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a><a href={person.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a><a href={`mailto:${person.email}`}><Mail size={16} /> Email</a></div>
        </div>
        <div className="hero-visual">
          <NexusFallback />
          <div className="nexus-target" role="button" tabIndex={0} aria-label="Drag to rotate the engineering nexus, or use arrow keys; press Enter for an insight" onPointerDown={event => { setDragging(true); lastPointer.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) }} onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); sceneState.pointerX = (event.clientX - rect.left) / rect.width * 2 - 1; sceneState.pointerY = (event.clientY - rect.top) / rect.height * 2 - 1; if (dragging) { sceneState.dragX = Math.max(-0.7, Math.min(0.7, sceneState.dragX + (event.clientX - lastPointer.current.x) * 0.005)); sceneState.dragY = Math.max(-0.45, Math.min(0.45, sceneState.dragY + (event.clientY - lastPointer.current.y) * 0.005)); lastPointer.current = { x: event.clientX, y: event.clientY } } }} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} onPointerLeave={() => { sceneState.pointerX = 0; sceneState.pointerY = 0 }} onKeyDown={event => { if (event.key.startsWith('Arrow')) event.preventDefault(); if (event.key === 'ArrowLeft') sceneState.dragX = Math.max(-0.7, sceneState.dragX - 0.1); if (event.key === 'ArrowRight') sceneState.dragX = Math.min(0.7, sceneState.dragX + 0.1); if (event.key === 'ArrowUp') sceneState.dragY = Math.max(-0.45, sceneState.dragY - 0.1); if (event.key === 'ArrowDown') sceneState.dragY = Math.min(0.45, sceneState.dragY + 0.1); if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setInsight(value => !value) } }} />
          <div className="visual-caption"><span className="visual-caption-dot" /> THE ENGINEERING NEXUS <small>01 / INTERCONNECTED SYSTEMS</small></div>
          <button className="nexus-hotspot" type="button" onPointerEnter={() => { sceneState.hotspot = true }} onPointerLeave={() => { sceneState.hotspot = false }} onFocus={() => { sceneState.hotspot = true }} onBlur={() => { sceneState.hotspot = false }} onClick={() => setInsight(!insight)} aria-expanded={insight} aria-controls="nexus-insight"><span>+</span><small>CORE INSIGHT</small></button>
          {insight && <div id="nexus-insight" className="nexus-insight"><strong>Architecture is a set of decisions.</strong><p>Each layer has a purpose: a reliable core, clear connections, and room to evolve.</p></div>}
          <div className="drag-hint"><span>↔</span> DRAG TO EXPLORE</div>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
        <div className="hero-index">01 <span>/</span> 06</div>
      </section>

      <section className="about-section section-wrap content-section" id="about" aria-labelledby="about-title">
        <div className="section-rail"><span>02 / INSIDE THE ENGINEER'S MIND</span><i /></div>
        <div className="about-layout"><div className="section-heading"><span className="eyebrow">THE PERSON BEHIND THE SYSTEMS</span><h2 id="about-title">Curiosity.<br /><em>Logic.</em> Execution.</h2></div><div className="about-narrative"><p>I'm a B.Tech Computer Science and Business Systems student at Saranathan College of Engineering. I like tracing a problem from the human need through the data and API boundaries to the final interface.</p><p>My work spans an immersive 3D final-year project, a merchant readiness prototype, and a cricket analytics pipeline. Each taught me a different part of engineering: explain clearly, build carefully, and make the limits of a system visible.</p><div className="about-signature">ADHI KESHAVAN B <span>→</span> TRICHY, INDIA</div></div></div>
        <div className="discipline-grid">{disciplines.map(({ icon: Icon, title, text }, index) => <motion.div key={title} className="discipline-card" whileHover={reduced ? undefined : { y: -6 }} whileFocus={reduced ? undefined : { y: -6 }} tabIndex={0}><span className="discipline-number">0{index + 1} / FOCUS</span><Icon size={29} strokeWidth={1.3} /><h3>{title}</h3><p>{text}</p><ArrowUpRight className="discipline-arrow" size={18} /></motion.div>)}</div>
      </section>

      <section className="skills-section section-wrap content-section" id="skills" aria-labelledby="skills-title">
        <div className="section-rail"><span>03 / TECHNICAL CONSTELLATION</span><i /></div>
        <div className="skills-layout"><div className="section-heading"><span className="eyebrow">THE TOOLS I WORK WITH</span><h2 id="skills-title">Built on<br /><em>fundamentals.</em></h2><p>A practical toolkit drawn from coursework and the projects below. Select a category to explore the stack.</p></div><div className="skills-console"><div className="console-top"><span><i /> SKILL MATRIX</span><span>07 CATEGORIES</span></div><div className="constellation-map" aria-label="Interactive technology constellation"><svg viewBox="0 0 500 130" preserveAspectRatio="none" aria-hidden="true"><path d="M45 60 L112 21 L178 82 L251 45 L326 94 L400 29 L465 69 M112 21 L251 45 M178 82 L326 94 M251 45 L400 29" /></svg>{skillGroups.map((group, index) => <button key={group.name} type="button" className={`constellation-node constellation-node--${index}${category === index ? ' active' : ''}`} aria-label={`Show ${group.name} skills`} onMouseEnter={() => { setCategory(index); sceneState.category = index }} onFocus={() => { setCategory(index); sceneState.category = index }} onClick={() => { setCategory(index); sceneState.category = index }}><span>0{index + 1}</span></button>)}</div><div className="skill-category-list" role="tablist" aria-label="Skill categories">{skillGroups.map((group, index) => <button key={group.name} type="button" role="tab" id={`skill-tab-${index}`} aria-selected={category === index} aria-controls="skills-panel" className={category === index ? 'skill-category active' : 'skill-category'} onClick={() => { setCategory(index); sceneState.category = index }}><span>0{index + 1}</span>{group.name}<ArrowUpRight size={15} /></button>)}</div><div className="skill-results" role="tabpanel" id="skills-panel" aria-labelledby={`skill-tab-${category}`}><div className="skill-results-head"><span>ACTIVE CATEGORY</span><strong>{skillGroups[category].name}</strong></div><div className="skill-pills">{skillGroups[category].items.map(item => <span key={item}>{item}</span>)}</div></div></div></div>
        <div className="all-skills" aria-label="All technical skills">{skillGroups.map(group => <div key={group.name}><h3>{group.name}</h3><p>{group.items.join(' · ')}</p></div>)}</div>
      </section>

      <section className="projects-section section-wrap content-section" id="projects" aria-labelledby="projects-title">
        <div className="section-rail"><span>04 / SELECTED WORK</span><i /></div>
        <div className="projects-heading"><div><span className="eyebrow">A CLOSER LOOK AT THE WORK</span><h2 id="projects-title">Things I've <em>built.</em></h2></div><p>Three different problems. Three different systems. Explore the decisions behind each one.</p></div>
        <ProjectGallery selectedSlug={selectedSlug} onSelect={selectProject} />
        <div className="project-footer-note"><span>←</span> SELECT A PROJECT TO SEE THE PROBLEM, CONTRIBUTION, AND CASE STUDY <span>→</span></div>
      </section>

      <section className="journey-section section-wrap content-section" id="journey" aria-labelledby="journey-title"><div className="section-rail"><span>05 / THE JOURNEY</span><i /></div><div className="journey-layout"><div className="section-heading"><span className="eyebrow">EXPERIENCE & EDUCATION</span><h2 id="journey-title">Always<br /><em>in progress.</em></h2><p>Academic foundations, hands-on learning, and work that turns ideas into evidence.</p></div><div className="timeline"><div className="timeline-item"><span>2023 — 2027</span><div><small>EDUCATION</small><h3>B.Tech · Computer Science and Business Systems</h3><p>Saranathan College of Engineering</p></div></div><div className="timeline-item"><span>2026</span><div><small>FINAL-YEAR PROJECT</small><h3>Aitizen Realm</h3><p>Team project exploring autonomous agents and human–AI interaction. My documented focus is 3D modeling, Blender assets, and shaders.</p></div></div><div className="timeline-item"><span>2025</span><div><small>INTERNSHIP CERTIFICATES</small><h3>NoviTech R&D Private Limited</h3><p>One-month internship certificates in Data Analytics, Artificial Intelligence, and Machine Learning, dated June 18–July 18, 2025.</p></div></div></div></div></section>

      <section className="contact-section section-wrap content-section" id="contact" aria-labelledby="contact-title"><div className="section-rail"><span>06 / LET'S CONNECT</span><i /></div><div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div><div className="contact-content"><span className="eyebrow"><span className="status-dot" /> OPEN TO INTERNSHIPS & ENTRY-LEVEL ROLES</span><h2 id="contact-title">Let's build something<br /><em>meaningful.</em></h2><p>Open to software development, backend engineering, data analytics, and collaborations with a clear purpose.</p><a className="contact-email" href={`mailto:${person.email}`}>{person.email} <ArrowUpRight size={24} /></a><div className="contact-actions"><a href={person.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a><a href={person.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} /></a><ResumeLink /></div></div><footer className="footer"><span>© {new Date().getFullYear()} ADHI KESHAVAN B</span><span>DESIGNED TO BE EXPLORED · BUILT TO BE USEFUL</span><a href="#home">BACK TO TOP ↑</a></footer></section>
    </main>
  </div>
}
