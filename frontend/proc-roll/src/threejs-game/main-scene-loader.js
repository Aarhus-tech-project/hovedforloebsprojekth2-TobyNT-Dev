import * as THREE from 'three'
import textureImg from '../assets/textures/test-texture2.png'
// fx
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// references
import { createPlayerCharacter, updatePlayerMove, resetPlayerState } from './player.js'
import { generateGoal } from './level-goal.js'
import { playerDied, levelCompleted, gameState, currentLevel } from './game-states.js'
import { generateStars } from './star-generation.js'

const testTexture = new THREE.TextureLoader().load(textureImg)
testTexture.wrapS = THREE.RepeatWrapping
testTexture.wrapT = THREE.RepeatWrapping
testTexture.magFilter = THREE.NearestFilter
testTexture.minFilter = THREE.NearestFilter
testTexture.repeat.set(4, 4)

const platformMaterial = new THREE.MeshStandardMaterial({ map: testTexture })

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

    for (let i = 0; i < PLATFORM_COUNT; i++) {
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(PLATFORM_SIZE, PLATFORM_SIZE), platformMaterial);

        plane.rotation.x = -Math.PI / 2;
        plane.position.z = i * PLATFORM_SIZE;

        scene.add(plane);
        platforms.push(plane);

        if (i == PLATFORM_COUNT - 1) {
            goal = generateGoal();
            goal.position.y = plane.position.y;
            goal.position.z = plane.position.z;

            scene.add(goal);
        }
    }
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

const star1mat = new THREE.PointsMaterial({ color: 0xffffff })
const star1 = new THREE.Mesh(new THREE.SphereGeometry(70, 64, 64), star1mat);
const star2mat = new THREE.PointsMaterial({ color: 0xffffff })
const star2 = new THREE.Mesh(new THREE.SphereGeometry(70, 64, 64), star2mat);
const star3mat = new THREE.PointsMaterial({ color: 0xffffff })
const star3 = new THREE.Mesh(new THREE.SphereGeometry(70, 64, 64), star3mat);
const star4mat = new THREE.PointsMaterial({ color: 0xffffff })
const star4 = new THREE.Mesh(new THREE.SphereGeometry(70, 64, 64), star4mat);




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
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    scene.add(generateStars(1500, 64, 64))
    scene.add(generateStars(1200, 48, 48))
    scene.add(generateStars(1050, 32, 32))

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Bloom effect
    const composer = new EffectComposer(renderer);
    composer.addPass(
        new RenderPass(scene, camera)
    );
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        30.5, // strength
        1.4, // radius
        0.85 // threshold
    );
    composer.addPass(bloomPass);
    // -

    target.innerHTML = '';
    target.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffffff);
    scene.add(ambientLight);

    const playerCharacter = createPlayerCharacter();
    playerCharacter.position.y = 2;
    scene.add(playerCharacter);

    generateLevel(scene, playerCharacter);

    camera.position.set(0, 5, 10);

    const cameraOffset = new THREE.Vector3(0, 5, -10);

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

        if (playerCharacter.position.y < -2000) {
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
        platformMaterial.dispose();

        renderer.dispose();
        renderer.domElement.remove();
    }
}

export default render3D;