import * as THREE from 'three';

export function generateStars(radius, widthSegments, heightSegments) {

    const starFieldGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
    const positions = starFieldGeometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i++) {
        positions[i] += (Math.random() - 0.5) * 200;
    }
    
    const starMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 2});
    
    const stars = new THREE.Points(starFieldGeometry, starMaterial);
    return(stars);
}