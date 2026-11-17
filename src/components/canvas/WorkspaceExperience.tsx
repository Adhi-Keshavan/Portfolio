import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { WorkspaceObject } from '../../hooks/useWorkspaceSelection'
import { WorkspaceScene } from './workspace/WorkspaceScene'

export default function WorkspaceExperience({ selected, onSelect, onReady, reducedMotion }: { selected: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void; onReady: () => void; reducedMotion: boolean }) {
  const [visible, setVisible] = useState(!document.hidden)
  const [quality, setQuality] = useState<'low' | 'high'>('high')
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return <div className="workspace-canvas" onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); pointer.current.x = (event.clientX - rect.left) / rect.width * 2 - 1; pointer.current.y = (event.clientY - rect.top) / rect.height * 2 - 1 }} onPointerLeave={() => { pointer.current.x = 0; pointer.current.y = 0 }}>
    <Canvas shadows dpr={quality === 'high' ? [1, 1.5] : 1} frameloop={visible ? 'always' : 'never'} camera={{ position: [9.5, 8.1, 13], fov: 41, near: .1, far: 60 }} gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }} onCreated={onReady}>
      <Suspense fallback={null}><WorkspaceScene selected={selected} onSelect={onSelect} pointer={pointer} reducedMotion={reducedMotion} onQualityChange={setQuality} /></Suspense>
    </Canvas>
  </div>
}
