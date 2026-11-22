import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { ProjectPreview } from '../components/projects/ProjectPreview'
import { person, type Project } from '../data/portfolio'
import './ProjectDetail.css'

export default function ProjectDetail({ project }: { project: Project }) {
  useEffect(() => {
    document.title = `${project.title} — Case Study | Adhi Keshavan B`
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previous = description?.content
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    const previousOgTitle = ogTitle?.content
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    const previousOgDescription = ogDescription?.content
    if (description) description.content = project.summary
    if (ogTitle) ogTitle.content = `${project.title} — Adhi Keshavan B`
    if (ogDescription) ogDescription.content = project.summary
    return () => {
      if (description && previous) description.content = previous
      if (ogTitle && previousOgTitle) ogTitle.content = previousOgTitle
      if (ogDescription && previousOgDescription) ogDescription.content = previousOgDescription
    }
  }, [project])

  return <div className="detail-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation detail />
    <main id="main" className="detail-main">
      <div className="detail-topline"><Link to="/quick-view#projects"><ArrowLeft size={17} /> All projects</Link><span>CASE STUDY / {project.number}</span></div>
      <header className="detail-hero"><div><span className="eyebrow">{project.eyebrow}</span><h1>{project.title}<span>.</span></h1><p>{project.summary}</p><div className="detail-links"><a href={project.repository} target="_blank" rel="noreferrer"><Github size={17} /> View repository <ExternalLink size={15} /></a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={17} /></a>}</div></div><span className="detail-count">{project.number} / 03</span></header>
      <div className="detail-preview"><ProjectPreview project={project} large /></div>
      <p className="detail-image-note">{project.screenshot ? 'Project screenshot from the implemented experience.' : 'Visual interpretation of the documented project. A source screenshot is not yet available.'}</p>
      <div className="detail-content"><aside><span>ON THIS PAGE</span><a href="#problem">01 / Problem</a><a href="#solution">02 / Approach</a><a href="#architecture">03 / Architecture</a><a href="#process">04 / Process</a><a href="#outcome">05 / Outcome</a></aside><div className="detail-article"><section id="problem"><span className="detail-section-number">01 / CONTEXT</span><h2>The problem</h2><p>{project.problem}</p></section><section id="solution"><span className="detail-section-number">02 / STRATEGY</span><h2>The approach</h2><p>{project.approach}</p><div className="detail-callout"><small>MY CONTRIBUTION</small><p>{project.contribution}</p></div></section><section id="architecture"><span className="detail-section-number">03 / SYSTEM DESIGN</span><h2>Architecture</h2><ul>{project.architecture.map(item => <li key={item}>{item}</li>)}</ul><div className="detail-stack"><small>TECHNOLOGY STACK</small><div>{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div></div></section><section id="process"><span className="detail-section-number">04 / BUILDING IT</span><h2>Process & engineering challenges</h2><p>{project.process}</p><h3>What required care</h3><p>{project.challenges}</p></section><section id="outcome"><span className="detail-section-number">05 / REFLECTION</span><h2>Results & learning</h2><p>{project.result}</p><h3>Technical takeaway</h3><p>{project.learning}</p><p className="detail-honesty">The case study is based on the linked source repository and project documentation. Unpublished metrics and outcomes are intentionally left out.</p></section></div></div>
      <div className="detail-next"><span>KEEP EXPLORING</span><Link to="/quick-view#projects">Back to selected work <ArrowUpRight size={20} /></Link></div>
    </main>
    <footer className="detail-footer"><span>ADHI KESHAVAN B / SOFTWARE ENGINEERING</span><a href={`mailto:${person.email}`}>START A CONVERSATION <ArrowUpRight size={15} /></a></footer>
  </div>
}
