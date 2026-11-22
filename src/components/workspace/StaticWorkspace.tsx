import type { WorkspaceObject } from '../../hooks/useWorkspaceSelection'

const keyboardRows = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 2.5],
]

export function StaticWorkspace({ onSelect, lampOn }: { onSelect: (object: WorkspaceObject) => void; lampOn: boolean }) {
  return <div className="static-workspace" aria-label="Illustrated developer workstation">
    <div className="static-glow" />
    <div className="static-desk">
      <button type="button" className="static-monitor" onClick={() => onSelect('monitor')} aria-label="Enter DESK.OS desktop"><span className="static-screen"><small>AK / PERSONAL WORKSPACE</small><strong>DESK<span>.OS</span></strong><i>PROJECTS &nbsp;·&nbsp; TERMINAL &nbsp;·&nbsp; ABOUT</i></span><span className="static-monitor-stand" /></button>
      <button type="button" className="static-keyboard" onClick={() => onSelect('keyboard')} aria-label="Open terminal"><span>{keyboardRows.flatMap((row, rowIndex) => row.map((width, keyIndex) => <i key={`${rowIndex}-${keyIndex}`} style={{ gridColumn: `span ${Math.round(width * 4)}` }} className={width > 1 && width < 5 ? 'static-modifier-key' : ''} />))}</span></button>
      <button type="button" className="static-notebook" onClick={() => onSelect('notebook')} aria-label="Open about and education"><span /><span /></button>
      <button type="button" className="static-phone" onClick={() => onSelect('phone')} aria-label="Open contact"><span>AK.<small>LET'S CONNECT</small></span></button>
      <div className={lampOn ? 'static-lamp is-on' : 'static-lamp'} aria-hidden="true"><i /><b /></div>
      <div className="static-mug" aria-hidden="true" />
    </div>
  </div>
}
