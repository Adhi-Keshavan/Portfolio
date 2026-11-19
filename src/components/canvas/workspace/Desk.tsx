import { RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import { createWoodTexture } from './textures'
import type { Theme } from '../../../store/workspaceStore'

export function Desk({ theme }: { theme: Theme }) {
  const wood = useMemo(() => createWoodTexture(), [])
  return <group>
    <mesh receiveShadow position={[0, -1.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={theme === 'day' ? '#c9c3bb' : '#171513'} roughness={1} />
    </mesh>
    {[[-3.66, -1.74], [3.66, -1.74], [-3.66, 1.74], [3.66, 1.74]].map(([x, z], i) => <mesh key={i} position={[x, -0.72, z]} castShadow receiveShadow>
      <boxGeometry args={[0.17, 1.43, 0.17]} />
      <meshStandardMaterial color="#20262d" metalness={0.75} roughness={0.38} />
    </mesh>)}
    <RoundedBox args={[8.4, 0.23, 4.2]} radius={0.055} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={wood} color="#c9b9a8" roughness={0.74} metalness={0.05} />
    </RoundedBox>
    <mesh position={[0, -0.13, 2.02]}><boxGeometry args={[8.1, 0.035, 0.045]} /><meshStandardMaterial color="#1d2229" metalness={0.72} roughness={0.4} /></mesh>
    <mesh position={[0, -0.25, -1.5]} castShadow><boxGeometry args={[5.4, 0.09, 0.13]} /><meshStandardMaterial color="#151a21" metalness={0.7} roughness={0.43} /></mesh>
  </group>
}
