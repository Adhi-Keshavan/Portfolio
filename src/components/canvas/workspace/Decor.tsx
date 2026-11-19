import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import type { Theme } from '../../../store/workspaceStore'

export function Decor({ theme }: { theme: Theme }) {
  const mug = useRef<THREE.Group>(null)
  const [mugTurn, setMugTurn] = useState(0)
  useFrame((_, delta) => { if (mug.current) mug.current.rotation.y = THREE.MathUtils.damp(mug.current.rotation.y, mugTurn, 3, delta) })
  return <group>
    <mesh position={[0, 3.2, -4.8]} receiveShadow><planeGeometry args={[30, 10]} /><meshStandardMaterial color={theme === 'day' ? '#d7d0c7' : '#262320'} roughness={1} /></mesh>
    <group position={[2.95, 2.85, -4.66]}>
      <mesh castShadow><boxGeometry args={[1.9, 2.25, .1]} /><meshStandardMaterial color="#3a3029" roughness={.8} /></mesh>
      <mesh position={[0, 0, .058]}><planeGeometry args={[1.64, 1.99]} /><meshStandardMaterial color="#e2d9cc" roughness={1} /></mesh>
      <mesh position={[-.22, .18, .064]} rotation={[0, 0, -.22]}><planeGeometry args={[.66, 1.42]} /><meshBasicMaterial color="#bc8660" /></mesh>
      <mesh position={[.27, -.12, .065]} rotation={[0, 0, .2]}><planeGeometry args={[.55, 1.25]} /><meshBasicMaterial color="#64594f" /></mesh>
    </group>
    <group ref={mug} position={[-3.48, .13, -1.45]} onClick={event => { event.stopPropagation(); setMugTurn(value => value + .36) }}>
      <mesh position={[0, .27, 0]} castShadow><cylinderGeometry args={[.28, .25, .52, 28]} /><meshStandardMaterial color="#1e252b" metalness={.26} roughness={.57} /></mesh>
      <mesh position={[0, .54, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.245, .022, 8, 32]} /><meshStandardMaterial color="#4b555c" metalness={.45} roughness={.53} /></mesh>
      <mesh position={[.31, .31, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.14, .045, 8, 22, Math.PI * 1.4]} /><meshStandardMaterial color="#242b31" roughness={.57} /></mesh>
    </group>
    <group position={[3.46, .14, -1.45]}>
      <mesh position={[0, .23, 0]} castShadow><cylinderGeometry args={[.27, .2, .45, 16]} /><meshStandardMaterial color="#313941" metalness={.45} roughness={.57} /></mesh>
      {[[-.14, .44, -.06], [.12, .5, .04], [.02, .57, -.13]].map(([x, y, z], i) => <group key={i} position={[x, y, z]} rotation={[.1 * i, .9 * i, -.2 + .2 * i]}>
        <mesh position={[0, .27, 0]}><cylinderGeometry args={[.015, .025, .55, 6]} /><meshStandardMaterial color="#526653" roughness={.9} /></mesh>
        <mesh position={[.13, .39, 0]} rotation={[0, 0, -.8]}><sphereGeometry args={[.2, 7, 5]} /><meshStandardMaterial color="#40574a" roughness={.91} /></mesh>
      </group>)}
    </group>
    <group position={[2.03, .17, 1.23]} rotation={[0, -.2, 0]}>
      <RoundedBox args={[.56, .12, .87]} radius={.19} smoothness={3} castShadow><meshStandardMaterial color="#262d35" metalness={.41} roughness={.45} /></RoundedBox>
      <mesh position={[0, .068, -.17]}><boxGeometry args={[.018, .01, .14]} /><meshBasicMaterial color="#7391a3" /></mesh>
    </group>
    <mesh position={[-3.1, .14, 1.56]} rotation={[Math.PI / 2, 0, -.43]} castShadow><cylinderGeometry args={[.02, .02, 1.05, 8]} /><meshStandardMaterial color="#567080" metalness={.85} roughness={.25} /></mesh>
  </group>
}
