import * as THREE from 'three';

function generateGoal() {
    const geometry = new THREE.CylinderGeometry(4, 4, 100, 16);
    const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.3 })
    const goalCylinder = new THREE.Mesh(geometry, material);

    return goalCylinder;
}

export { generateGoal };