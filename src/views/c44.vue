<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import { CubemapGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";

let scene, camera, renderer, light, controls;

const TWEEN = require("@tweenjs/tween.js");

import dat from "dat.gui";

var cube, sphere, torus, material;
var count = 0,
  cubeCamera1,
  cubeCamera2;
var onPointerDownPointerX,
  onPointerDownPointerY,
  onPointerDownLon,
  onPointerDownLat;
var lon = 0,
  lat = 0;
var phi = 0,
  theta = 0;

let clock = new THREE.Clock();

export default {
  components: {},
  data() {
    return {
      camera: null
    };
  },

  methods: {
    initScene() {
      scene = new THREE.Scene({ antialias: true });
    },
    initCamera() {
      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );

      camera.position.set(0, 0, 1000);

      controls = new OrbitControls(camera);

      scene.add(camera);
    },
    initRender() {
      var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      //scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      // renderer.autoClear = false;
      // renderer.gammaOutput = true;
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x000040, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;
    },
    initLight() {
      light = new THREE.AmbientLight(0xffffff);
      light.position.set(0, 0, 0);

      scene.add(light);
      // var light2 = new THREE.PointLight(0xffffff);

      // light2.position.set(0, 350, 0);

      // scene.add(light2);
    },

    initObjects() {
      this.addCube();
    },
    init(texture) {
      // background
      var options = {
        resolution: 1024,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter
      };
      scene.background = new CubemapGenerator(renderer).fromEquirectangular(
        texture,
        options
      );
      //
      // cubeCamera1 = new THREE.CubeCamera(1, 1000, 256);
      // cubeCamera1.renderTarget.texture.generateMipmaps = true;
      // cubeCamera1.renderTarget.texture.minFilter =
      //   THREE.LinearMipmapLinearFilter;
      // scene.add(cubeCamera1);
      cubeCamera2 = new THREE.CubeCamera(1, 1000, 256);
      cubeCamera2.renderTarget.texture.generateMipmaps = true;
      cubeCamera2.renderTarget.texture.minFilter =
        THREE.LinearMipmapLinearFilter;
      scene.add(cubeCamera2);

      //
      material = new THREE.MeshBasicMaterial({
        envMap: cubeCamera2.renderTarget.texture
      });
      sphere = new THREE.Mesh(
        new THREE.IcosahedronBufferGeometry(20, 3),
        material
      );
      // scene.add(sphere);

      cube = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 20, 20), material);
      scene.add(cube);
      torus = new THREE.Mesh(
        new THREE.TorusKnotBufferGeometry(10, 5, 100, 25),
        material
      );
      // scene.add(torus);
      //
      document.addEventListener("mousedown", this.onDocumentMouseDown, false);
      document.addEventListener("wheel", this.onDocumentMouseWheel, false);
      window.addEventListener("resize", this.onWindowResized, false);
    },
    addCube() {
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load("./static/full360/f12.jpg", texture => {
        texture.mapping = THREE.UVMapping;
        this.init(texture);
        this.animate();
      });
    },
    onWindowResized() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    },
    onDocumentMouseDown(event) {
      event.preventDefault();
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
      document.addEventListener("mouseup", this.onDocumentMouseUp, false);
    },
    onDocumentMouseMove(event) {
      lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    },
    onDocumentMouseUp() {
      document.removeEventListener(
        "mousemove",
        this.onDocumentMouseMove,
        false
      );
      document.removeEventListener("mouseup", this.onDocumentMouseUp, false);
    },
    onDocumentMouseWheel(event) {
      var fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.Math.clamp(fov, 10, 75);
      camera.updateProjectionMatrix();
    },
    setRender() {
      var time = Date.now();
      lon += 0.15;
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.Math.degToRad(90 - lat);
      theta = THREE.Math.degToRad(lon);
      if (cube) {
        cube.position.x = Math.cos(time * 0.001) * 30;
        cube.position.y = Math.sin(time * 0.001) * 30;
        cube.position.z = Math.sin(time * 0.001) * 30;
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.03;
      }
      if (torus) {
        torus.position.x = Math.cos(time * 0.001 + 10) * 30;
        torus.position.y = Math.sin(time * 0.001 + 10) * 30;
        torus.position.z = Math.sin(time * 0.001 + 10) * 30;
        torus.rotation.x += 0.02;
        torus.rotation.y += 0.03;
      }

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(scene.position);
      sphere && (sphere.visible = false);
      // pingpong
      if (cubeCamera1 && cubeCamera2) {
        if (count % 2 === 0) {
          material.envMap = cubeCamera1.renderTarget.texture;
          cubeCamera2.update(renderer, scene);
        } else {
          material.envMap = cubeCamera2.renderTarget.texture;
          cubeCamera1.update(renderer, scene);
        }
        count++;
      }

      sphere && (sphere.visible = true);
    },
    render() {
      //  this.setRender();
      //console.log(clock.getDelta(), clock.getElapsedTime());
      renderer.render(scene, camera);
    },
    animate() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.animate);
      this.render();
    }
  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObjects();
    this.initRender();
    this.animate();
  }
};
</script>

<style>
</style>
