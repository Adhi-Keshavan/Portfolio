import { useWorkspaceStore } from '../../store/workspaceStore'
import { DesktopWindow } from './DesktopWindow'
import { ProjectExplorer } from './ProjectExplorer'
import { Terminal } from './Terminal'
import { AboutApp, ContactApp, SkillsApp } from './DesktopContent'
import { appIcons, appLabels } from './desktopApps'

export function WindowManager() {
  const windows = useWorkspaceStore(state => state.windows)
  return <>{windows.map(state => {
    const Icon = appIcons[state.app]
    const contents = { projects: <ProjectExplorer />, terminal: <Terminal />, about: <AboutApp />, skills: <SkillsApp />, contact: <ContactApp /> }
    return <DesktopWindow key={state.app} state={state} title={appLabels[state.app]} icon={<Icon size={17} />}>{contents[state.app]}</DesktopWindow>
  })}</>
}
