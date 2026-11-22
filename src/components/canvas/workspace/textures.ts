import * as THREE from 'three'

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
  c.fillStyle = '#1b1b1b'; c.fillRect(0, 0, 2048, 1108)
  const glow = c.createRadialGradient(1520, 430, 50, 1520, 430, 1200)
  glow.addColorStop(0, '#78563d'); glow.addColorStop(.58, '#352920'); glow.addColorStop(1, '#1b1b1b')
  c.fillStyle = glow; c.fillRect(0, 0, 2048, 1108)
  c.fillStyle = '#d97736'; c.fillRect(112, 118, 106, 8)
  c.fillStyle = '#f4f1ea'; c.font = '700 65px Arial'; c.fillText('AK', 112, 210)
  c.fillStyle = '#c6b6a9'; c.font = '28px Arial'; c.fillText('ADHI KESHAVAN B  /  SOFTWARE DEVELOPER', 112, 265)
  c.fillStyle = '#f4f1ea'; c.font = '700 230px Arial'; c.fillText('DESK.OS', 102, 635)
  c.fillStyle = '#dba575'; c.font = '32px Arial'; c.fillText('A personal digital workspace.', 112, 705)
  c.strokeStyle = '#b9927366'; c.lineWidth = 2
  c.beginPath(); c.moveTo(112, 788); c.lineTo(1936, 788); c.stroke()
  c.fillStyle = '#d0c4ba'; c.font = '26px Arial'; c.fillText('PROJECTS     /     TERMINAL     /     ABOUT     /     SKILLS     /     CONTACT', 112, 848)
  c.fillStyle = '#d97736'; c.font = '25px Arial'; c.fillText('SELECT THE MONITOR TO ENTER', 112, 1010)
  c.strokeStyle = '#d97736'; c.lineWidth = 4; c.strokeRect(1660, 895, 260, 100)
  c.fillStyle = '#f4f1ea'; c.font = '700 48px Arial'; c.fillText('ENTER', 1715, 961)
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
