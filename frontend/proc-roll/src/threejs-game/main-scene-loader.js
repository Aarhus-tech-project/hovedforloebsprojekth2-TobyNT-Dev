import * as THREE from 'three'
import textureImg from '../assets/textures/floor-tiles.jpg'

import { createPlayerCharacter, updatePlayerMove } from './player.js'

import { GenerateGoal } from './level-goal.js'

const testTexture = new THREE.TextureLoader().load(textureImg)
const testTextureMaterial = new THREE.MeshStandardMaterial({ map: testTexture })
testTexture.wrapS = THREE.RepeatWrapping
testTexture.wrapT = THREE.RepeatWrapping
testTexture.magFilter = THREE.NearestFilter
testTexture.minFilter = THREE.NearestFilter
testTexture.repeat.set(4, 4)

function render3D(target) {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5).normalize()
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  target.innerHTML = ''
  target.appendChild(renderer.domElement)

  for (let i = 0; i < 11; i++) {
      const plane = new THREE.Mesh( new THREE.PlaneGeometry(10, 10), testTextureMaterial)
      plane.rotation.x = -Math.PI / 2
      plane.position.z = i * 10;
      scene.add(plane)
  }

  const playerCharacter = createPlayerCharacter();
  playerCharacter.position.y = 2
  scene.add(playerCharacter)

  const goal = new GenerateGoal();
  goal.position.y = 50;
  goal.position.z = 100;
  scene.add(goal);

  camera.position.set(0, 6, 8)
  camera.lookAt(0, 0, 0)

  let animationId

  function animate() {
    animationId = requestAnimationFrame(animate)
    
    updatePlayerMove(playerCharacter.position);

    const cameraOffset = new THREE.Vector3(0, 5, -10);
    const targetPosition = playerCharacter.position.clone().add(cameraOffset);
    camera.position.lerp(targetPosition, 0.01);
    camera.lookAt(playerCharacter.position);

    renderer.render(scene, camera)
  }

  animate()

  return () => {
    cancelAnimationFrame(animationId)
    renderer.dispose()
    renderer.domElement.remove()
    scene.clear()
  }
}

export default render3D