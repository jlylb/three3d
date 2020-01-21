<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
window.THREE = THREE;

const Nebula = require("three-nebula");

import Stats from "stats.js";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls;

const TWEEN = require("@tweenjs/tween.js");
var wuPng = require("../assets/smoking.png");

var clock = new THREE.Clock();

let shaderMaterial;
let dt = 0;
let emitter, stats, proton, system;

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

      camera.position.set(0, 0, 100);

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
      this.addStars();
      this.addProton();
    },
    addStars() {
      var geometry = new THREE.Geometry();
      for (var i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = THREE.Math.randFloatSpread(2000);
        vertex.y = THREE.Math.randFloatSpread(2000);
        vertex.z = THREE.Math.randFloatSpread(2000);
        geometry.vertices.push(vertex);
      }
      var particles = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color: 0x888888
        })
      );
      scene.add(particles);
    },
    addProton() {
      system = new Nebula.default();
      system.addEmitter(this.createEmitter());
      system.addRenderer(new Nebula.SpriteRenderer(scene, THREE));
    },
    createSprite() {
      var map = new THREE.TextureLoader().load("./img/dot.png");
      var material = new THREE.SpriteMaterial({
        map: map,
        color: 0xff0000,
        blending: THREE.AdditiveBlending,
        fog: true
      });
      return new THREE.Sprite(material);
    },
    createEmitter() {
      emitter = new Nebula.Emitter();
      emitter.rate = new Nebula.Rate(
        new Nebula.Span(10, 15),
        new Nebula.Span(0.05, 0.1)
      );
      emitter.addInitializer(new Nebula.Body(this.createSprite()));
      emitter.addInitializer(new Nebula.Mass(1));
      emitter.addInitializer(new Nebula.Life(1, 3));
      emitter.addInitializer(new Nebula.Position(new Nebula.SphereZone(20)));
      emitter.addInitializer(
        new Nebula.RadialVelocity(
          new Nebula.Span(500, 800),
          new Nebula.Vector3D(0, 1, 0),
          30
        )
      );
      emitter.addBehaviour(new Nebula.RandomDrift(10, 10, 10, 0.05));
      //emitter.addBehaviour(new Nebula.Alpha(1, 0.1));
      emitter.addBehaviour(new Nebula.Scale(new Nebula.Span(2, 3.5), 0));
      emitter.addBehaviour(new Nebula.Gravity(6));
      emitter.addBehaviour(
        new Nebula.Color(
          "#FF0026",
          ["#ffff00", "#ffff11"],
          Infinity,
          Nebula.easeOutSine
        )
      );
      emitter.position.x = 0;
      emitter.position.y = -150;
      emitter.emit();
      return emitter;
    },
    addInteraction() {
      window.addEventListener("mousemove", onMouseMove, false);
      var pos = {
        x: 0,
        y: 0
      };
      function onMouseMove(event) {
        pos.x = event.clientX;
        pos.y = event.clientY;
        var target = Nebula.THREEUtil.toSpacePos(
          pos,
          camera,
          renderer.domElement
        );
        emitter.position.x += (target.x - emitter.position.x) / 10;
        emitter.position.y += (target.y - emitter.position.y) / 10;
        emitter.position.z += (target.z - emitter.position.z) / 10;
      }
    },

    createStats() {
      //stats
      stats = new Stats();
      document.getElementById("container").appendChild(stats.dom);
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      var delta = clock.getDelta();
      system.update(delta);
      stats.update();
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
    this.createStats();
    this.render();
  }
};
</script>

<style>
</style>
