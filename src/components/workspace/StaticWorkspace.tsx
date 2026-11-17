import type { WorkspaceObject } from '../../hooks/useWorkspaceSelection'

export function StaticWorkspace({ onSelect }: { onSelect: (object: WorkspaceObject) => void }) {
  return <div className="static-workspace" aria-label="Illustrated developer workstation">
    <div className="static-glow" />
    <div className="static-desk">
      <button type="button" className="static-monitor" onClick={() => onSelect('monitor')} aria-label="Open projects"><span className="static-screen"><small>AK / WORKSPACE</small><strong>SELECTED<br />WORK.</strong><i>AITIZEN REALM &nbsp;↗</i><i>PAYREADY INDIA &nbsp;↗</i><i>PRESSURE PERFORMANCE &nbsp;↗</i></span><span className="static-monitor-stand" /></button>
      <button type="button" className="static-keyboard" onClick={() => onSelect('keyboard')} aria-label="Open technical skills"><span>{Array.from({ length: 42 }, (_, i) => <i key={i} />)}</span></button>
      <button type="button" className="static-notebook" onClick={() => onSelect('notebook')} aria-label="Open about and education"><span /><span /></button>
      <button type="button" className="static-phone" onClick={() => onSelect('phone')} aria-label="Open contact"><span>AK.<small>LET'S CONNECT</small></span></button>
      <div className="static-mug" aria-hidden="true" />
    </div>
  </div>
}
