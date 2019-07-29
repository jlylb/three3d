<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import Fire from "../plugin/fire.js";


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
 				var plane = new THREE.PlaneBufferGeometry( 20, 20 );
				fire = new Fire( plane, {
					textureWidth: 512,
					textureHeight: 512,
					debug: false
				} );
				fire.position.z = - 2;
        scene.add( fire );
        
        				this.Campfire();
				this.Single();
    },
			Campfire() {
					params.color1 = 0xffffff;
					params.color2 = 0xffa000;
					params.color3 = 0x000000;
					params.windX = 0.0;
					params.windY = 0.75;
					params.colorBias = 0.8;
					params.burnRate = 0.3;
					params.diffuse = 1.33;
					params.viscosity = 0.25;
					params.expansion = - 0.25;
					params.swirl = 50.0;
					params.drag = 0.35;
					params.airSpeed = 12.0;
					params.speed = 500.0;
					params.massConservation = false;
					this.updateAll();
        },
        Single() {
					fire.clearSources();
					fire.addSource( 0.5, 0.1, 0.1, 1.0, 0.0, 1.0 );
				},
				updateColor1( value ) {
					fire.color1.set( value );
				},
				updateColor2( value ) {
					fire.color2.set( value );
				},
				updateColor3( value ) {
					fire.color3.set( value );
				},
				updateColorBias( value ) {
					fire.colorBias = value;
				},
				updateBurnRate( value ) {
					fire.burnRate = value;
				},
				updateDiffuse( value ) {
					fire.diffuse = value;
				},
				updateViscosity( value ) {
					fire.viscosity = value;
				},
				updateExpansion( value ) {
					fire.expansion = value;
				},
				updateSwirl( value ) {
					fire.swirl = value;
				},
				updateDrag( value ) {
					fire.drag = value;
				},
				updateAirSpeed( value ) {
					fire.airSpeed = value;
				},
				updateWindX( value ) {
					fire.windVector.x = value;
				},
				updateWindY( value ) {
					fire.windVector.y = value;
				},
				updateSpeed( value ) {
					fire.speed = value;
				},
				updateMassConservation( value ) {
					fire.massConservation = value;
				},
updateAll(){
					this.updateColor1( params.color1 );
					this.updateColor2( params.color2 );
					this.updateColor3( params.color3 );
					this.updateColorBias( params.colorBias );
					this.updateBurnRate( params.burnRate );
					this.updateDiffuse( params.diffuse );
					this.updateViscosity( params.viscosity );
					this.updateExpansion( params.expansion );
					this.updateSwirl( params.swirl );
					this.updateDrag( params.drag );
					this.updateAirSpeed( params.airSpeed );
					this.updateWindX( params.windX );
					this.updateWindY( params.windY );
					this.updateSpeed( params.speed );
					this.updateMassConservation( params.massConservation );
},
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
renderer.clear();
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
