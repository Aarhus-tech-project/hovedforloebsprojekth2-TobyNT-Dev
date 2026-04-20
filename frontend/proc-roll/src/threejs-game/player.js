import * as THREE from 'three';

import ballTextureImg from '../assets/textures/test-texture.png'
import userInputState from './input-states.js'

const testballTexture = new THREE.TextureLoader().load(ballTextureImg)
const testballTextureMaterial = new THREE.MeshStandardMaterial({ map: testballTexture })
testballTexture.wrapS = THREE.RepeatWrapping
testballTexture.wrapT = THREE.RepeatWrapping
testballTexture.magFilter = THREE.NearestFilter
testballTexture.minFilter = THREE.NearestFilter
testballTexture.repeat.set(4, 4)


function createPlayerCharacter() {
    const transparentMaterial = new THREE.MeshBasicMaterial(false);

    const visualSphere = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), testballTextureMaterial);

    const physSphere = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), transparentMaterial)

    physSphere.add(visualSphere);

    return physSphere;
}

let velocity = new THREE.Vector3();

let playerYaw = 0;

const BALL_RADIUS = 2;

function updatePlayerMove(playerPosition, playerMesh) {

    if (userInputState.a) playerYaw += 0.015;
    if (userInputState.d) playerYaw -= 0.015;

    playerMesh.rotation.y = playerYaw;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);

    let inputStrength = 0;
    if (userInputState.w) inputStrength += 1;
    if (userInputState.s) inputStrength -= 1;

    const targetVelocity = forward.multiplyScalar(inputStrength * 0.1);
    velocity.lerp(targetVelocity, 0.01);

    const deltaMove = velocity.clone();
    playerPosition.add(deltaMove);
}
// function updatePlayerMove(playerPosition, playerMesh) {
//     if (userInputState.a) playerYaw += 0.015;
//     if (userInputState.d) playerYaw -= 0.015;
//     // Don't rotate playerMesh — remove this line:
//     // playerMesh.rotation.y = playerYaw;
//     const forward = new THREE.Vector3(0, 0, -1);
//     forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
//     let inputStrength = 0;
//     if (userInputState.w) inputStrength += 1;
//     if (userInputState.s) inputStrength -= 1;
//     const targetVelocity = forward.clone().multiplyScalar(inputStrength * 0.1);
//     velocity.lerp(targetVelocity, 0.01);
//     const deltaMove = velocity.clone();
//     playerPosition.add(deltaMove);
//     const visual = playerMesh.children[0];
//     const distance = deltaMove.length();
    
// }

export { createPlayerCharacter, updatePlayerMove };