import { useMemo } from 'react'
import * as THREE from 'three'

const foliage = ['#3e573f', '#506748', '#435e43', '#5a6b48']
const leaves = Array.from({ length: 15 }, (_, index) => {
  const angle = index * 2.39996
  const radius = .19 + (index % 4) * .035
  const height = .69 + index * .045 + Math.sin(index * 3.7) * .035
  return {
    base: new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius),
    direction: new THREE.Vector3(Math.cos(angle) * .78, .52 + (index % 3) * .09, Math.sin(angle) * .78).normalize(),
    size: .36 + (index % 4) * .035,
    color: foliage[index % foliage.length],
  }
})

function makeLeafGeometry() {
  const vertices: number[] = []
  const indices: number[] = []
  for (let step = 0; step <= 10; step++) {
    const t = step / 10
    const width = Math.sin(Math.PI * t) * .27 * (.92 + t * .08)
    const curve = Math.sin(Math.PI * t) * .07 + t * t * .035
    vertices.push(-width, t, curve, width, t, curve)
    if (step < 10) { const offset = step * 2; indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2) }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function Plant() {
  const leafGeometry = useMemo(() => makeLeafGeometry(), [])
  const veinGeometry = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 11 }, (_, step) => {
    const t = step / 10
    return new THREE.Vector3(0, t, Math.sin(Math.PI * t) * .07 + t * t * .035 + .003)
  })), 10, .003, 3, false), [])
  return <group position={[3.46, .14, -1.45]}>
    <mesh position={[0, .23, 0]} castShadow receiveShadow><cylinderGeometry args={[.3, .22, .46, 24]} /><meshStandardMaterial color="#373a38" metalness={.12} roughness={.88} /></mesh>
    <mesh position={[0, .455, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.283, .022, 8, 24]} /><meshStandardMaterial color="#4a4b46" roughness={.82} /></mesh>
    <mesh position={[0, .451, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.268, 24]} /><meshStandardMaterial color="#302820" roughness={1} /></mesh>
    <mesh castShadow><tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(0, .46, 0), new THREE.Vector3(.015, .8, 0), new THREE.Vector3(-.02, 1.19, .015)]), 12, .025, 6, false]} /><meshStandardMaterial color="#5b4b33" roughness={.93} /></mesh>
    {leaves.map((leaf, index) => {
      const stemStart = new THREE.Vector3(0, Math.max(.54, leaf.base.y - .2), 0)
      const stemMiddle = stemStart.clone().lerp(leaf.base, .55).add(new THREE.Vector3(0, .045, 0))
      const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), leaf.direction)
      return <group key={index}>
        <mesh castShadow><tubeGeometry args={[new THREE.CatmullRomCurve3([stemStart, stemMiddle, leaf.base]), 8, .008, 5, false]} /><meshStandardMaterial color="#635439" roughness={.93} /></mesh>
        <group position={leaf.base} quaternion={rotation} scale={leaf.size}>
          <mesh geometry={leafGeometry} castShadow receiveShadow dispose={null}><meshStandardMaterial color={leaf.color} side={THREE.DoubleSide} roughness={.73} metalness={0} /></mesh>
          <mesh geometry={veinGeometry} dispose={null}><meshBasicMaterial color="#87936a" transparent opacity={.52} /></mesh>
        </group>
      </group>
    })}
  </group>
}
