<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls;

const TWEEN = require("@tweenjs/tween.js");

import testM from "@/plugin/testMatrix.js";

var smokePng = require('../assets/patricle/smokeparticle.png')

let geo
let boxMesh
let dt = 0.0

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
        45,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      this.camera = camera;

      //   camera.position.z = 150;
      //   camera.position.y = 0;
      //   camera.position.x = 0;
      camera.position.set(0, 0, 300);
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
      this.createParticle()
    },
    createParticle() {
      geo = new THREE.BufferGeometry()
      const vertices = 500
      const radius = 50

      const positions = []
      const sizes = [];

      	for ( var i = 0; i < vertices; i ++ ) {
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
          sizes.push( 20 );
         
        }
        
        geo.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
         geo.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );

        const uniforms = {
          pointTexture: { value: new THREE.TextureLoader().load( smokePng ) },
          speed: { value: 0.05 }
        };
        

        const boxMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
					vertexShader: testM.vertexShader,
					fragmentShader: testM.fragmentShader,
					blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true,
					vertexColors: true
        });

        boxMesh = new THREE.Points(geo, boxMaterial);
console.log(boxMesh)
        scene.add(boxMesh);

    },

    animation() {
     // var time = Date.now() * 0.005;
     // let dt = clock.getDelta()
     // boxMesh.rotation.z += 0.1*dt;
      				var sizes = geo.attributes.size.array;
				for ( var i = 0; i < 500; i ++ ) {
					sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + dt ) );
				}
        geo.attributes.size.needsUpdate = true;

        dt += 0.01
        if(dt>0.5) {
          dt = 0.0
        }
        boxMesh.material.uniforms.speed.value = dt * 200

        // boxMesh.material.needsUpdate = true
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
       requestAnimationFrame(this.render);
 this.animation()

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
