<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import Particle from "../plugin/particle.js";

let scene, camera, renderer, light, controls, floor, curve;

var wuPng = require("../assets/smoking.png");

var floorJpg = require("../assets/patricle/checkerboard.jpg");

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
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(0, 0, 0);

      scene.add(light);
      var light2 = new THREE.PointLight(0xffffff);

      light2.position.set(0, 350, 0);

      //   light2.shadow.camera.near = 1;
      //   light2.shadow.camera.far = 5000;

      // light2.castShadow = true; //表示这个光是可以产生阴影的
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
      // this.init()
      this.createFloor();
      var particles = 200, radius=10
      				var geometry = new THREE.BufferGeometry();
				var positions = [];
				var colors = [];
				var sizes = [];
				var color = new THREE.Color();
				for ( var i = 0; i < particles; i ++ ) {
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					color.setHSL( i / particles, 1.0, 0.5 );
					colors.push( color.r, color.g, color.b );
					sizes.push( 20 );
				}
				geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );
      let par = new Particle(geometry);
      scene.add(par)
    },

    createSprites() {
      var material = new THREE.SpriteMaterial();
      for (var x = -5; x < 5; x++) {
        for (var y = -5; y < 5; y++) {
          var sprite = new THREE.Sprite(material);
          sprite.position.set(x * 10, y * 10, 0);
          scene.add(sprite);
        }
      }
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
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
