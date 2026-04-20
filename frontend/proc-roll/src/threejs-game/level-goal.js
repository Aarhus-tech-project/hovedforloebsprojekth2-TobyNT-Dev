import * as THREE from 'three';

function GenerateGoal() {
    const geometry = new THREE.CylinderGeometry(3, 0, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const goalCylinder = new THREE.Mesh(geometry, material);

    return goalCylinder;
}

export { GenerateGoal };