import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { WorkspaceObject } from '../../../hooks/useWorkspaceSelection'

const focus = {
  monitor: { position: [0.55, 2.55, 4.25], target: [0, 1.92, -1.16] },
  keyboard: { position: [0.2, 3.17, 4.05], target: [-.58, .23, 1.15] },
  notebook: { position: [-3.14, 3.13, 3.44], target: [-2.68, .24, .65] },
  phone: { position: [4.28, 2.74, 2.88], target: [2.86, .2, .66] },
} satisfies Record<WorkspaceObject, { position: number[]; target: number[] }>

export function CameraController({ selected, pointer, reducedMotion }: { selected: WorkspaceObject | null; pointer: React.RefObject<{ x: number; y: number }>; reducedMotion: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const transitioning = useRef(true)
  const { size } = useThree()

  useEffect(() => { transitioning.current = true }, [selected])

  useFrame(({ camera }, delta) => {
    const control = controls.current
    if (!control) return
    const compact = size.width < 690
    const overviewPosition = compact ? [9.2, 6.9, 11.5] : [7.6, 5.65, 9.45]
    const destination = selected ? focus[selected] : { position: overviewPosition, target: [0, .62, 0] }
    if (selected || transitioning.current) {
      control.enabled = false
      const factor = reducedMotion ? 1 : 3.2
      camera.position.x = THREE.MathUtils.damp(camera.position.x, destination.position[0], factor, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, destination.position[1], factor, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, destination.position[2], factor, delta)
      control.target.x = THREE.MathUtils.damp(control.target.x, destination.target[0], factor, delta)
      control.target.y = THREE.MathUtils.damp(control.target.y, destination.target[1], factor, delta)
      control.target.z = THREE.MathUtils.damp(control.target.z, destination.target[2], factor, delta)
      control.update()
      if (!selected && camera.position.distanceTo(new THREE.Vector3(...overviewPosition)) < .035) transitioning.current = false
    } else {
      control.enabled = true
      const target = pointer.current
      control.target.x = THREE.MathUtils.damp(control.target.x, target.x * .1, 1.4, delta)
      control.target.y = THREE.MathUtils.damp(control.target.y, .62 - target.y * .065, 1.4, delta)
      control.target.z = THREE.MathUtils.damp(control.target.z, 0, 1.4, delta)
      control.update()
    }
  })

  return <OrbitControls ref={controls} enablePan={false} enableZoom={false} enableDamping dampingFactor={.08} minPolarAngle={.62} maxPolarAngle={1.23} minAzimuthAngle={-.22} maxAzimuthAngle={1.14} target={[0, .62, 0]} />
}
