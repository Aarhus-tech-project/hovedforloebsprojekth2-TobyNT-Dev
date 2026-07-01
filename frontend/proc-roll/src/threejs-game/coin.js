import * as THREE from 'three';


export function generateCoin() {
    const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 4);
    const material = new THREE.MeshStandardMaterial({color: 0x9497E8, emissive: 0x9497E8, emissiveIntensity: 1.5})
    const coin = new THREE.Mesh(geometry, material);
    
    return coin;
}