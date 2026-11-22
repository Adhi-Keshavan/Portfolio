import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Github, Images, X } from 'lucide-react'
import { projects } from '../../data/portfolio'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { ProjectPreview } from '../projects/ProjectPreview'

export function ProjectExplorer() {
  const projectSlug = useWorkspaceStore(state => state.projectSlug)
  const openProject = useWorkspaceStore(state => state.openProject)
  const [showImage, setShowImage] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const project = projects.find(item => item.slug === projectSlug) ?? projects[0]
  const images = project.screenshots ?? (project.screenshot ? [{ src: project.screenshot, alt: project.screenshotAlt || `${project.title} screenshot` }] : [])
  useEffect(() => {
    if (!showImage) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowImage(false)
      if (event.key === 'ArrowLeft') setImageIndex(index => (index - 1 + images.length) % images.length)
      if (event.key === 'ArrowRight') setImageIndex(index => (index + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showImage, images.length])
  return <div className="explorer-layout">
    <nav className="explorer-sidebar" aria-label="Project list"><span className="desktop-eyebrow">PROJECTS / {projects.length}</span>{projects.map(item => <button key={item.slug} type="button" className={item.slug === project.slug ? 'explorer-project is-active' : 'explorer-project'} onClick={() => { openProject(item.slug); setShowImage(false); setImageIndex(0) }}><span>{item.number}</span><strong>{item.title}</strong><small>{item.eyebrow}</small></button>)}</nav>
    <article className="explorer-detail"><div className="desktop-eyebrow">SELECTED WORK / {project.number}</div><h2>{project.title}</h2><p className="explorer-lead">{project.summary}</p><div className="explorer-preview"><ProjectPreview project={project} /></div>{images.length > 0 && <button type="button" className="desktop-text-button" onClick={() => { setImageIndex(0); setShowImage(true) }}><Images size={17} /> View {images.length > 1 ? 'screenshots' : 'screenshot'}</button>}
      <div className="explorer-facts"><div><span>THE PROBLEM</span><p>{project.problem}</p></div><div><span>THE APPROACH</span><p>{project.approach}</p></div><div><span>MY CONTRIBUTION</span><p>{project.contribution}</p></div><div><span>RESULT</span><p>{project.result}</p></div></div>
      <div className="explorer-architecture"><span className="desktop-eyebrow">ARCHITECTURE</span><ul>{project.architecture.map(point => <li key={point}>{point}</li>)}</ul></div><div className="explorer-facts explorer-facts--secondary"><div><span>DEVELOPMENT PROCESS</span><p>{project.process}</p></div><div><span>ENGINEERING CHALLENGE</span><p>{project.challenges}</p></div><div><span>TECHNICAL TAKEAWAY</span><p>{project.learning}</p></div></div><div className="desktop-tech-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
      <div className="desktop-link-row"><a href={`/projects/${project.slug}`}>Read case study <ExternalLink size={16} /></a><a href={project.repository} target="_blank" rel="noreferrer"><Github size={16} /> GitHub source</a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={16} /></a>}</div>
    </article>
    {showImage && images.length > 0 && <div className="screenshot-lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} screenshots`} onClick={() => setShowImage(false)}><button className="gallery-close" type="button" onClick={() => setShowImage(false)} aria-label="Close screenshot"><X size={18} /></button><img src={images[imageIndex].src} alt={images[imageIndex].alt} onClick={event => event.stopPropagation()} />{images.length > 1 && <div className="gallery-controls" onClick={event => event.stopPropagation()}><button type="button" onClick={() => setImageIndex(index => (index - 1 + images.length) % images.length)} aria-label="Previous screenshot"><ChevronLeft size={19} /></button><span>{imageIndex + 1} / {images.length}</span><button type="button" onClick={() => setImageIndex(index => (index + 1) % images.length)} aria-label="Next screenshot"><ChevronRight size={19} /></button></div>}</div>}
  </div>
}
