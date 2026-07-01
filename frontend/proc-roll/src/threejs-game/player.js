import * as THREE from 'three';

import ballTextureImg from '../assets/textures/test-texture-ball.png'
import userInputState from './input-states.js'

const testballTexture = new THREE.TextureLoader().load(ballTextureImg)
const testballTextureMaterial = new THREE.MeshStandardMaterial({ map: testballTexture })
testballTexture.wrapS = THREE.RepeatWrapping
testballTexture.wrapT = THREE.RepeatWrapping
testballTexture.magFilter = THREE.NearestFilter
testballTexture.minFilter = THREE.NearestFilter
testballTexture.repeat.set(3, 2)
testballTexture.colorSpace = THREE.SRGBColorSpace

const ballRadius = 2;

let velocity = new THREE.Vector3();
let playerYaw = 0;

const timer = new THREE.Timer();
const delta = timer.getDelta();

function createPlayerCharacter() {
    const visualSphere = new THREE.Mesh( new THREE.SphereGeometry(ballRadius, 64, 64), testballTextureMaterial );
    const physSphere = new THREE.Mesh( new THREE.SphereGeometry(ballRadius, 64, 64), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    
    physSphere.add(visualSphere);

    physSphere.userData.visual = visualSphere;

    return physSphere;
}

function updatePlayerMove(playerPosition, playerMesh) {
    //Rotate ball
    if (userInputState.a) playerYaw += 0.06;
    if (userInputState.d) playerYaw -= 0.06;

    playerMesh.rotation.y = playerYaw;
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
    //Throttle / reverse
    let inputStrength = 0;
    if (userInputState.w) inputStrength -= 3;
    if (userInputState.s) inputStrength += 3;

    const targetVelocity = forward.multiplyScalar(inputStrength * 0.12);
    velocity.lerp(targetVelocity, 0.08);
    const deltaMove = velocity.clone();
    playerPosition.add(deltaMove);
    const visualSphere = playerMesh.userData.visual;

    if (visualSphere) {
        const speed = velocity.length();
        const direction = Math.sign(inputStrength);
        const rotationAmount = speed * -direction;
        visualSphere.rotation.x += rotationAmount;
    }
}

function resetPlayerState() {
    velocity.set(0, 0, 0);
    playerYaw = 0;
}

export { createPlayerCharacter, updatePlayerMove, resetPlayerState };