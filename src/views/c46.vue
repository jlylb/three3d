<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls, particleSystem, wuPoints;

const TWEEN = require("@tweenjs/tween.js");

import testM from "@/shader/test2.js";

import DotPng from "@/assets/dot.png";
var wuPng = require("../assets/smoking.png");
var smokePng = require("../assets/patricle/smokeparticle.png");
let dt = 0;
let shaderMaterial;
let linepos = [];
var clock = new THREE.Clock();

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
        1000
      );

      camera.position.set(0, 0, 50);

      controls = new OrbitControls(camera);

      scene.add(camera);
    },
    initRender() {
      //var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      //  scene.add(axis);
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x000040, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;
    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(0, 0, 0);

      scene.add(light);
      var light2 = new THREE.PointLight(0xffffff);

      light2.position.set(0, 350, 0);

      scene.add(light2);
    },

    initObjects() {
      const texture = new THREE.TextureLoader().load(smokePng);
      // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      var uniforms = {
        color: { type: "c", value: new THREE.Color(0xfc2200) },
        texture: { value: texture },
        heightOfNearPlane: { type: "f", value: 0.0 },
        time: { type: "f", value: 0.0 },
        size: { type: "f", value: 1.4 }
      };
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: testM.vertexShader,
        fragmentShader: testM.fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide
      });
      // shaderMaterial.uniforms.heightOfNearPlane.value = Math.abs(
      //   window.innerHeight /
      //     (2 * Math.tan(THREE.Math.degToRad(camera.fov * 0.5)))
      // );

      console.log(shaderMaterial.uniforms.heightOfNearPlane.value);
      const geom = new THREE.BufferGeometry();
      const radius = 0.5;
      // const angle = Math.PI / 180;
      const num = 3;
      const positions = [];
      const randam = [];
      const sprite = [];
      const halfHeight = 10 * 0.5;
      for (let i = 0; i < num; i++) {
        let angle = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random()) * radius;
        let posX = Math.cos(angle) * r;
        let posY = ((radius - r) / radius) * halfHeight + halfHeight;
        let posZ = Math.sin(angle) * r;

        //let posZ = 0;
        positions.push(posX, posY, posZ);
        randam.push(Math.random());
        sprite.push(Math.random());
      }
      geom.addAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geom.addAttribute("randam", new THREE.Float32BufferAttribute(randam, 1));
      geom.addAttribute("sprite", new THREE.Float32BufferAttribute(sprite, 1));
      wuPoints = new THREE.Points(geom, shaderMaterial);
      scene.add(wuPoints);
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      var delta = clock.getDelta();
      shaderMaterial.uniforms.time.value += delta;
      renderer.render(scene, camera);
      requestAnimationFrame(this.render);
    }
  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initRender();
    this.initObjects();

    this.render();
  }
};
</script>

<style>
</style>
