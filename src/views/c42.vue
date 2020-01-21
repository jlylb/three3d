<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import ParticleEngine from "../tools/patricle3.js";
import { Examples } from "../tools/patricleExample.js";

let scene, camera, renderer, light, controls, floor, curve, particle;

var krq = new THREE.Object3D();

var wuPng = require("../assets/smoking.png");

var floorJpg = require("../assets/patricle/checkerboard.jpg");

var systemp;
var particles = 1000;
var particleSystem;
var geometry;

var engine;
var clock = new THREE.Clock();

const TWEEN = require("@tweenjs/tween.js");
require("threebsp");

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
        45,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      this.camera = camera;

      //   camera.position.z = 150;
      //   camera.position.y = 0;
      //   camera.position.x = 0;
      camera.position.set(0, 200, 400);
      //   camera.up.x = 0;
      //   camera.up.y = 1;
      //   camera.up.z = 0;
      controls = new OrbitControls(camera);

      scene.add(camera);
    },
    initRender() {
      var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      //scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x000040, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;
    },
    initLight() {
      // light = new THREE.AmbientLight(0xcccccc);
      // light.position.set(0, 0, 0);

      // scene.add(light);
      var light2 = new THREE.PointLight(0xffffff);

      light2.position.set(0, 350, 0);

      scene.add(light2);
    },
    createFloor() {
      var floorTexture = new THREE.TextureLoader().load(floorJpg);
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(10, 10);
      var floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        map: floorTexture,
        side: THREE.DoubleSide
      });
      var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -10.5;
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);

      var skyBoxGeometry = new THREE.CubeGeometry(4000, 4000, 4000);
      var skyBoxMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide
      });
      var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
      scene.add(skyBox);
    },
    initObjects() {
      this.createFloor();
      engine = new ParticleEngine(scene);

      engine.setValues(Examples.candle);
      engine.initialize();
      console.log(engine, "dddd.....");
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
      var dt = clock.getDelta();
      if (engine) {
        engine.update(dt * 0.5);
      }
    }
  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObjects();
    this.initRender();
    this.render();
  }
};
</script>

<style>
</style>
