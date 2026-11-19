import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type Props = { active: boolean; hovered: boolean; onSelect: () => void; onHover: (value: boolean) => void }

function PageLines({ left = false }: { left?: boolean }) {
  return <group position={[left ? -.53 : .53, .062, 0]}>
    {Array.from({ length: 7 }, (_, index) => <mesh key={index} position={[0, .002, -.48 + index * .15]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.72, .008]} /><meshBasicMaterial color={index === 0 ? '#95b2c5' : '#c9d3d6'} /></mesh>)}
  </group>
}

export function Notebook({ active, hovered, onSelect, onHover }: Props) {
  const cover = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (cover.current) cover.current.rotation.z = THREE.MathUtils.damp(cover.current.rotation.z, active ? -1.05 : hovered ? -.17 : -.02, 5, delta)
  })
  return <group position={[-2.72, .18, .67]} rotation={[0, .2, 0]} onPointerOver={event => { event.stopPropagation(); onHover(true) }} onPointerOut={event => { event.stopPropagation(); onHover(false) }} onClick={event => { event.stopPropagation(); onSelect() }}>
    <RoundedBox args={[2.28, .075, 1.55]} radius={.035} smoothness={3} castShadow><meshStandardMaterial color="#242a31" roughness={.75} /></RoundedBox>
    <RoundedBox args={[1.08, .045, 1.43]} radius={.015} smoothness={2} position={[.55, .055, 0]}><meshStandardMaterial color="#eeeae0" roughness={.91} /></RoundedBox>
    <PageLines />
    <group ref={cover} position={[0, .055, 0]}>
      <RoundedBox args={[1.08, .045, 1.43]} radius={.015} smoothness={2} position={[-.55, 0, 0]} castShadow><meshStandardMaterial color="#ece7da" roughness={.9} /></RoundedBox>
      <group position={[0, .005, 0]}><PageLines left /></group>
    </group>
    <mesh position={[0, .096, 0]}><boxGeometry args={[.04, .045, 1.42]} /><meshStandardMaterial color="#acb8b5" metalness={.15} roughness={.7} /></mesh>
    <mesh position={[.32, .115, -.32]} rotation={[-Math.PI / 2, 0, -.12]}><planeGeometry args={[.35, .035]} /><meshBasicMaterial color="#558ca5" /></mesh>
  </group>
}
