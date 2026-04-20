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

    const sphere = new THREE.Mesh( new THREE.SphereGeometry(2, 16, 16), testballTextureMaterial)
    
    return sphere;
}

let velocity = new THREE.Vector3();

function updatePlayerMove(playerPosition) {
    let input = new THREE.Vector3();

    if (userInputState.w) input.z += 0.01;
    if (userInputState.s) input.z -= 0.01;
    if (userInputState.a) input.x += 0.01;
    if (userInputState.d) input.x -= 0.01;

    if (input.lengthSq() > 0) input.normalize();

    const targetVelocity = input.multiplyScalar(0.1);

    velocity.lerp(targetVelocity, 0.1);
    playerPosition.add(velocity);
}

export { createPlayerCharacter, updatePlayerMove };