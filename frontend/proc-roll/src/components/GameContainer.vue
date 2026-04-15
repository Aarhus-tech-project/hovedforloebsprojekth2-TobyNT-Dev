<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import textureImg from '../assets/textures/test-texture.png';

const target = ref(null);

const testTextureMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(textureImg) });

testTextureMaterial.map.wrapS = THREE.RepeatWrapping;
testTextureMaterial.map.wrapT = THREE.RepeatWrapping;
testTextureMaterial.magFilter = THREE.NearestFilter;
testTextureMaterial.minFilter = THREE.NearestFilter;
testTextureMaterial.map.repeat.set(8, 8);

onMounted(() => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  target.value.appendChild(renderer.domElement);
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const plane = new THREE.Mesh(planeGeometry, testTextureMaterial);
  scene.add(plane);
  plane.rotation.x = -Math.PI / 2;
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const sphere = new THREE.Mesh(geometry, testTextureMaterial);
  scene.add(sphere);
  sphere.position.y = 1;

  camera.position.y = 4;
  camera.position.z = 8;

  camera.lookAt(0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.x -= 0.01;
    plane.rotation.z += 0.001;

    renderer.render(scene, camera);
  }

  animate();
});
</script>

<template>
  <div ref="target"></div>
</template>