import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = { active: boolean; hovered: boolean; onSelect: () => void; onHover: (value: boolean) => void }

export function Keyboard({ active, hovered, onSelect, onHover }: Props) {
  const keys = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const keyGeometry = useMemo(() => new THREE.BoxGeometry(.15, .055, .115), [])
  useLayoutEffect(() => {
    const mesh = keys.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    let index = 0
    for (let row = 0; row < 5; row++) {
      for (let column = 0; column < 14; column++) {
        dummy.position.set(-1.37 + column * .21, .142, -.36 + row * .18)
        dummy.updateMatrix()
        mesh.setMatrixAt(index++, dummy.matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [])
  useFrame((_, delta) => {
    if (material.current) material.current.emissiveIntensity = THREE.MathUtils.damp(material.current.emissiveIntensity, active ? .46 : hovered ? .27 : .02, 6, delta)
  })
  return <group position={[-.58, .18, 1.16]} rotation={[0, -.035, 0]} onPointerOver={event => { event.stopPropagation(); onHover(true) }} onPointerOut={event => { event.stopPropagation(); onHover(false) }} onClick={event => { event.stopPropagation(); onSelect() }}>
    <RoundedBox args={[3.13, .16, 1.02]} radius={.055} smoothness={3} castShadow receiveShadow><meshStandardMaterial color="#242a31" metalness={.65} roughness={.38} /></RoundedBox>
    <instancedMesh ref={keys} args={[keyGeometry, undefined, 70]} castShadow><meshStandardMaterial ref={material} color="#a6afb7" metalness={.21} roughness={.63} emissive="#3c8ab2" emissiveIntensity={0} /></instancedMesh>
    <mesh position={[0, .083, .5]}><boxGeometry args={[2.85, .008, .012]} /><meshBasicMaterial color={hovered || active ? '#62c8e7' : '#31536b'} /></mesh>
  </group>
}
