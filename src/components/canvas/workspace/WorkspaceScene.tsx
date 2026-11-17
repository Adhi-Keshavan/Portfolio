import { useRef, useState } from 'react'
import { AdaptiveDpr, PerformanceMonitor, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WorkspaceObject } from '../../../hooks/useWorkspaceSelection'
import { CameraController } from './CameraController'
import { Desk } from './Desk'
import { Monitor } from './Monitor'
import { Keyboard } from './Keyboard'
import { Notebook } from './Notebook'
import { Phone } from './Phone'
import { Decor } from './Decor'

export function WorkspaceScene({ selected, onSelect, pointer, reducedMotion, onQualityChange }: { selected: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void; pointer: React.RefObject<{ x: number; y: number }>; reducedMotion: boolean; onQualityChange: (quality: 'low' | 'high') => void }) {
  const [hovered, setHovered] = useState<WorkspaceObject | null>(null)
  const ambientAccent = useRef<THREE.PointLight>(null)
  useCursor(hovered !== null)
  useFrame((_, delta) => {
    if (ambientAccent.current) ambientAccent.current.intensity = THREE.MathUtils.damp(ambientAccent.current.intensity, selected ? 18 : hovered ? 16 : 14, 2.2, delta)
  })
  const hover = (object: WorkspaceObject) => (value: boolean) => setHovered(value ? object : current => current === object ? null : current)
  return <>
    <color attach="background" args={['#0b0e13']} />
    <fog attach="fog" args={['#0b0e13', 15, 29]} />
    <ambientLight intensity={.67} color="#c8d6e7" />
    <hemisphereLight args={['#b9d9ee', '#1a1717', 1.15]} />
    <directionalLight position={[4.5, 8, 5]} intensity={2.5} color="#f0f4f9" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.0003} />
    <pointLight ref={ambientAccent} position={[-4.5, 4, -3]} intensity={14} distance={11} color="#327ab7" />
    <spotLight position={[5, 5, -5]} intensity={11} angle={.65} penumbra={1} distance={13} color="#c1dbec" />
    <Desk />
    <Monitor active={selected === 'monitor'} hovered={hovered === 'monitor'} onSelect={() => onSelect('monitor')} onHover={hover('monitor')} />
    <Keyboard active={selected === 'keyboard'} hovered={hovered === 'keyboard'} onSelect={() => onSelect('keyboard')} onHover={hover('keyboard')} />
    <Notebook active={selected === 'notebook'} hovered={hovered === 'notebook'} onSelect={() => onSelect('notebook')} onHover={hover('notebook')} />
    <Phone active={selected === 'phone'} hovered={hovered === 'phone'} onSelect={() => onSelect('phone')} onHover={hover('phone')} />
    <Decor />
    <CameraController selected={selected} pointer={pointer} reducedMotion={reducedMotion} />
    <AdaptiveDpr pixelated={false} />
    <PerformanceMonitor onDecline={() => onQualityChange('low')} onIncline={() => onQualityChange('high')} />
  </>
}
