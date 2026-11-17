import { RoundedBox } from '@react-three/drei'

export function Decor() {
  return <group>
    <group position={[-3.48, .13, -1.45]}>
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
