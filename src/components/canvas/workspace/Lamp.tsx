import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Theme } from '../../../store/workspaceStore'

export function Lamp({ on, theme, onToggle, onHover }: { on: boolean; theme: Theme; onToggle: () => void; onHover: (value: boolean) => void }) {
  const light = useRef<THREE.PointLight>(null)
  const bulb = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, delta) => {
    const intensity = on ? theme === 'night' ? 10 : 5 : 0
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, intensity, 4, delta)
    if (bulb.current) bulb.current.emissiveIntensity = THREE.MathUtils.damp(bulb.current.emissiveIntensity, on ? 1.7 : 0, 4, delta)
  })
  return <group position={[-3.5, .16, -.65]} onPointerOver={event => { event.stopPropagation(); onHover(true) }} onPointerOut={event => { event.stopPropagation(); onHover(false) }} onClick={event => { event.stopPropagation(); onToggle() }}>
    <mesh position={[0, .06, 0]} castShadow><cylinderGeometry args={[.33, .35, .12, 32]} /><meshStandardMaterial color="#34312e" metalness={.72} roughness={.31} /></mesh>
    <mesh position={[0, .7, 0]} castShadow><cylinderGeometry args={[.035, .045, 1.28, 12]} /><meshStandardMaterial color="#3b3834" metalness={.8} roughness={.27} /></mesh>
    <mesh position={[.34, 1.28, 0]} rotation={[0, 0, -1.05]} castShadow><cylinderGeometry args={[.035, .04, .8, 12]} /><meshStandardMaterial color="#3b3834" metalness={.8} roughness={.27} /></mesh>
    <mesh position={[.7, 1.52, 0]} castShadow><cylinderGeometry args={[.14, .37, .43, 32, 1]} /><meshStandardMaterial color="#3a332c" metalness={.62} roughness={.42} side={THREE.DoubleSide} /></mesh>
    <mesh position={[.7, 1.28, 0]}><sphereGeometry args={[.11, 16, 12]} /><meshStandardMaterial ref={bulb} color="#f3d6a8" emissive="#f4b875" emissiveIntensity={on ? 1.7 : 0} /></mesh>
    <pointLight ref={light} position={[.7, 1.2, .1]} color="#ffce91" intensity={on ? 10 : 0} distance={4.6} decay={2} />
  </group>
}
