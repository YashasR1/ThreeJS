import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75, 
    innerWidth/innerHeight, 
    0.1, 
    10)

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(innerWidth, innerHeight)

document.body.appendChild(renderer.domElement)

camera.position.z = 8;   

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.03

const geo = new THREE.IcosahedronGeometry(7, 7)
// const geo = new THREE.TorusGeometry(5, 4, 16, 100)
// const geo = new THREE.TorusKnotGeometry(3, 0.8, 100, 16, 2, 3)
// const geo = new THREE.ConeGeometry(2, 5, 32)
// const geo = new THREE.OctahedronGeometry(4, 0)

// const shape = new THREE.Shape();
// shape.moveTo(0, 0);
// shape.lineTo(0, 5);
// shape.quadraticCurveTo(1, 6, 2, 5); // Add a curve
// shape.lineTo(2, 0);
// shape.ellipse(1, 0, 1, 1, 0, Math.PI * 2); // Add a hole

// const extrudeSettings = {
//     steps: 2, // Number of steps along the extrusion depth
//     depth: 2, // How deep to extrude
//     bevelEnabled: true, // Add bevels (rounded edges)
//     bevelThickness: 0.5,
//     bevelSize: 0.5,
//     bevelSegments: 2
// };

// const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)

const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true

})
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
})

const wireMesh = new THREE.Mesh(geo, wireMat)
wireMesh.scale.setScalar(1.001)
mesh.add(wireMesh)

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500)
scene.add(hemiLight)

function animate( t = 0 ){
    requestAnimationFrame(animate)
    // mesh.scale.setScalar(Math.cos(t * 0.001) * 1.0)
    mesh.rotation.y = t * 0.0001
    renderer.render(scene, camera)
    controls.update()
}

animate()