import { LampDesk, Moon, Sun } from 'lucide-react'
import { useWorkspaceStore } from '../../store/workspaceStore'

export function SettingsApp() {
  const { theme, setTheme, lampOn, toggleLamp, reducedMotion, setReducedMotion } = useWorkspaceStore()
  return <div className="desktop-document settings-app"><span className="desktop-eyebrow">SYSTEM / PREFERENCES</span><h2>Make it yours.</h2><p>These settings apply to the desktop and the workstation. Theme and motion preferences are saved in this browser.</p>
    <div className="settings-list"><div className="settings-row"><div><strong>Appearance</strong><small>Choose the desktop and studio lighting.</small></div><div className="settings-options" role="group" aria-label="Appearance"><button type="button" aria-pressed={theme === 'day'} onClick={() => setTheme('day')}><Sun size={17} /> Light</button><button type="button" aria-pressed={theme === 'night'} onClick={() => setTheme('night')}><Moon size={17} /> Dark</button></div></div>
      <div className="settings-row"><div><strong>Desk lamp</strong><small>Switch the workstation lamp {lampOn ? 'off' : 'on'}.</small></div><button type="button" className="settings-toggle" aria-pressed={lampOn} onClick={toggleLamp}><LampDesk size={17} /> {lampOn ? 'On' : 'Off'}</button></div>
      <div className="settings-row"><div><strong>Reduced motion</strong><small>Use the static workspace and remove scene transitions.</small></div><button type="button" className="settings-toggle" aria-pressed={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>{reducedMotion ? 'On' : 'Off'}</button></div></div>
  </div>
}
