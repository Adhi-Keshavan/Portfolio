import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { WorkspaceObject } from '../../../hooks/useWorkspaceSelection'
import { useWorkspaceStore } from '../../../store/workspaceStore'

const focus = {
  monitor: { position: [0, 2.1, 2.28], target: [0, 2.06, -1.17] },
  keyboard: { position: [0.2, 3.17, 4.05], target: [-.58, .23, 1.15] },
  notebook: { position: [-3.14, 3.13, 3.44], target: [-2.68, .24, .65] },
  phone: { position: [4.28, 2.74, 2.88], target: [2.86, .2, .66] },
} satisfies Record<WorkspaceObject, { position: number[]; target: number[] }>

export function CameraController({ selected, scrollFocus, pointer, reducedMotion, onFocusArrived }: { selected: WorkspaceObject | null; scrollFocus: WorkspaceObject | null; pointer: React.RefObject<{ x: number; y: number }>; reducedMotion: boolean; onFocusArrived: (object: WorkspaceObject) => void }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const moving = useRef(true)
  const { size, camera } = useThree()
  const setCameraPhase = useWorkspaceStore(state => state.setCameraPhase)

  useEffect(() => {
    const control = controls.current
    if (!control) return
    timeline.current?.kill()
    moving.current = true
    control.enabled = false
    control.maxPolarAngle = selected === 'monitor' ? Math.PI / 2 : 1.23
    const compact = size.width < 690
    const overviewPosition = compact ? [9.2, 6.9, 11.5] : [7.6, 5.65, 9.45]
    const destination = selected ? focus[selected] : scrollFocus ? focus[scrollFocus] : { position: overviewPosition, target: [0, .62, 0] }
    const duration = reducedMotion ? 0 : selected === 'monitor' ? 1.3 : selected ? .95 : 1.1
    const motion = gsap.timeline({ onUpdate: () => control.update(), onComplete: () => {
      moving.current = false
      if (selected) onFocusArrived(selected)
      else { setCameraPhase('overview'); control.enabled = true }
    } })
    motion.to(camera.position, { x: destination.position[0], y: destination.position[1], z: destination.position[2], duration, ease: 'power2.inOut' }, 0)
    motion.to(control.target, { x: destination.target[0], y: destination.target[1], z: destination.target[2], duration, ease: 'power2.inOut' }, 0)
    timeline.current = motion
    return () => { motion.kill(); timeline.current = null }
  }, [camera, selected, scrollFocus, size.width, reducedMotion, onFocusArrived, setCameraPhase])

  useFrame((_, delta) => {
    const control = controls.current
    if (!control || moving.current || selected || scrollFocus) return
    const target = pointer.current
    control.target.x = THREE.MathUtils.damp(control.target.x, target.x * .1, 1.4, delta)
    control.target.y = THREE.MathUtils.damp(control.target.y, .62 - target.y * .065, 1.4, delta)
    control.target.z = THREE.MathUtils.damp(control.target.z, 0, 1.4, delta)
    control.update()
  })

  return <OrbitControls ref={controls} enablePan={false} enableZoom={false} enableDamping dampingFactor={.08} minPolarAngle={.62} maxPolarAngle={selected === 'monitor' ? Math.PI / 2 : 1.23} minAzimuthAngle={-.22} maxAzimuthAngle={1.14} target={[0, .62, 0]} />
}
