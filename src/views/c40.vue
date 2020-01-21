<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls, particleSystem;

const TWEEN = require("@tweenjs/tween.js");

import testM from "@/shader/test1.js";

import DotPng from "@/assets/dot.png";

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
      camera.position.set(0, 400, 400);
      //   camera.up.x = 0;
      //   camera.up.y = 1;
      //   camera.up.z = 0;
      controls = new OrbitControls(camera);

      scene.add(camera);
    },
    initRender() {
      var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      scene.add(axis);
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
      const sphere = new THREE.SphereBufferGeometry(50, 25, 25);
      const texture = new THREE.TextureLoader().load(DotPng);
      const material = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 5,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      // const points = new THREE.Points(sphere, material);
      // scene.add(points);

      //box

      const box = new THREE.BoxBufferGeometry(100, 100, 100, 50, 50, 50);
      // const points1 = new THREE.Points(box, material);
      // points1.position.set(-250, 0, 0);
      // scene.add(points1);
      console.log(sphere, box);
      this.addPartice(box, sphere);
    },
    addPartice: function(moreObj, lessObj) {
      var morePos = moreObj.attributes.position.array;
      var lessPos = lessObj.attributes.position.array;
      var moreLen = morePos.length;
      var lessLen = lessPos.length;
      var position2 = new Float32Array(moreLen);
      position2.set(lessPos);
      for (var i = lessLen, j = 0; i < moreLen; i++, j++) {
        j %= lessLen;
        position2[i] = lessPos[j];
        position2[i + 1] = lessPos[j + 1];
        position2[i + 2] = lessPos[j + 2];
      }

      var sizes = new Float32Array(moreLen);
      for (var i = 0; i < moreLen; i++) {
        sizes[i] = 4;
      }
      moreObj.addAttribute("size", new THREE.BufferAttribute(sizes, 1));
      moreObj.addAttribute(
        "position2",
        new THREE.BufferAttribute(position2, 3)
      );
      var uniforms = {
        color: { value: new THREE.Color(0xffffff) },
        texture: { value: new THREE.TextureLoader().load(DotPng) },
        val: { value: 1.0 }
      };
      var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: testM.vertexShader,
        fragmentShader: testM.fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide
      });
      particleSystem = new THREE.Points(moreObj, shaderMaterial);
      particleSystem.position.y = -15;

      var pos = { val: 1 };
      const tween = new TWEEN.Tween(pos)
        .to({ val: 0 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .delay(1000)
        .onUpdate(callback);
      const tweenBack = new TWEEN.Tween(pos)
        .to({ val: 1 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .delay(1000)
        .onUpdate(callback);
      tween.chain(tweenBack);
      tweenBack.chain(tween);
      tween.start();

      function callback() {
        particleSystem.material.uniforms.val.value = this.val;
      }

      scene.add(particleSystem);
      // this.particleSystem = particleSystem;
    },
    update() {
      var time = Date.now() * 0.005;
      if (particleSystem) {
        var bufferObj = particleSystem.geometry;
        particleSystem.rotation.y = 0.01 * time;
        var sizes = bufferObj.attributes.size.array;
        var len = sizes.length;
        for (var i = 0; i < len; i++) {
          sizes[i] = 2 * (1.0 + Math.sin(0.02 * i + time));
        }
        bufferObj.attributes.size.needsUpdate = true;
      }

      // this.renderer.render(this.scene, this.camera);
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      this.update();
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
