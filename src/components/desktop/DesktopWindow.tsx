import { useRef, type PointerEvent, type ReactNode } from 'react'
import { Maximize2, Minimize2, Minus, X } from 'lucide-react'
import { useWorkspaceStore, type DesktopWindowState } from '../../store/workspaceStore'

export function DesktopWindow({ state, title, icon, children }: { state: DesktopWindowState; title: string; icon: ReactNode; children: ReactNode }) {
  const { focusApp, closeApp, minimizeApp, moveApp, resizeApp, toggleMaximize } = useWorkspaceStore()
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)
  const resize = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
  const onDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (state.maximized || (event.target as HTMLElement).closest('button')) return
    focusApp(state.app)
    drag.current = { x: event.clientX, y: event.clientY, startX: state.x, startY: state.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current) moveApp(state.app, drag.current.startX + event.clientX - drag.current.x, drag.current.startY + event.clientY - drag.current.y)
  }
  const onResizeStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    focusApp(state.app)
    resize.current = { x: event.clientX, y: event.clientY, width: state.width, height: state.height }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onResizeMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (resize.current) resizeApp(state.app, resize.current.width + event.clientX - resize.current.x, resize.current.height + event.clientY - resize.current.y)
  }
  return <section className={`desktop-window${state.maximized ? ' desktop-window--maximized' : ''}`} style={{ left: state.x, top: state.y, width: state.width, height: state.height, zIndex: state.z, display: state.minimized ? 'none' : undefined }} aria-label={`${title} window`} onPointerDown={() => focusApp(state.app)}>
    <div className="window-titlebar" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={() => { drag.current = null }} onDoubleClick={() => toggleMaximize(state.app)}>
      <div className="window-identity">{icon}<strong>{title}</strong></div>
      <div className="window-controls"><button type="button" onClick={() => minimizeApp(state.app)} aria-label={`Minimize ${title}`}><Minus size={16} /></button><button type="button" onClick={() => toggleMaximize(state.app)} aria-label={`${state.maximized ? 'Restore' : 'Maximize'} ${title}`}>{state.maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button><button type="button" onClick={() => closeApp(state.app)} aria-label={`Close ${title}`}><X size={17} /></button></div>
    </div>
    <div className="window-content">{children}</div>
    {!state.maximized && <button className="window-resize" type="button" aria-label={`Resize ${title}`} onPointerDown={onResizeStart} onPointerMove={onResizeMove} onPointerUp={() => { resize.current = null }} />}
  </section>
}
