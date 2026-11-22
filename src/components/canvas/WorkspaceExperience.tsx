import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { WorkspaceObject } from '../../hooks/useWorkspaceSelection'
import { WorkspaceScene } from './workspace/WorkspaceScene'
import type { Theme } from '../../store/workspaceStore'

export default function WorkspaceExperience({ selected, scrollFocus, onSelect, onFocusArrived, onReady, reducedMotion, theme, lampOn, onToggleLamp, paused }: { selected: WorkspaceObject | null; scrollFocus: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void; onFocusArrived: (object: WorkspaceObject, frame?: { top: number; right: number; bottom: number; left: number }) => void; onReady: () => void; reducedMotion: boolean; theme: Theme; lampOn: boolean; onToggleLamp: () => void; paused: boolean }) {
  const [visible, setVisible] = useState(!document.hidden)
  const [quality, setQuality] = useState<'low' | 'high'>('high')
  const pointer = useRef({ x: 0, y: 0 })
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let inView = true
    const update = () => setVisible(!document.hidden && inView)
    const observer = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting ?? false; update() }, { threshold: .01 })
    if (container.current) observer.observe(container.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  return <div ref={container} className="workspace-canvas" onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); pointer.current.x = (event.clientX - rect.left) / rect.width * 2 - 1; pointer.current.y = (event.clientY - rect.top) / rect.height * 2 - 1 }} onPointerLeave={() => { pointer.current.x = 0; pointer.current.y = 0 }}>
    <Canvas shadows dpr={quality === 'high' ? [1, 2] : 1} frameloop={visible && !paused ? 'always' : 'never'} camera={{ position: [9.5, 8.1, 13], fov: 41, near: .1, far: 60 }} gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }}>
      <Suspense fallback={null}><WorkspaceScene selected={selected} scrollFocus={scrollFocus} onSelect={onSelect} onFocusArrived={onFocusArrived} onReady={onReady} pointer={pointer} reducedMotion={reducedMotion} onQualityChange={setQuality} theme={theme} lampOn={lampOn} onToggleLamp={onToggleLamp} /></Suspense>
    </Canvas>
  </div>
}
