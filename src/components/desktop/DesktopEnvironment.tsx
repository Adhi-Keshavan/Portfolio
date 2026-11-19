import { ArrowLeft, Grid2X2, LampDesk, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { person } from '../../data/portfolio'
import { useWorkspaceStore, type DesktopApp } from '../../store/workspaceStore'
import { WindowManager } from './WindowManager'
import { appIcons, appLabels } from './desktopApps'
import './desktop.css'

const apps: DesktopApp[] = ['projects', 'terminal', 'about', 'skills', 'resume', 'contact', 'settings']

export function DesktopEnvironment({ origin }: { origin: { top: number; right: number; bottom: number; left: number } }) {
  const prefersReduced = useReducedMotion()
  const [appsOpen, setAppsOpen] = useState(false)
  const [clock, setClock] = useState(() => new Date())
  const { theme, lampOn, reducedMotion, windows, openApp, focusApp, closeApp, setMode, setTheme, toggleLamp, keepWindowsInView } = useWorkspaceStore()
  const reduced = reducedMotion || prefersReduced
  const originClip = `inset(${origin.top}px ${origin.right}px ${origin.bottom}px ${origin.left}px)`
  useEffect(() => { window.addEventListener('resize', keepWindowsInView); return () => window.removeEventListener('resize', keepWindowsInView) }, [keepWindowsInView])
  useEffect(() => { const id = window.setInterval(() => setClock(new Date()), 30000); return () => window.clearInterval(id) }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('.screenshot-lightbox')) return
      if (appsOpen) { setAppsOpen(false); return }
      const top = windows.filter(item => !item.minimized).sort((a, b) => b.z - a.z)[0]
      if (top) closeApp(top.app)
      else setMode('workspace')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [appsOpen, windows, closeApp, setMode])
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const background = [document.querySelector('.workspace-site > .site-header'), document.querySelector('.workspace-site > main')]
    document.body.style.overflow = 'hidden'
    background.forEach(element => element?.setAttribute('inert', ''))
    return () => { document.body.style.overflow = previousOverflow; background.forEach(element => element?.removeAttribute('inert')) }
  }, [])
  return <motion.div className={`desktop-environment desktop-environment--${theme}`} initial={reduced ? false : { clipPath: originClip }} animate={{ clipPath: 'inset(0px 0px 0px 0px)' }} exit={reduced ? undefined : { clipPath: originClip }} transition={{ duration: .68, ease: [0.22, 1, 0.36, 1] }} role="region" aria-label="DESK.OS desktop">
    <motion.header className="desktop-menubar" initial={reduced ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28, delay: reduced ? 0 : .28 }}><div className="desktop-brand"><span className="desktop-mark">AK</span><strong>DESK.OS</strong><span className="desktop-menubar-divider" />{person.shortName}</div><div className="desktop-menubar-actions"><span className="desktop-clock" aria-label="Local time">{new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(clock)}</span><Link className="desktop-quick-view" to="/quick-view">Quick View</Link><button type="button" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')} aria-label={`Switch to ${theme === 'night' ? 'day' : 'night'} mode`}>{theme === 'night' ? <Sun size={17} /> : <Moon size={17} />}<span>{theme === 'night' ? 'Light mode' : 'Dark mode'}</span></button><button type="button" onClick={toggleLamp} aria-pressed={lampOn} title="Desk lamp"><LampDesk size={17} /><span>Lamp {lampOn ? 'on' : 'off'}</span></button><button className="desktop-return" type="button" onClick={() => setMode('workspace')}><ArrowLeft size={17} /> Back to Workspace</button></div></motion.header>
    <div className="desktop-wallpaper" aria-hidden="true"><span>AK / PERSONAL WORKSPACE</span><strong>DESK.OS</strong><small>SOFTWARE · BACKEND · DATA</small></div>
    <motion.nav className="desktop-launchpad" aria-label="Desktop applications" initial={reduced ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .34, delay: reduced ? 0 : .36 }}>{apps.map(app => { const Icon = appIcons[app]; return <button key={app} type="button" onClick={() => openApp(app)} aria-label={`Open ${appLabels[app]}`}><span><Icon size={28} strokeWidth={1.6} /></span><strong>{appLabels[app]}</strong></button> })}</motion.nav>
    <WindowManager />
    {appsOpen && <nav className="desktop-app-menu" aria-label="Launch application">{apps.map(app => { const Icon = appIcons[app]; return <button key={app} type="button" onClick={() => { openApp(app); setAppsOpen(false) }}><Icon size={19} />{appLabels[app]}</button> })}<Link to="/quick-view" onClick={() => setAppsOpen(false)}>Quick View</Link></nav>}
    <motion.nav className="desktop-taskbar" aria-label="Open windows" initial={reduced ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: reduced ? 0 : .34 }}><button className="taskbar-home" type="button" onClick={() => setMode('workspace')} aria-label="Return to workspace">AK.</button><button className="taskbar-launch" type="button" onClick={() => setAppsOpen(open => !open)} aria-expanded={appsOpen} aria-label="Open applications menu"><Grid2X2 size={19} /> <span>Apps</span></button><span className="taskbar-divider" />{windows.map(item => { const Icon = appIcons[item.app]; return <button key={item.app} type="button" className={item.minimized ? 'taskbar-app is-minimized' : 'taskbar-app'} onClick={() => focusApp(item.app)} aria-label={`Show ${appLabels[item.app]}`}><Icon size={19} /><span>{appLabels[item.app]}</span></button> })}<span className="taskbar-spacer" /><span className="taskbar-label">PORTFOLIO DESKTOP</span></motion.nav>
  </motion.div>
}
