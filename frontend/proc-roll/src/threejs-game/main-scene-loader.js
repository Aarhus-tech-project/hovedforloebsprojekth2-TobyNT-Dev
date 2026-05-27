import * as THREE from 'three'
import textureImg from '../assets/textures/floor-tiles.jpg'

import { createPlayerCharacter, updatePlayerMove, resetPlayerState } from './player.js'
import { generateGoal } from './level-goal.js'
import { playerDied, levelCompleted, gameState } from './game-states.js'

const testTexture = new THREE.TextureLoader().load(textureImg)
testTexture.wrapS = THREE.RepeatWrapping
testTexture.wrapT = THREE.RepeatWrapping
testTexture.magFilter = THREE.NearestFilter
testTexture.minFilter = THREE.NearestFilter
testTexture.repeat.set(4, 4)

const testTextureMaterial = new THREE.MeshStandardMaterial({ map: testTexture })

let playerOnGround = false;
let animationId;

let platforms = [];
let goal = null;

const PLATFORM_COUNT = 11;
const PLATFORM_SIZE = 10;

const raycaster = new THREE.Raycaster();
const down = new THREE.Vector3(0, -1, 0);

//garbage disposal
function disposeObject(obj) {
    if (obj.geometry) obj.geometry.dispose();

    if (obj.material) {
        if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
        } else {
            obj.material.dispose();
        }
    }
}

function generateLevel(scene, playerCharacter) {

    for (let i = 0; i < 11; i++) {
        const plane = new THREE.Mesh( new THREE.PlaneGeometry(10, 10), testTextureMaterial);

        plane.rotation.x = -Math.PI / 2;
        plane.position.z = i * 10;

        scene.add(plane);
        platforms.push(plane);
    }

    goal = generateGoal();
    goal.position.y = 50;
    goal.position.z = 100;

    scene.add(goal);
}

function cleanupLevel(scene) {

    // remove platforms
    platforms.forEach(p => {
        scene.remove(p);
        disposeObject(p);
    });
    platforms = [];

    if (goal) {
        scene.remove(goal);
        disposeObject(goal);
        goal = null;
    }
}

function resetPlayer(playerCharacter) {
    playerCharacter.position.set(0, 2, 0);
    playerCharacter.rotation.set(0, 0, 0);
    resetPlayerState();
}

function onLevelComplete(scene, playerCharacter) {
    console.log("Level Completed!");

    levelCompleted();

    cleanupLevel(scene);
    resetPlayer(playerCharacter);
    generateLevel(scene, playerCharacter);
}

function render3D(target) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    target.innerHTML = '';
    target.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const playerCharacter = createPlayerCharacter();
    playerCharacter.position.y = 2;
    scene.add(playerCharacter);

    generateLevel(scene, playerCharacter);

    camera.position.set(0, 5, 10);

    const cameraOffset = new THREE.Vector3(0, 5, 10);

    function updateCamera() {
        const offset = cameraOffset.clone();
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerCharacter.rotation.y);

        const targetPos = playerCharacter.position.clone().add(offset);

        camera.position.lerp(targetPos, 0.05);
        camera.lookAt(playerCharacter.position);
    }

    let velocityY = 0;

    //main game update loop
    function animate() {

        animationId = requestAnimationFrame(animate);

        raycaster.set(playerCharacter.position, down);
        const intersects = raycaster.intersectObjects(platforms);

        const maxGroundDistance = 2;

        if (intersects.length > 0 && intersects[0].distance <= maxGroundDistance) {
            playerOnGround = true;
        } else {
            playerOnGround = false;
        }

        //basic gravity
        if (!playerOnGround) {
            velocityY -= 0.01;
        } else {
            velocityY = 0;
        }

        playerCharacter.position.y += velocityY;

        if (playerCharacter.position.y < -50) {
            console.log("Level Failed...");
            playerDied();

            cleanupLevel(scene);
            resetPlayer(playerCharacter);
            generateLevel(scene, playerCharacter);
        }

        //Only check x and z distances to the goal
        const distancex = Math.abs(playerCharacter.position.x - goal.position.x);
        const distancez = Math.abs(playerCharacter.position.z - goal.position.z);

        const goalRadius = 2; // tweak this to match pillar width

        if (goal && distancex < goalRadius && distancez < goalRadius) {
            onLevelComplete(scene, playerCharacter);
        }

        if (gameState.value == 1) updatePlayerMove(playerCharacter.position, playerCharacter);
        if (gameState.value == 1) updateCamera();

        renderer.render(scene, camera);
    }

    animate();

    //cleanup
    return () => {

        cancelAnimationFrame(animationId);

        cleanupLevel(scene);

        scene.traverse(obj => disposeObject(obj));

        testTexture.dispose();
        testTextureMaterial.dispose();

        renderer.dispose();
        renderer.domElement.remove();
    }
}

export default render3D;