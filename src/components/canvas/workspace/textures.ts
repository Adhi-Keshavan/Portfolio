import * as THREE from 'three'
import { projects } from '../../../data/portfolio'

function canvas(size: number, height = size) {
  const element = document.createElement('canvas')
  element.width = size
  element.height = height
  return { element, context: element.getContext('2d')! }
}

export function createWoodTexture() {
  const { element, context } = canvas(512)
  context.fillStyle = '#342820'
  context.fillRect(0, 0, 512, 512)
  let seed = 73
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let i = 0; i < 1150; i++) {
    const y = random() * 512
    context.strokeStyle = random() > .46 ? `rgba(133,93,62,${random() * .11})` : `rgba(7,5,4,${random() * .16})`
    context.lineWidth = .4 + random() * 2.2
    context.beginPath()
    context.moveTo(-20, y)
    context.bezierCurveTo(150, y + random() * 9 - 4, 340, y + random() * 9 - 4, 530, y + random() * 10 - 5)
    context.stroke()
  }
  const texture = new THREE.CanvasTexture(element)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.anisotropy = 4
  return texture
}

export function createMonitorTexture() {
  const { element, context: c } = canvas(2048, 1108)
  c.fillStyle = '#171717'; c.fillRect(0, 0, 2048, 1108)
  const glow = c.createRadialGradient(1570, 320, 0, 1570, 320, 1100)
  glow.addColorStop(0, '#3b2d24'); glow.addColorStop(1, '#171717')
  c.fillStyle = glow; c.fillRect(0, 0, 2048, 1108)
  c.fillStyle = '#252525'; c.fillRect(0, 0, 2048, 112)
  c.fillStyle = '#d97736'; c.font = '700 44px Arial'; c.fillText('AK.', 54, 75)
  c.fillStyle = '#d6cec6'; c.font = '26px Arial'; c.fillText('THE LIVING WORKSPACE  /  PROJECTS', 240, 71)
  c.fillStyle = '#24211e'; c.fillRect(0, 112, 330, 996)
  ;['OVERVIEW', 'PROJECTS', 'SKILLS', 'ABOUT', 'CONTACT'].forEach((item, i) => {
    if (i === 1) { c.fillStyle = '#6d432b'; c.fillRect(24, 208 + i * 95, 282, 68) }
    c.fillStyle = i === 1 ? '#f5f3ee' : '#b1a49a'
    c.font = '600 27px Arial'; c.fillText(item, 48, 254 + i * 95)
  })
  c.fillStyle = '#d97736'; c.font = '26px Arial'; c.fillText(`PROJECT EXPLORER  /  ${String(projects.length).padStart(2, '0')} WORKS`, 390, 180)
  c.fillStyle = '#f5f3ee'; c.font = '700 72px Arial'; c.fillText('Selected work.', 390, 264)
  c.fillStyle = '#c3b6ab'; c.font = '29px Arial'; c.fillText('Select the monitor to open project details and case studies.', 390, 316)
  projects.forEach((project, i) => {
    const x = 390
    const y = 352 + i * 242
    c.fillStyle = '#302a25'; c.fillRect(x, y, 1580, 224)
    c.fillStyle = project.accent; c.fillRect(x, y, 8, 224)
    c.fillStyle = '#c3aa95'; c.font = '25px Arial'; c.fillText(`PROJECT / ${project.number}`, x + 42, y + 47)
    c.fillStyle = project.accent; c.font = '24px Arial'; c.fillText(project.stack.slice(0, 3).join('  ·  '), x + 780, y + 47)
    c.fillStyle = '#f5f3ee'; c.font = '700 54px Arial'; c.fillText(project.title, x + 42, y + 112)
    c.fillStyle = '#d0c5bb'; c.font = '29px Arial'
    const words = project.summary.split(' ')
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      const next = line ? `${line} ${word}` : word
      if (c.measureText(next).width > 1450 && line) { lines.push(line); line = word } else line = next
    }
    if (line) lines.push(line)
    lines.slice(0, 2).forEach((text, lineIndex) => c.fillText(text, x + 42, y + 159 + lineIndex * 36))
  })
  const texture = new THREE.CanvasTexture(element)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

export function createPhoneTexture() {
  const { element, context: c } = canvas(512)
  const gradient = c.createLinearGradient(0, 0, 512, 512)
  gradient.addColorStop(0, '#5a3d2b'); gradient.addColorStop(1, '#201b18')
  c.fillStyle = gradient; c.fillRect(0, 0, 512, 512)
  c.fillStyle = '#e9a16b'; c.font = '700 45px Arial'; c.fillText('AK.', 50, 90)
  c.fillStyle = '#f5f3ee'; c.font = '700 30px Arial'; c.fillText('Let’s connect.', 50, 210)
  c.fillStyle = '#d0b7a3'; c.font = '22px Arial'; c.fillText('Open to opportunities', 50, 252)
  ;['EMAIL', 'LINKEDIN', 'GITHUB'].forEach((item, i) => {
    c.fillStyle = i === 0 ? '#754729' : '#463126'; c.fillRect(48, 300 + i * 58, 416, 48)
    c.fillStyle = '#f5f3ee'; c.font = '20px Arial'; c.fillText(item, 66, 332 + i * 58)
  })
  const texture = new THREE.CanvasTexture(element)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
