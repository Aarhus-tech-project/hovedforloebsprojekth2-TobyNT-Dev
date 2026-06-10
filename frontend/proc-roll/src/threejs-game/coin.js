import * as THREE from 'three';

export function generateCoin() {
    const geometry = new THREE.CylinderGeometry(3, 3, 1, 16);
    const material = new THREE.MeshBasicMaterial({color: 0x9497E8})
    const coin = new THREE.Mesh(geometry, material);
    
    return coin;
}