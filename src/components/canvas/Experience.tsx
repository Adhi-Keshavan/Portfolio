import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { sceneState } from './sceneState'

const nodePositions: [number, number, number][] = [
  [-2.25, 1.35, -0.3], [2.25, 1.2, -0.4], [-2.55, -0.8, 0.1],
  [2.45, -1.3, 0.1], [-0.7, 2.3, -0.6], [0.65, -2.2, -0.4],
  [2.85, 0.15, -1.2],
]

function CameraRig() {
  useFrame(({ camera }, delta) => {
    const p = sceneState.progress
    const targetZ = 8.4 + Math.sin(p * Math.PI) * 0.7
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.3, delta)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, p > 0.82 ? -0.2 : 0.1, 1.6, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, Math.sin(p * Math.PI * 1.5) * 0.18, 1.6, delta)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function EngineeringNexus() {
  const group = useRef<THREE.Group>(null)
  const ringA = useRef<THREE.Group>(null)
  const ringB = useRef<THREE.Group>(null)
  const ringC = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const constellation = useRef<THREE.Group>(null)
  const nodes = useRef<THREE.Mesh[]>([])
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1.46, 0.048, 8, 96), [])
  const accentGeometry = useMemo(() => new THREE.TorusGeometry(1.46, 0.012, 5, 96, Math.PI * 0.66), [])
  const nodeGeometry = useMemo(() => new THREE.SphereGeometry(0.055, 8, 8), [])
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5f7088', metalness: 0.88, roughness: 0.27 }), [])
  const darkMetal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1b2b43', metalness: 0.82, roughness: 0.36 }), [])
  const energy = useMemo(() => new THREE.MeshBasicMaterial({ color: '#3bd7ee' }), [])

  useFrame(({ clock }, delta) => {
    const p = sceneState.progress
    const t = clock.elapsedTime
    const expanded = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (p - 0.08) / 0.78))))
    const skillsReveal = Math.max(0, Math.min(1, (p - 0.24) * 8)) * Math.max(0, Math.min(1, (0.61 - p) * 8))
    if (group.current) {
      const endX = p > 0.76 ? 1.45 : 1.7 + expanded * 0.35
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, endX, 2.3, delta)
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -0.08 + Math.sin(p * Math.PI * 2) * 0.24, 2, delta)
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, t * 0.1 + sceneState.dragX + sceneState.pointerX * 0.12 + p * 1.1, 2.1, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, sceneState.dragY + sceneState.pointerY * 0.08 + Math.sin(p * Math.PI) * 0.18, 2.1, delta)
      const scale = p > 0.77 ? 0.83 : 1 + expanded * 0.12
      group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 2, delta))
    }
    if (ringA.current) ringA.current.rotation.y = t * 0.12
    if (ringB.current) ringB.current.rotation.z = -t * 0.09
    if (ringC.current) ringC.current.rotation.x = t * 0.1
    if (core.current) core.current.rotation.y = -t * 0.13
    if (coreMaterial.current) coreMaterial.current.emissiveIntensity = THREE.MathUtils.damp(coreMaterial.current.emissiveIntensity, sceneState.hotspot ? 0.65 : 0.04, 5, delta)
    if (constellation.current) constellation.current.scale.setScalar(THREE.MathUtils.damp(constellation.current.scale.x, Math.max(0.001, skillsReveal), 3, delta))
    nodes.current.forEach((node, index) => { if (node) node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, index === sceneState.category ? 2.25 : 1, 4, delta)) })
    if (ringA.current) ringA.current.position.x = THREE.MathUtils.damp(ringA.current.position.x, -expanded * 0.31, 2, delta)
    if (ringB.current) ringB.current.position.x = THREE.MathUtils.damp(ringB.current.position.x, expanded * 0.38, 2, delta)
  })

  return <group ref={group} position={[1.7, 0, 0]}>
    <group ref={constellation} scale={0.001}>
      {nodePositions.map((position, index) => <group key={index}>
        <Line points={[[0, 0, 0], position]} color="#3b82f6" transparent opacity={0.28} lineWidth={0.6} />
        <mesh ref={element => { if (element) nodes.current[index] = element }} position={position} geometry={nodeGeometry} material={energy} />
      </group>)}
    </group>
    <mesh rotation={[0.4, 0.7, 0]} material={darkMetal}>
      <icosahedronGeometry args={[0.98, 1]} />
    </mesh>
    <mesh ref={core} rotation={[0.1, -0.4, 0]}>
      <icosahedronGeometry args={[0.76, 1]} />
      <meshStandardMaterial ref={coreMaterial} color="#7a94ad" metalness={0.92} roughness={0.23} flatShading emissive="#3bd7ee" emissiveIntensity={0} />
    </mesh>
    <mesh scale={0.91} rotation={[0.4, 0.8, 0]}>
      <icosahedronGeometry args={[0.98, 1]} />
      <meshBasicMaterial color="#3bbfd7" wireframe transparent opacity={0.27} />
    </mesh>
    <mesh>
      <octahedronGeometry args={[0.31, 0]} />
      <meshBasicMaterial color="#7ee8f3" />
    </mesh>
    <group ref={ringA} rotation={[0.42, 0.3, 0]}>
      <mesh geometry={ringGeometry} material={metal} />
      <mesh geometry={accentGeometry} material={energy} rotation={[0, 0, 0.62]} />
      {[0, 1, 2, 3].map(i => <mesh key={i} geometry={nodeGeometry} material={energy} position={[Math.cos(i * Math.PI / 2) * 1.46, Math.sin(i * Math.PI / 2) * 1.46, 0]} />)}
    </group>
    <group ref={ringB} rotation={[1.19, 0.34, 0.18]} scale={1.17}>
      <mesh geometry={ringGeometry} material={metal} />
      <mesh geometry={accentGeometry} material={energy} rotation={[0, 0, 2.2]} />
    </group>
    <group ref={ringC} rotation={[0.2, 1.1, 1.07]} scale={0.78}>
      <mesh geometry={ringGeometry} material={metal} />
    </group>
    <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.65} material={darkMetal}>
      <torusGeometry args={[1.46, 0.012, 4, 96]} />
    </mesh>
  </group>
}

export default function Experience() {
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return <Canvas aria-hidden="true" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0, 8.4], fov: 42 }}>
    <ambientLight intensity={0.68} color="#a7c0de" />
    <directionalLight position={[-4, 5, 7]} intensity={2.1} color="#d5e8ff" />
    <directionalLight position={[4, -3, 3]} intensity={1.15} color="#2bb9de" />
    <pointLight position={[3, 3, -1]} intensity={13} distance={8} color="#236dbb" />
    <CameraRig />
    <EngineeringNexus />
  </Canvas>
}
