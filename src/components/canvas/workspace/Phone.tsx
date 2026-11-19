import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createPhoneTexture } from './textures'

type Props = { active: boolean; hovered: boolean; onSelect: () => void; onHover: (value: boolean) => void }

export function Phone({ active, hovered, onSelect, onHover }: Props) {
  const texture = useMemo(() => createPhoneTexture(), [])
  const screen = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, delta) => {
    if (screen.current) screen.current.emissiveIntensity = THREE.MathUtils.damp(screen.current.emissiveIntensity, active ? .86 : hovered ? .6 : .18, 5, delta)
  })
  return <group position={[2.86, .2, .66]} rotation={[0, -.25, 0]} onPointerOver={event => { event.stopPropagation(); onHover(true) }} onPointerOut={event => { event.stopPropagation(); onHover(false) }} onClick={event => { event.stopPropagation(); onSelect() }}>
    <RoundedBox args={[.83, .12, 1.53]} radius={.09} smoothness={4} castShadow receiveShadow><meshStandardMaterial color="#1b222c" metalness={.76} roughness={.3} /></RoundedBox>
    <mesh position={[0, .068, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.73, 1.39]} /><meshStandardMaterial ref={screen} map={texture} emissive="#e8aa79" emissiveMap={texture} emissiveIntensity={.18} roughness={.3} toneMapped={false} /></mesh>
    <mesh position={[0, .073, -.68]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.17, .015]} /><meshBasicMaterial color="#1a2835" /></mesh>
  </group>
}
