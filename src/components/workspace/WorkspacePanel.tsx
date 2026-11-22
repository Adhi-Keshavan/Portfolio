import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Download, ExternalLink, Github, Linkedin, Mail, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { person, projects, skillGroups } from '../../data/portfolio'
import type { WorkspaceObject } from '../../hooks/useWorkspaceSelection'
import { ProjectPreview } from '../projects/ProjectPreview'

const titles: Record<WorkspaceObject, string> = { monitor: 'Project explorer', keyboard: 'Technical skills', notebook: 'About & education', phone: 'Contact' }
const codes: Record<WorkspaceObject, string> = { monitor: '01 / MONITOR', keyboard: '02 / KEYBOARD', notebook: '03 / NOTEBOOK', phone: '04 / SMARTPHONE' }

export function WorkspacePanel({ selected, onClose }: { selected: WorkspaceObject | null; onClose: () => void }) {
  const [projectIndex, setProjectIndex] = useState(0)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!selected) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, onClose])
  if (!selected) return null
  const project = projects[projectIndex]
  return <motion.aside key={selected} className="workspace-panel" role="dialog" aria-modal="false" aria-labelledby="workspace-panel-title" initial={reduced ? false : { opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0, x: -28 }} transition={{ duration: .35 }}>
    <div className="panel-top"><span>{codes[selected]}</span><button ref={closeRef} type="button" onClick={onClose} aria-label="Return to workspace overview"><X size={18} /></button></div>
    <div className="panel-scroll"><div className="panel-heading"><span className="panel-kicker">THE LIVING WORKSPACE</span><h2 id="workspace-panel-title">{titles[selected]}<span>.</span></h2></div>
      {selected === 'monitor' && <div className="panel-projects"><p>Built projects, honest constraints, and the decisions behind them.</p><div className="panel-project-tabs" role="tablist" aria-label="Projects">{projects.map((item, index) => <button key={item.slug} type="button" role="tab" id={`panel-project-tab-${index}`} aria-controls="panel-project-content" aria-selected={projectIndex === index} onClick={() => setProjectIndex(index)}><span>{item.number}</span>{item.title}</button>)}</div><div className="panel-project-detail" role="tabpanel" id="panel-project-content" aria-labelledby={`panel-project-tab-${projectIndex}`}><ProjectPreview project={project} /><span className="panel-meta">{project.eyebrow}</span><h3>{project.title}</h3><p>{project.summary}</p><div className="panel-tech">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><div className="panel-links"><a href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={16} /></a><a href={project.repository} target="_blank" rel="noreferrer">Source code <ExternalLink size={15} /></a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={15} /></a>}</div></div></div>}
      {selected === 'keyboard' && <div className="panel-skills"><p>A practical stack evidenced by coursework and the work in this portfolio.</p><div className="panel-skill-tabs" role="tablist" aria-label="Skill categories">{skillGroups.map((group, index) => <button key={group.name} type="button" role="tab" id={`panel-skill-tab-${index}`} aria-controls="panel-skill-content" aria-selected={categoryIndex === index} onClick={() => setCategoryIndex(index)}>{group.name}</button>)}</div><div className="panel-skill-detail" role="tabpanel" id="panel-skill-content" aria-labelledby={`panel-skill-tab-${categoryIndex}`}><span>ACTIVE TOOLSET / 0{categoryIndex + 1}</span><h3>{skillGroups[categoryIndex].name}</h3><ul>{skillGroups[categoryIndex].items.map(item => <li key={item}>{item}</li>)}</ul></div><p className="panel-small">Every category is also listed in the Skills section below.</p></div>}
      {selected === 'notebook' && <div className="panel-about"><p className="panel-lead">I study how software, data, and business needs meet in real systems.</p><p>I'm a B.Tech Computer Science and Business Systems student at Saranathan College of Engineering in Trichy. My projects move between immersive frontends, backend APIs, and data analysis.</p><div className="panel-fact"><span>EDUCATION</span><strong>{person.education}</strong><small>{person.college} · {person.years}</small></div><div className="panel-fact"><span>RECENT WORK</span><strong>Three different engineering lenses</strong><small>Aitizen Realm · PayReady India · Pressure Performance</small></div><div className="panel-fact"><span>DOCUMENTED INTERNSHIPS</span><strong>NoviTech R&D Private Limited</strong><small>Data Analytics, Artificial Intelligence, and Machine Learning certificates · 2025</small></div><a className="panel-text-link" href="#about" onClick={onClose}>Read the full story <ArrowUpRight size={16} /></a></div>}
      {selected === 'phone' && <div className="panel-contact"><p className="panel-lead">Open to internships, entry-level roles, and purposeful collaborations.</p><a className="panel-email" href={`mailto:${person.email}`}>{person.email}<ArrowUpRight size={18} /></a><div className="panel-contact-links"><a href={person.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub <ArrowUpRight size={15} /></a><a href={person.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn <ArrowUpRight size={15} /></a><a href={`mailto:${person.email}`}><Mail size={18} /> Email <ArrowUpRight size={15} /></a><a href={person.resume || `mailto:${person.email}?subject=Resume%20request`}{...(person.resume ? { download: true } : {})}><Download size={18} /> {person.resume ? 'Download résumé' : 'Request résumé'} <ArrowUpRight size={15} /></a></div><p className="panel-small">{person.location} · Available for software development, backend, full stack, and data analytics opportunities.</p></div>}
    </div>
    <div className="panel-footer"><span>SELECT AN OBJECT TO EXPLORE</span><button type="button" onClick={onClose}>OVERVIEW ↗</button></div>
  </motion.aside>
}
