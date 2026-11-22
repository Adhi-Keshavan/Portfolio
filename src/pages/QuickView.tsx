import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Download, Github, Mail } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { PortfolioSections } from '../components/workspace/PortfolioSections'
import { person, projects, skillGroups } from '../data/portfolio'
import { useWorkspaceStore } from '../store/workspaceStore'
import './QuickView.css'

export default function QuickView() {
  const theme = useWorkspaceStore(state => state.theme)
  const reducedMotion = useWorkspaceStore(state => state.reducedMotion)
  const { hash } = useLocation()
  useEffect(() => { document.title = `Quick View — ${person.name} | DESK.OS` }, [])
  return <div className="workspace-site quick-view-page" data-theme={theme}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation active={hash.slice(1)} />
    <main id="main">
      <section id="home" className="quick-view-hero" aria-labelledby="quick-view-title">
        <div className="quick-view-topline"><span>DESK.OS / RECRUITER VIEW</span><Link to="/"><ArrowLeft size={16} /> Back to workspace</Link></div>
        <div className="quick-view-intro"><div><span className="eyebrow">SOFTWARE DEVELOPMENT · BACKEND ENGINEERING</span><h1 id="quick-view-title">Adhi Keshavan B<span>.</span></h1><p>Final-year Computer Science and Business Systems student building useful software, reliable backend systems, thoughtful interfaces, and data-led solutions.</p><div className="quick-view-actions"><a href={person.resume || `mailto:${person.email}?subject=Resume%20request`}{...(person.resume ? { download: true } : {})}><Download size={17} /> {person.resume ? 'Download résumé' : 'Request résumé'}</a><a href={`mailto:${person.email}`}><Mail size={17} /> Email me</a><a href={person.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a></div></div><div className="quick-view-facts"><div><span>EDUCATION</span><strong>{person.education}</strong><small>{person.college} · {person.years}</small></div><div><span>CORE TOOLSET</span><strong>{skillGroups[0].items.join(' · ')}</strong><small>React · FastAPI · SQL · Pandas</small></div><div><span>OPEN TO</span><strong>Internships & entry-level roles</strong><small>Software · Backend · Full Stack · Data Analytics</small></div></div></div>
        <div className="quick-view-projects"><span className="eyebrow">FEATURED WORK</span><div>{projects.map(project => <Link key={project.slug} to={`/projects/${project.slug}`}><span>{project.number}</span><strong>{project.title}</strong><small>{project.eyebrow}</small></Link>)}</div></div>
      </section>
      <PortfolioSections reducedMotion={reducedMotion} />
    </main>
  </div>
}
