import { ArrowLeft, Grid2X2, LampDesk, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { person } from '../../data/portfolio'
import { useWorkspaceStore, type DesktopApp } from '../../store/workspaceStore'
import { WindowManager } from './WindowManager'
import { appIcons, appLabels } from './desktopApps'
import './desktop.css'

const apps: DesktopApp[] = ['projects', 'terminal', 'about', 'skills', 'contact']

export function DesktopEnvironment() {
  const reduced = useReducedMotion()
  const [appsOpen, setAppsOpen] = useState(false)
  const { theme, lampOn, windows, openApp, focusApp, setMode, setTheme, toggleLamp, keepWindowsInView } = useWorkspaceStore()
  useEffect(() => { window.addEventListener('resize', keepWindowsInView); return () => window.removeEventListener('resize', keepWindowsInView) }, [keepWindowsInView])
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const background = [document.querySelector('.workspace-site > .site-header'), document.querySelector('.workspace-site > main')]
    document.body.style.overflow = 'hidden'
    background.forEach(element => element?.setAttribute('inert', ''))
    return () => { document.body.style.overflow = previousOverflow; background.forEach(element => element?.removeAttribute('inert')) }
  }, [])
  return <motion.div className={`desktop-environment desktop-environment--${theme}`} initial={reduced ? false : { opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0, scale: 1.025 }} transition={{ duration: .42 }} role="region" aria-label="Portfolio desktop">
    <header className="desktop-menubar"><div className="desktop-brand"><span className="desktop-mark">AK</span><strong>The Living Workspace</strong><span className="desktop-menubar-divider" />{person.shortName}</div><div className="desktop-menubar-actions"><button type="button" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')} aria-label={`Switch to ${theme === 'night' ? 'day' : 'night'} mode`}>{theme === 'night' ? <Sun size={17} /> : <Moon size={17} />}<span>{theme === 'night' ? 'Day mode' : 'Night mode'}</span></button><button type="button" onClick={toggleLamp} aria-pressed={lampOn} title="Desk lamp"><LampDesk size={17} /><span>Lamp {lampOn ? 'on' : 'off'}</span></button><button className="desktop-return" type="button" onClick={() => setMode('workspace')}><ArrowLeft size={17} /> Workspace</button></div></header>
    <div className="desktop-wallpaper" aria-hidden="true"><span>AK / WORKSPACE</span><strong>Ideas into<br />working systems.</strong><small>SOFTWARE · BACKEND · DATA</small></div>
    <nav className="desktop-launchpad" aria-label="Desktop applications">{apps.map(app => { const Icon = appIcons[app]; return <button key={app} type="button" onClick={() => openApp(app)} aria-label={`Open ${appLabels[app]}`}><span><Icon size={28} strokeWidth={1.6} /></span><strong>{appLabels[app]}</strong></button> })}</nav>
    <WindowManager />
    {appsOpen && <nav className="desktop-app-menu" aria-label="Launch application">{apps.map(app => { const Icon = appIcons[app]; return <button key={app} type="button" onClick={() => { openApp(app); setAppsOpen(false) }}><Icon size={19} />{appLabels[app]}</button> })}</nav>}
    <nav className="desktop-taskbar" aria-label="Open windows"><button className="taskbar-home" type="button" onClick={() => setMode('workspace')} aria-label="Return to workspace">AK.</button><button className="taskbar-launch" type="button" onClick={() => setAppsOpen(open => !open)} aria-expanded={appsOpen} aria-label="Open applications menu"><Grid2X2 size={19} /> <span>Apps</span></button><span className="taskbar-divider" />{windows.map(item => { const Icon = appIcons[item.app]; return <button key={item.app} type="button" className={item.minimized ? 'taskbar-app is-minimized' : 'taskbar-app'} onClick={() => focusApp(item.app)} aria-label={`Show ${appLabels[item.app]}`}><Icon size={19} /><span>{appLabels[item.app]}</span></button> })}<span className="taskbar-spacer" /><span className="taskbar-label">PORTFOLIO DESKTOP</span></nav>
  </motion.div>
}
