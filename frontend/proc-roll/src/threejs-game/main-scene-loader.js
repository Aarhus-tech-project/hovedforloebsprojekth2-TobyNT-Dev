import * as THREE from 'three'
import textureImg from '../assets/textures/floor-tiles.jpg'

import { createPlayerCharacter, updatePlayerMove } from './player.js'

import { generateGoal } from './level-goal.js'

import { playerDied, levelCompleted } from './game-states.js'

const testTexture = new THREE.TextureLoader().load(textureImg)
const testTextureMaterial = new THREE.MeshStandardMaterial({ map: testTexture })
testTexture.wrapS = THREE.RepeatWrapping
testTexture.wrapT = THREE.RepeatWrapping
testTexture.magFilter = THREE.NearestFilter
testTexture.minFilter = THREE.NearestFilter
testTexture.repeat.set(4, 4)

let playerOnGround = false;
let levelDone = false;

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

    const platforms = [];

    for (let i = 0; i < 11; i++) {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            testTextureMaterial
        );

        plane.rotation.x = -Math.PI / 2;
        plane.position.z = i * 10;

        scene.add(plane);
        platforms.push(plane);
    }

    const playerCharacter = createPlayerCharacter();
    playerCharacter.position.y = 2
    scene.add(playerCharacter)
    const goal = generateGoal();
    goal.position.y = 50;
    goal.position.z = 100;
    scene.add(goal);
    const goalPosition = new THREE.Vector3(goal.position.x, playerCharacter.position.y, goal.position.z)

    camera.position.set(0, -6, -8)
    camera.lookAt(0, 0, 0)

    const cameraOffset = new THREE.Vector3(0, 5, 10);
    function updateCamera(playerMesh, camera) {

        const behindOffset = cameraOffset.clone();

        behindOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerMesh.rotation.y);

        const targetPos = playerMesh.position.clone().add(behindOffset);

        camera.position.lerp(targetPos, 0.1);
        camera.lookAt(playerMesh.position);
    }


    let animationId

    //Main Game Update Loop
    function animate() {

        // if level done -> exit the animation loop
        if (levelDone) return;

        animationId = requestAnimationFrame(animate)

        const raycaster = new THREE.Raycaster();
        const down = new THREE.Vector3(0, -1, 0);
        raycaster.set(playerCharacter.position, down);

        const intersects = raycaster.intersectObjects(platforms);

        const maxGroundDistance = 2;

        if (intersects.length > 0) {
            const distance = intersects[0].distance;

            if (distance <= maxGroundDistance) {
                playerOnGround = true;
            } else {
                playerOnGround = false;
            }
        } else {
            playerOnGround = false;
        }

        if (!playerOnGround) {
            playerCharacter.position.y -= 0.15;
        }

        if (playerCharacter.position.y < -50) {
            console.log("Level Failed...")
            levelDone = true;
            playerDied()
        }

        if (playerCharacter.position.distanceTo(goalPosition) < 2) {
            console.log("Level Completed!");
            levelDone = true;
            levelCompleted();
        }

        updatePlayerMove(playerCharacter.position, playerCharacter);
        updateCamera(playerCharacter, camera);

        console.log(playerCharacter.position)
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