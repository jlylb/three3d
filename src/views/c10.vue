<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls;

export default {
  methods: {
    initScene() {
      scene = new THREE.Scene();
    },
    initCamera() {
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 0;
      camera.position.y = 0;
      camera.position.x = 0;
      camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);

      scene.add(camera);
    },
    initRender() {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x225f93, 1.0);
    },
    initLight() {
      light = new THREE.AmbientLight(0xffffff);
      light.position.set(0, 0, 0);
      scene.add(light);
    },
    initObjects() {
      const box = new THREE.BoxGeometry(100, 60, 30, 1, 1, 1);
      scene.add(box);
    }
  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObjects();
    this.initRender();
  }
};
</script>

<style>
</style>
