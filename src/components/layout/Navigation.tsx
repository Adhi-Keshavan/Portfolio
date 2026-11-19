import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { person } from '../../data/portfolio'

const items = [['About', 'about'], ['Projects', 'projects'], ['Skills', 'skills'], ['Contact', 'contact']] as const

export function Navigation({ active = '', detail = false }: { active?: string; detail?: boolean }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <Link className="brand" to="/" aria-label="DESK.OS, home"><span className="brand-symbol">A<span>K</span><i>.</i></span><span className="brand-name">DESK<b>.OS</b></span></Link>
    <nav className={open ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Primary navigation">
      {items.map(([label, id]) => <Link key={id} to={`/quick-view#${id}`} className={!detail && active === id ? 'nav-link nav-link--active' : 'nav-link'} onClick={() => setOpen(false)}>{label}</Link>)}
      <a className="nav-resume" href={person.resume || `mailto:${person.email}?subject=Resume%20request`}{...(person.resume ? { download: true } : {})}>{person.resume ? 'Download résumé' : 'Request résumé'} <ArrowUpRight size={15} /></a>
    </nav>
    <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button>
  </header>
}
