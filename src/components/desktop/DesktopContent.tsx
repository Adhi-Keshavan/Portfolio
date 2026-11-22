import { Download, Github, Linkedin, Mail } from 'lucide-react'
import { person, skillGroups } from '../../data/portfolio'

export function AboutApp() {
  return <div className="desktop-document"><span className="desktop-eyebrow">ABOUT / ADHI KESHAVAN B</span><h2>Building systems that make sense to people.</h2><p>I'm a B.Tech Computer Science and Business Systems student at Saranathan College of Engineering in Trichy. My work moves between interactive interfaces, backend APIs, and data analysis.</p><div className="desktop-document-grid"><div><span>EDUCATION</span><strong>{person.education}</strong><p>{person.college}<br />{person.years}</p></div><div><span>TECHNICAL INTERESTS</span><strong>Software and backend engineering</strong><p>Also exploring full stack product development and evidence-led data analytics.</p></div><div><span>DEVELOPMENT JOURNEY</span><strong>Learning through actual projects</strong><p>From a Three.js project cover page to a KYC readiness prototype and a reproducible cricket data pipeline, I use each project to learn a different engineering discipline.</p></div><div><span>DOCUMENTED INTERNSHIPS</span><strong>NoviTech R&D Private Limited</strong><p>2025 certificates in Data Analytics, Artificial Intelligence, and Machine Learning.</p></div></div></div>
}

export function SkillsApp() {
  return <div className="desktop-document"><span className="desktop-eyebrow">SKILLS / VERIFIED TOOLSET</span><h2>Tools with a purpose.</h2><p>Languages, libraries, and methods represented in coursework and published project sources.</p><div className="desktop-skills-grid">{skillGroups.map(group => <section key={group.name}><h3>{group.name}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div></div>
}

export function ContactApp() {
  return <div className="desktop-document desktop-contact"><span className="desktop-eyebrow">CONTACT / OPEN TO OPPORTUNITIES</span><h2>Let's make something useful.</h2><p>I'm open to software development, backend, full stack, and data analytics internships or entry-level roles.</p><a className="desktop-contact-email" href={`mailto:${person.email}`}>{person.email}</a><div className="desktop-contact-links"><a href={person.github} target="_blank" rel="noreferrer"><Github size={20} /> GitHub</a><a href={person.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /> LinkedIn</a><a href={`mailto:${person.email}`}><Mail size={20} /> Email</a><a href={person.resume || `mailto:${person.email}?subject=Resume%20request`}{...(person.resume ? { download: true } : {})}><Download size={20} /> {person.resume ? 'Download résumé' : 'Request résumé'}</a></div><small>{person.location}</small></div>
}
