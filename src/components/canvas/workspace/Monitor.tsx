import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createMonitorTexture } from './textures'

type Props = { active: boolean; hovered: boolean; onSelect: () => void; onHover: (value: boolean) => void }

export function Monitor({ active, hovered, onSelect, onHover }: Props) {
  const texture = useMemo(() => createMonitorTexture(), [])
  const screen = useRef<THREE.MeshStandardMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  useFrame((_, delta) => {
    if (screen.current) screen.current.emissiveIntensity = THREE.MathUtils.damp(screen.current.emissiveIntensity, active ? .9 : hovered ? .72 : .55, 5, delta)
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, active ? 1.5 : hovered ? .9 : .35, 4, delta)
  })
  return <group position={[0, .15, -1.17]} onPointerOver={event => { event.stopPropagation(); onHover(true) }} onPointerOut={event => { event.stopPropagation(); onHover(false) }} onClick={event => { event.stopPropagation(); onSelect() }}>
    <mesh position={[0, 0, .25]} castShadow receiveShadow><boxGeometry args={[1.56, .055, .7]} /><meshStandardMaterial color="#272e38" metalness={.82} roughness={.27} /></mesh>
    <mesh position={[0, .47, .06]} castShadow><boxGeometry args={[.19, .86, .16]} /><meshStandardMaterial color="#272e38" metalness={.84} roughness={.26} /></mesh>
    <group position={[0, 1.94, 0]} rotation={[-.045, 0, 0]}>
      <RoundedBox args={[4.42, 2.48, .14]} radius={.085} smoothness={4} castShadow receiveShadow><meshStandardMaterial color="#171d26" metalness={.75} roughness={.28} /></RoundedBox>
      <mesh position={[0, .025, .081]}><planeGeometry args={[4.18, 2.26]} /><meshStandardMaterial ref={screen} map={texture} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={.55} roughness={.42} metalness={.05} toneMapped={false} /></mesh>
      <mesh position={[0, -1.19, .085]}><boxGeometry args={[4.18, .013, .012]} /><meshBasicMaterial color={active || hovered ? '#67cbe9' : '#4b7c97'} /></mesh>
      <mesh position={[0, -1.22, .09]}><sphereGeometry args={[.017, 8, 8]} /><meshBasicMaterial color="#c1d7e3" /></mesh>
    </group>
    <pointLight ref={light} position={[0, 1.6, 1.3]} color="#5bace8" intensity={.35} distance={4.8} decay={2} />
  </group>
}
