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
import { generateCoin } from './coin.js'

const testTexture = new THREE.TextureLoader().load(textureImg)
testTexture.wrapS = THREE.RepeatWrapping
testTexture.wrapT = THREE.RepeatWrapping
testTexture.magFilter = THREE.NearestFilter
testTexture.minFilter = THREE.NearestFilter
testTexture.repeat.set(2, 2)
testTexture.colorSpace = THREE.SRGBColorSpace

const platformMaterial = new THREE.MeshStandardMaterial({ map: testTexture })

let playerOnGround = false;
let playerResetPosition;
let animationId;

let platforms = [];
let coins = [];
let goal = null;

const STARTING_PLATFORM_COUNT = 8;
const PLATFORM_SIZE = 10;

let PLATFORM_COUNT;

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
async function updateUser(mode, amount) {
    let endpoint;
    let body;
    let userId = sessionStorage.getItem("token");

    if (mode == "highscore") {
        endpoint = `http://localhost:5263/api/User/${userId}/highscore`;
        body = { "score": amount }
    }

    if (mode == "balance") {
        endpoint = `http://localhost:5263/api/User/${userId}/balance/add`;
        body = { "amount": amount }
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    return(response);
}

async function getHighScore() {
    let userId = sessionStorage.getItem("token");
    let endpoint = `http://localhost:5263/api/User/${userId}`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


function generateLevel(scene, playerCharacter) {
    PLATFORM_COUNT = STARTING_PLATFORM_COUNT + currentLevel.value; // level length
    //making sure every iteration has starting point of 0 x & 0 z
    let x = 0;
    let z = 0;

    let dir = 0;
    for (let i = 0; i < PLATFORM_COUNT; i++) {

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(PLATFORM_SIZE, PLATFORM_SIZE),
            platformMaterial
        );

        plane.rotation.x = -Math.PI / 2;
        plane.position.set(x, 0, z);

        scene.add(plane);
        platforms.push(plane);

        // % wraps the direction, to normalize to desired direction
        if (Math.random() < 0.2) {
            if (Math.random() < 0.5) {
                dir = (dir + 1) % 4; // turn right
            } else {
                dir = (dir + 3) % 4; // turn left
            }
        }
        //determine direction based off dir:   forward z+ (dir = 0) | back z- (dir = 2) | right x+ (dir = 1) | left x- (dir = 3)
        if (dir === 0) z += PLATFORM_SIZE;
        if (dir === 1) x += PLATFORM_SIZE;
        if (dir === 2) z -= PLATFORM_SIZE;
        if (dir === 3) x -= PLATFORM_SIZE;

        //placing goal on last platform
        if (i == PLATFORM_COUNT - 1) {
            goal = generateGoal();
            goal.position.y = plane.position.y + 60;
            goal.position.z = plane.position.z;
            goal.position.x = plane.position.x;

            scene.add(goal);
        //random chance to spawn coin on each platorm
        } else if (Math.floor(Math.random() * 11) > 8 && i > 2) {
            const coin = generateCoin();
            coin.rotation.x = -Math.PI / 2;
            coin.position.x = plane.position.x;
            coin.position.z = plane.position.z;
            coin.position.y = plane.position.y + 2;

            scene.add(coin)
            coins.push(coin)
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

    coins.forEach(p => {
        scene.remove(p);
        disposeObject(p);
    });
    coins = [];

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
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    // array of generated star groups
    let stars = [];

    let genStar = generateStars(1500, 64, 64);
    scene.add(genStar)
    stars.push(genStar)

    genStar = generateStars(1200, 48, 48)
    scene.add(genStar)
    stars.push(genStar)

    genStar = generateStars(1050, 32, 32)
    scene.add(genStar)
    stars.push(genStar)

    genStar = generateStars(350, 32, 32)
    scene.add(genStar)
    stars.push(genStar)

    stars.forEach(star => {
        star.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.00004,
            y: (Math.random() - 0.5) * 0.00004,
            z: (Math.random() - 0.5) * 0.00004
        };
    });

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Bloom effect
    const composer = new EffectComposer(renderer);
    composer.addPass(
        new RenderPass(scene, camera)
    );
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.2, // strength
        0.8, // radius
        0.8 // threshold
    );
    composer.addPass(bloomPass);
    // -

    target.innerHTML = '';
    target.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 10, 0);
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

        stars.forEach(star => {
            star.rotation.x += star.userData.rotationSpeed.x;
            star.rotation.y += star.userData.rotationSpeed.y;
            star.rotation.z += star.userData.rotationSpeed.z;
        });

        // animate each coin and check if picked up
        for (let i = coins.length - 1; i >= 0; i--) {
            const coin = coins[i];

            coin.rotation.z += 0.01;


            // player distance to coins
            const distancex = Math.abs(playerCharacter.position.x - coin.position.x);
            const distancez = Math.abs(playerCharacter.position.z - coin.position.z);

            const coinRadius = 2; // coin pickup range

            //------------------------------- COIN PICKED UP-------------------------------
            if (distancex < coinRadius && distancez < coinRadius) {
                scene.remove(coin);

                coin.geometry.dispose();
                coin.material.dispose();

                coins.splice(i, 1);

                updateUser("balance", 1)
            }
        }

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

        //x and z distance to goal
        const distancex = Math.abs(playerCharacter.position.x - goal.position.x);
        const distancez = Math.abs(playerCharacter.position.z - goal.position.z);

        const goalRadius = 2; // tweak this to match pillar width

        if (goal && distancex < goalRadius && distancez < goalRadius) {
            getHighScore();
            // updateUser("highscore", )
            onLevelComplete(scene, playerCharacter);
        }

        if (gameState.value == 1) updatePlayerMove(playerCharacter.position, playerCharacter);
        if (gameState.value == 1) updateCamera();

        composer.render();
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