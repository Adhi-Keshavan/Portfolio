import { lazy, Suspense, type ComponentType } from 'react'
import { useWorkspaceStore, type DesktopApp } from '../../store/workspaceStore'
import { DesktopWindow } from './DesktopWindow'
import { appIcons, appLabels } from './desktopApps'

const ProjectExplorer = lazy(() => import('./ProjectExplorer').then(module => ({ default: module.ProjectExplorer })))
const Terminal = lazy(() => import('./Terminal').then(module => ({ default: module.Terminal })))
const AboutApp = lazy(() => import('./DesktopContent').then(module => ({ default: module.AboutApp })))
const SkillsApp = lazy(() => import('./DesktopContent').then(module => ({ default: module.SkillsApp })))
const ContactApp = lazy(() => import('./DesktopContent').then(module => ({ default: module.ContactApp })))
const ResumeViewer = lazy(() => import('./ResumeViewer').then(module => ({ default: module.ResumeViewer })))
const SettingsApp = lazy(() => import('./SettingsApp').then(module => ({ default: module.SettingsApp })))

const contents: Record<DesktopApp, ComponentType> = { projects: ProjectExplorer, terminal: Terminal, about: AboutApp, skills: SkillsApp, resume: ResumeViewer, contact: ContactApp, settings: SettingsApp }

export function WindowManager() {
  const windows = useWorkspaceStore(state => state.windows)
  return <>{windows.map(state => {
    const Icon = appIcons[state.app]
    const Content = contents[state.app]
    return <DesktopWindow key={state.app} state={state} title={appLabels[state.app]} icon={<Icon size={17} />}><Suspense fallback={<div className="window-loading">Opening {appLabels[state.app]}…</div>}><Content /></Suspense></DesktopWindow>
  })}</>
}
