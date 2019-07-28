<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import Fire from "../plugin/fire2.js";


let scene, camera, renderer, light, controls, floor, curve;

let RenderTarget;
let RTScene, camera2;

var wuPng = require("../assets/smoking.png");

var floorJpg = require("../assets/patricle/checkerboard.jpg");

const TWEEN = require("@tweenjs/tween.js");
require("threebsp");

			var fire;
			var params = {
				color1: '#ffffff',
				color2: '#ffa000',
				color3: '#000000',
				colorBias: 0.8,
				burnRate: 0.35,
				diffuse: 1.33,
				viscosity: 0.25,
				expansion: - 0.25,
				swirl: 50.0,
				drag: 0.35,
				airSpeed: 12.0,
				windX: 0.0,
				windY: 0.75,
				speed: 500.0,
				massConservation: false
			};


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
        antialias: true
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
				// var plane = new THREE.PlaneBufferGeometry( 200, 200 );
				var fieldGeometry = new THREE.BoxGeometry(300, 300, 300, 1, 1, 1 );
				fire = new Fire( fieldGeometry, {
					textureWidth: 256,
					textureHeight: 256,
					debug: false
				} );
			//	fire.position.x= - 2;
			scene.add( fire );

		// console.log()
				
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
renderer.clear();
 renderer.setRenderTarget(null)
       renderer.render(scene, camera);
      requestAnimationFrame(this.render);

    },

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
