import * as THREE from 'three';

function generateGoal() {
    const geometry = new THREE.CylinderGeometry(4, 4, 120, 16, 40);
    const material = new THREE.MeshBasicMaterial({color: 0x9497E8, transparent: true, opacity: 0.2 })
    const goalCylinder = new THREE.Mesh(geometry, material);

    return goalCylinder;
}

export { generateGoal };