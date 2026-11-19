import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = { active: boolean; hovered: boolean; onSelect: () => void; onHover: (value: boolean) => void }

const unit = .198
const rows = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 2.5],
]
const layout = rows.flatMap((row, rowIndex) => {
  let offset = -7.5 * unit
  return row.map((width, keyIndex) => {
    const key = { x: offset + width * unit / 2, z: -.36 + rowIndex * .18, width: width * unit - .019, accent: rowIndex === 0 && keyIndex === 0 }
    offset += width * unit
    return key
  })
})
const regularKeys = layout.filter(key => key.width < unit)
const specialKeys = layout.filter(key => key.width >= unit)

export function Keyboard({ active, hovered, onSelect, onHover }: Props) {
  const keys = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const keyGeometry = useMemo(() => new THREE.BoxGeometry(unit - .019, .073, .138), [])
  useLayoutEffect(() => {
    const mesh = keys.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    regularKeys.forEach((key, index) => {
      dummy.position.set(key.x, .142, key.z)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      mesh.setColorAt(index, new THREE.Color(key.accent ? '#c96c30' : '#d8d0c2'))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])
  useFrame((_, delta) => {
    if (material.current) material.current.emissiveIntensity = THREE.MathUtils.damp(material.current.emissiveIntensity, active ? .18 : hovered ? .1 : 0, 6, delta)
  })
  return <group position={[-.58, .18, 1.16]} rotation={[0, -.035, 0]} onPointerOver={event => { event.stopPropagation(); onHover(true) }} onPointerOut={event => { event.stopPropagation(); onHover(false) }} onClick={event => { event.stopPropagation(); onSelect() }}>
    <RoundedBox args={[3.15, .13, 1.05]} radius={.055} smoothness={3} castShadow receiveShadow><meshStandardMaterial color="#292c2d" metalness={.63} roughness={.36} /></RoundedBox>
    <mesh position={[0, .07, 0]} receiveShadow><boxGeometry args={[3.01, .012, .89]} /><meshStandardMaterial color="#151719" metalness={.44} roughness={.63} /></mesh>
    <instancedMesh ref={keys} args={[keyGeometry, undefined, regularKeys.length]} castShadow receiveShadow><meshStandardMaterial ref={material} color="#ffffff" metalness={.08} roughness={.68} emissive="#a65027" emissiveIntensity={0} /></instancedMesh>
    {specialKeys.map((key, index) => <RoundedBox key={index} args={[key.width, .073, .138]} radius={.013} smoothness={2} position={[key.x, .142, key.z]} castShadow receiveShadow><meshStandardMaterial color={key.width > unit * 5 ? '#d8d0c2' : '#565657'} metalness={.08} roughness={.68} emissive={active || hovered ? '#4b2619' : '#000000'} emissiveIntensity={.1} /></RoundedBox>)}
    <mesh position={[0, .073, .519]}><boxGeometry args={[2.94, .008, .012]} /><meshBasicMaterial color={hovered || active ? '#d97736' : '#71543f'} /></mesh>
  </group>
}
