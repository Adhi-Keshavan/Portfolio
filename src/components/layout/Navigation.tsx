import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { person } from '../../data/portfolio'

const items = [
  ['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Journey', 'journey'], ['Contact', 'contact'],
] as const

export function Navigation({ active = '', detail = false }: { active?: string; detail?: boolean }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a className="brand" href="/#home" aria-label="Adhi Keshavan, home"><span className="brand-mark">AK<span>.</span></span><span className="brand-copy">ADHI KESHAVAN<br /><small>ENGINEERING PORTFOLIO</small></span></a>
    <nav className={open ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Primary navigation">
      {items.map(([label, id]) => <a key={id} className={!detail && active === id ? 'nav-link nav-link--active' : 'nav-link'} href={`/#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-contact" href={`mailto:${person.email}`}>Let's talk <ArrowUpRight size={14} /></a>
    </nav>
    <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={23} /> : <Menu size={23} />}</button>
  </header>
}
