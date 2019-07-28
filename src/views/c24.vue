<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import Fire from "../plugin/fire2.js";


let scene, camera, renderer, light, controls, floor, curve;

let target;
let scene2, camera2;

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
        antialias: true, alpha: true
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
      camera2 = new THREE.PerspectiveCamera(
        45,
        window.innerWidth*0.5 / window.innerHeight,
        1,
        2000
      );
      camera2.position.set(0, 500, 200)
  //     	camera2 = new THREE.OrthographicCamera( -window.innerWidth*0.5, window.innerWidth*0.5, window.innerHeight*0.5, -window.innerHeight*0.5, 1, 2 );
	// camera2.position.z = 1;
      scene2 = new THREE.Scene({ antialias: true });
     // scene2.background = new THREE.Color( 0x00ff00 );
      scene2.add(camera2)
     var light3 = new THREE.AmbientLight(0xff0000);
      light3.position.set(0, 0, 0);

      scene2.add(light3);
      var light4 = new THREE.PointLight(0xffffff);

      light4.position.set(0, 200, 200);

      scene2.add(light4);

    

      target = new THREE.WebGLRenderTarget(window.innerWidth*0.5, window.innerHeight*0.5)
     //  target.background = new THREE.Color( 0x000000 );
    var plane2 = new THREE.PlaneBufferGeometry( 500, 500 );
      var mesh2 = new THREE.Mesh(plane2, new THREE.MeshBasicMaterial(
        {
          color: 0xff0000,
          side: THREE.DoubleSide
        }
      ))
      //mesh2.rotation.z = Math.PI/4
      // mesh2.rotation.y = Math.PI/2
      scene2.add(mesh2)

     // scene.add(mesh2)

      var plane = new THREE.BoxBufferGeometry( 200, 200, 200 );
      var mesh = new THREE.Mesh(plane, new THREE.MeshLambertMaterial())
      mesh.material.map = target.texture
      mesh.material.needsUpdate = true
      scene.add(mesh)
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
        camera2.lookAt(scene2.position)
          camera.lookAt(scene.position)
       renderer.clear();
      renderer.setRenderTarget(target)
       renderer.render(scene2, camera2);
      //renderer.clear();
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
