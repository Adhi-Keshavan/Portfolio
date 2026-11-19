import { Download, ExternalLink } from 'lucide-react'
import { person } from '../../data/portfolio'

export function ResumeViewer() {
  return <div className="resume-viewer">
    <div className="resume-toolbar"><div><span className="desktop-eyebrow">DOCUMENT / RÉSUMÉ</span><strong>{person.name}</strong></div><div className="resume-actions">{person.resume && <><a href={person.resume} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Open PDF</a><a href={person.resume} download="Adhi-Keshavan-Resume.pdf"><Download size={16} /> Download</a></>}</div></div>
    {person.resume ? <iframe title={`${person.name} résumé PDF`} src={`${person.resume}#toolbar=0`} /> : <div className="resume-empty"><p>The résumé is being updated.</p><a href={`mailto:${person.email}?subject=Resume%20request`}>Request a copy by email</a></div>}
  </div>
}
