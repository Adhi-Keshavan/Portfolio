import * as THREE from 'three'

function canvas(size: number) {
  const element = document.createElement('canvas')
  element.width = size
  element.height = size
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
  const { element, context: c } = canvas(1024)
  c.fillStyle = '#07111d'; c.fillRect(0, 0, 1024, 1024)
  const glow = c.createRadialGradient(750, 350, 0, 750, 350, 600)
  glow.addColorStop(0, '#163b60'); glow.addColorStop(1, '#07111d')
  c.fillStyle = glow; c.fillRect(0, 0, 1024, 1024)
  c.fillStyle = '#0d1a29'; c.fillRect(0, 0, 1024, 62)
  c.fillStyle = '#70c6ef'; c.font = '700 21px Arial'; c.fillText('AK.', 36, 40)
  c.fillStyle = '#8da9bc'; c.font = '14px Arial'; c.fillText('WORKSPACE  /  SELECTED PROJECTS', 125, 38)
  c.fillStyle = '#1c425b'; c.fillRect(0, 62, 195, 962)
  ;['OVERVIEW', 'PROJECTS', 'SKILLS', 'ABOUT', 'CONTACT'].forEach((item, i) => {
    if (i === 1) { c.fillStyle = '#295d79'; c.fillRect(14, 125 + i * 65, 166, 44) }
    c.fillStyle = i === 1 ? '#ddf5ff' : '#8ca6b8'; c.font = '15px Arial'; c.fillText(item, 28, 154 + i * 65)
  })
  c.fillStyle = '#6dcceb'; c.font = '15px Arial'; c.fillText('PROJECT EXPLORER  /  03 WORKS', 240, 132)
  c.fillStyle = '#f2f8fc'; c.font = '700 56px Arial'; c.fillText('Things I have built.', 240, 211)
  c.fillStyle = '#9bb2c5'; c.font = '19px Arial'; c.fillText('Systems, interfaces and decisions behind the work.', 240, 254)
  const cards = [
    ['01', 'AITIZEN REALM', '#5cb8e8', '3D WEB EXPERIENCE'],
    ['02', 'PAYREADY INDIA', '#52cdb5', 'FULL STACK PROTOTYPE'],
    ['03', 'PRESSURE PERFORMANCE', '#b39deb', 'DATA ANALYTICS'],
  ]
  cards.forEach(([number, title, accent, type], i) => {
    const y = 322 + i * 203
    c.fillStyle = '#112438'; c.fillRect(235, y, 730, 175)
    c.fillStyle = accent; c.fillRect(235, y, 5, 175)
    c.fillStyle = '#80a1b8'; c.font = '14px Arial'; c.fillText(`PROJECT / ${number}`, 267, y + 40)
    c.fillStyle = '#f6fbff'; c.font = '700 35px Arial'; c.fillText(title, 267, y + 93)
    c.fillStyle = accent; c.font = '16px Arial'; c.fillText(type, 267, y + 133)
    c.strokeStyle = '#467089'; c.strokeRect(858, y + 61, 60, 48)
    c.fillStyle = '#cceafa'; c.font = '30px Arial'; c.fillText('↗', 874, y + 96)
  })
  const texture = new THREE.CanvasTexture(element)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function createPhoneTexture() {
  const { element, context: c } = canvas(512)
  const gradient = c.createLinearGradient(0, 0, 512, 512)
  gradient.addColorStop(0, '#0b2440'); gradient.addColorStop(1, '#07121f')
  c.fillStyle = gradient; c.fillRect(0, 0, 512, 512)
  c.fillStyle = '#8ed8f2'; c.font = '700 45px Arial'; c.fillText('AK.', 50, 90)
  c.fillStyle = '#d5f0f9'; c.font = '700 30px Arial'; c.fillText('Let’s connect.', 50, 210)
  c.fillStyle = '#91b2c8'; c.font = '22px Arial'; c.fillText('Open to opportunities', 50, 252)
  ;['EMAIL', 'LINKEDIN', 'GITHUB'].forEach((item, i) => {
    c.fillStyle = i === 0 ? '#1f5c7b' : '#15354e'; c.fillRect(48, 300 + i * 58, 416, 48)
    c.fillStyle = '#d2edf8'; c.font = '20px Arial'; c.fillText(item, 66, 332 + i * 58)
  })
  const texture = new THREE.CanvasTexture(element)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
