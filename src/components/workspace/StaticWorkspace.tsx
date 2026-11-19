import type { WorkspaceObject } from '../../hooks/useWorkspaceSelection'

export function StaticWorkspace({ onSelect, lampOn }: { onSelect: (object: WorkspaceObject) => void; lampOn: boolean }) {
  return <div className="static-workspace" aria-label="Illustrated developer workstation">
    <div className="static-glow" />
    <div className="static-desk">
      <button type="button" className="static-monitor" onClick={() => onSelect('monitor')} aria-label="Enter DESK.OS desktop"><span className="static-screen"><small>AK / PERSONAL WORKSPACE</small><strong>DESK<span>.OS</span></strong><i>PROJECTS &nbsp;·&nbsp; TERMINAL &nbsp;·&nbsp; ABOUT</i></span><span className="static-monitor-stand" /></button>
      <button type="button" className="static-keyboard" onClick={() => onSelect('keyboard')} aria-label="Open terminal"><span>{Array.from({ length: 42 }, (_, i) => <i key={i} />)}</span></button>
      <button type="button" className="static-notebook" onClick={() => onSelect('notebook')} aria-label="Open about and education"><span /><span /></button>
      <button type="button" className="static-phone" onClick={() => onSelect('phone')} aria-label="Open contact"><span>AK.<small>LET'S CONNECT</small></span></button>
      <div className={lampOn ? 'static-lamp is-on' : 'static-lamp'} aria-hidden="true"><i /><b /></div>
      <div className="static-mug" aria-hidden="true" />
    </div>
  </div>
}
