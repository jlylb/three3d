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
let dt = 0;
let line;
let linepos = [];

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
    createLine() {
      var geometry = new THREE.BufferGeometry();
      var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        color: 0xff0000
      });
      var positions = [];
      var num = 2;
      var r = 100;
      for (var i = 0; i < num; i++) {
        var x = Math.random() * r - r / 2;
        var y = Math.random() * r - r / 2;
        var z = 0;
        // positions
        positions.push(x, y, z);
        linepos.push([x, y, z]);
      }
      geometry.addAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.computeBoundingSphere();
      line = new THREE.Line(geometry, material);
      scene.add(line);
      console.log(line, linepos);
      const [pos1, pos2] = linepos;
      const p1 = new THREE.Vector3(...pos1);
      const p2 = new THREE.Vector3(...pos2);
      const p3 = new THREE.Vector3();
      const v1 = p1.clone().sub(p2);
      const v2 = p1.clone().sub(p3);
      console.log(
        Math.cos(v1.angleTo(v2)),
        v1.dot(v2) / (v1.length() * v2.length()),
        v1.normalize().dot(v2.normalize())
      );
    },
    createFire() {
      const texture = new THREE.TextureLoader().load(wuPng);
      const material = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 10,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });

      const geom = new THREE.BufferGeometry();
      const radius = 100;
      const angle = Math.PI / 180;
      const num = 10;
      const positions = [];
      for (let i = 0; i < num; i++) {
        let posX = Math.cos(angle * i * 72) * radius;
        let posY = Math.sin(angle * i * 72) * radius;
        positions.push(posX);
        positions.push(posY);
        positions.push(0);
      }
      geom.addAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      const mesh1 = new THREE.Points(geom, material);
      scene.add(mesh1);
    },
    initObjects() {
      //  const sphere = new THREE.SphereBufferGeometry(50, 25, 25);
      const texture = new THREE.TextureLoader().load(wuPng);
      const material = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 20,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      var uniforms = {
        color: { value: new THREE.Color(0xffffff) },
        texture: { value: new THREE.TextureLoader().load(wuPng) },
        val: { value: 1.0 }
      };
      var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: testM.vertexShader,
        fragmentShader: testM.fragmentShader,
        // blending: THREE.SubtractiveBlending,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide
      });
      const geom = new THREE.BufferGeometry();
      const radius = 100;
      const angle = Math.PI / 180;
      const num = 10;
      const positions = [];
      for (let i = 0; i < num; i++) {
        let posX = Math.cos(angle * i * 72) * radius;
        let posY = Math.sin(angle * i * 72) * radius;
        positions.push(posX);
        positions.push(posY);
        positions.push(0);
      }
      geom.addAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      wuPoints = new THREE.Points(geom, material);
      scene.add(wuPoints);
      console.log(wuPoints);

      this.createLine();
      // this.addPartice(sphere);
    },
    addPartice(moreObj) {
      //var morePos = moreObj.attributes.position.array;

      var uniforms = {
        color: { value: new THREE.Color(0xffffff) },
        texture: { value: new THREE.TextureLoader().load(wuPng) },
        val: { value: 1.0 }
      };
      var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: testM.vertexShader,
        fragmentShader: testM.fragmentShader,
        // blending: THREE.SubtractiveBlending,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide
      });
      particleSystem = new THREE.Points(moreObj, shaderMaterial);
      scene.add(particleSystem);
    },
    updateLine() {
      var geometry = line.geometry;
      var attributes = geometry.attributes;
      // var num = 2;
      // var r = 800;
      // for (var i = 0; i < num; i++) {
      //   var x = Math.random() * r - r / 2;
      //   var y = Math.random() * r - r / 2;
      //   var z = Math.random() * r - r / 2;
      //   // positions
      //   endArr.push([x, y, z]);
      // }
      if (dt > 1) {
        dt = 0;
      } else {
        dt += 0.005;
      }
      line.position.x += dt;
      line.position.y += dt;
      // for (var i = 0; i < attributes.position.count; i++) {
      //   attributes.position.array[3 * i] += dt;
      //   attributes.position.array[3 * i + 1] += dt;
      //   attributes.position.array[3 * i + 2] += dt;
      // }
      // attributes.position.needsUpdate = true;
    },
    update() {
      var geometry = wuPoints.geometry;
      var attributes = geometry.attributes;
      const angle = Math.PI / 180;
      const radius = 100;
      if (dt > 6.28) {
        dt = 0;
      } else {
        dt += 0.005;
      }
      // for (var i = 0; i < attributes.position.count; i++) {
      //   let posX = Math.cos(angle * dt * i * 80) * radius;
      //   let posY = Math.sin(angle * dt * i * 80) * radius;
      //   attributes.position.array[3 * i] = posX;
      //   attributes.position.array[3 * i + 1] = posY;
      // }
      for (var i = 0; i < attributes.position.count; i++) {
        for (var j = 0; j < attributes.position.count; j++) {
          let posX = Math.cos(angle * dt * (j + 1) * (i + 1) * 30) * radius;
          let posY = Math.sin(angle * dt * (j + 1) * (i + 1) * 30) * radius;
          attributes.position.array[3 * i] = posX;
          attributes.position.array[3 * i + 1] = posY;
        }
      }
      attributes.position.needsUpdate = true;
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      // this.update();
      // this.updateLine();
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
