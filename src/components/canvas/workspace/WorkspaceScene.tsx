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
import { Lamp } from './Lamp'
import type { Theme } from '../../../store/workspaceStore'

export function WorkspaceScene({ selected, scrollFocus, onSelect, onFocusArrived, pointer, reducedMotion, onQualityChange, theme, lampOn, onToggleLamp }: { selected: WorkspaceObject | null; scrollFocus: WorkspaceObject | null; onSelect: (object: WorkspaceObject) => void; onFocusArrived: (object: WorkspaceObject) => void; pointer: React.RefObject<{ x: number; y: number }>; reducedMotion: boolean; onQualityChange: (quality: 'low' | 'high') => void; theme: Theme; lampOn: boolean; onToggleLamp: () => void }) {
  const [hovered, setHovered] = useState<WorkspaceObject | null>(null)
  const [lampHovered, setLampHovered] = useState(false)
  const ambientAccent = useRef<THREE.PointLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  useCursor(hovered !== null || lampHovered)
  useFrame((_, delta) => {
    if (ambientAccent.current) ambientAccent.current.intensity = THREE.MathUtils.damp(ambientAccent.current.intensity, theme === 'day' ? 2 : selected ? 9 : 6, 2.2, delta)
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.damp(ambient.current.intensity, theme === 'day' ? 1.5 : .45, 3, delta)
    if (sun.current) sun.current.intensity = THREE.MathUtils.damp(sun.current.intensity, theme === 'day' ? 3.8 : 1.1, 3, delta)
  })
  const hover = (object: WorkspaceObject) => (value: boolean) => setHovered(value ? object : current => current === object ? null : current)
  return <>
    <color attach="background" args={[theme === 'day' ? '#d8d4ce' : '#171717']} />
    <fog attach="fog" args={[theme === 'day' ? '#d8d4ce' : '#171717', 15, 29]} />
    <ambientLight ref={ambient} intensity={theme === 'day' ? 1.5 : .45} color={theme === 'day' ? '#fff1de' : '#d8c6b4'} />
    <hemisphereLight args={['#f5e8d7', '#322b26', theme === 'day' ? 1.5 : .6]} />
    <directionalLight ref={sun} position={[4.5, 8, 5]} intensity={theme === 'day' ? 3.8 : 1.1} color="#fff0d9" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.0003} />
    <pointLight ref={ambientAccent} position={[-4.5, 4, -3]} intensity={theme === 'day' ? 2 : 6} distance={11} color="#e9a46c" />
    <spotLight position={[5, 5, -5]} intensity={theme === 'day' ? 5 : 2} angle={.65} penumbra={1} distance={13} color="#f5dfc4" />
    <Desk theme={theme} />
    <Monitor active={selected === 'monitor'} hovered={hovered === 'monitor'} onSelect={() => onSelect('monitor')} onHover={hover('monitor')} />
    <Keyboard active={selected === 'keyboard'} hovered={hovered === 'keyboard'} onSelect={() => onSelect('keyboard')} onHover={hover('keyboard')} />
    <Notebook active={selected === 'notebook'} hovered={hovered === 'notebook'} onSelect={() => onSelect('notebook')} onHover={hover('notebook')} />
    <Phone active={selected === 'phone'} hovered={hovered === 'phone'} onSelect={() => onSelect('phone')} onHover={hover('phone')} />
    <Decor theme={theme} />
    <Lamp on={lampOn} theme={theme} onToggle={onToggleLamp} onHover={setLampHovered} />
    <CameraController selected={selected} scrollFocus={scrollFocus} pointer={pointer} reducedMotion={reducedMotion} onFocusArrived={onFocusArrived} />
    <AdaptiveDpr pixelated={false} />
    <PerformanceMonitor onDecline={() => onQualityChange('low')} onIncline={() => onQualityChange('high')} />
  </>
}
