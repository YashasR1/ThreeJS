import gsap from 'gsap'
import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'
import atmospherevertex from './shaders/atmosphereVertex.glsl?raw'
import atmospherefragment from './shaders/atmosphereFragment.glsl?raw'

const canvasContainer = document.querySelector('#canvasContainer')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth/
    canvasContainer.offsetHeight,
    0.1,
    1000)
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('canvas')
})

renderer.setSize(canvasContainer.offsetWidth,canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5,50,50),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load(
                    '/earth-map.jpg')
            }
        }
    }))

scene.add(sphere)

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5,50,50),
    new THREE.ShaderMaterial({
        vertexShader: atmospherevertex,
        fragmentShader: atmospherefragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide 
    }))

atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

// --- IoT Cyber Theme Additions ---
const serverNodes = []
const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8)
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 })

for (let i = 0; i < 30; i++) {
    const phi = Math.acos(-1 + (2 * i) / 30)
    const theta = Math.sqrt(30 * Math.PI) * phi
    
    const r = 5.01 
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
    node.position.set(x, y, z)
    sphere.add(node)
    serverNodes.push(node.position)
}

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.5 })
const lines = []

for (let i = 0; i < serverNodes.length; i++) {
    for (let j = i + 1; j < serverNodes.length; j++) {
        const dist = serverNodes[i].distanceTo(serverNodes[j])
        if (dist > 1 && dist < 4) {
            const start = serverNodes[i]
            const end = serverNodes[j]
            const midPoint = start.clone().lerp(end, 0.5).normalize().multiplyScalar(5.5)
            
            const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end)
            const points = curve.getPoints(20)
            const curveGeometry = new THREE.BufferGeometry().setFromPoints(points)
            
            const line = new THREE.Line(curveGeometry, lineMaterial)
            sphere.add(line)
            lines.push(line)
        }
    }
}

const piGeometry = new THREE.SphereGeometry(0.1, 16, 16)
const piMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc })
const piNodes = []

for (let i = 0; i < 5; i++) {
    const phi = Math.random() * Math.PI
    const theta = Math.random() * Math.PI * 2
    
    const r = 6.5 + Math.random() * 1.5
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    
    const piNode = new THREE.Mesh(piGeometry, piMaterial)
    piNode.position.set(x, y, z)
    sphere.add(piNode)
    piNodes.push(piNode)
    
    const targetServer = serverNodes[Math.floor(Math.random() * serverNodes.length)]
    
    const lineGeo = new THREE.BufferGeometry().setFromPoints([piNode.position, targetServer])
    const piLineMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 })
    const piLine = new THREE.Line(lineGeo, piLineMat)
    sphere.add(piLine)
    lines.push(piLine)
}
// --- End IoT Cyber Theme Additions ---

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff
    })

const starVertices = []
for(let i = 0; i < 10000; i++){
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = -Math.random() * 2000
    starVertices.push(x, y, z)
}

starGeometry.setAttribute('position', 
    new THREE.Float32BufferAttribute(starVertices,3))

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)


camera.position.z = 15

const mouse = {
    x: undefined,
    y: undefined
}



function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
    sphere.rotation.y += 0.003
    gsap.to(group.rotation, {
        x: -mouse.y * 0.5,
        y: mouse.x * 0.5,
        duration: 1
    })
    
    // --- IoT Cyber Theme Animations ---
    const time = Date.now() * 0.003
    lines.forEach((line, i) => {
        line.material.opacity = 0.2 + Math.sin(time + i) * 0.3
    })
    
    piNodes.forEach((piNode, i) => {
        const scale = 1 + Math.sin(time + i) * 0.3
        piNode.scale.set(scale, scale, scale)
    })
}

animate()



addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})