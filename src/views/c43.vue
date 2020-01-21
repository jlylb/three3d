<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls, floor, curve, particle;

const TWEEN = require("@tweenjs/tween.js");

var cameraCube,
  sceneCube,
  textureCube,
  cubeMesh,
  textureEquirec,
  sphereMaterial;

import dat from "dat.gui";

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
      sceneCube = new THREE.Scene();
    },
    initCamera() {
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      //this.camera = camera;

      //   camera.position.z = 150;
      //   camera.position.y = 0;
      //   camera.position.x = 0;
      camera.position.set(0, 0, 1000);
      //   camera.up.x = 0;
      //   camera.up.y = 1;
      //   camera.up.z = 0;
      controls = new OrbitControls(camera);

      scene.add(camera);

      cameraCube = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      scene.add(cameraCube);
    },
    initRender() {
      var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      //scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      renderer.autoClear = false;
      renderer.gammaOutput = true;
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x000040, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;
    },
    initLight() {
      light = new THREE.AmbientLight(0xffffff);
      light.position.set(0, 0, 0);

      scene.add(light);
      var light2 = new THREE.PointLight(0xffffff);

      light2.position.set(0, 350, 0);

      scene.add(light2);
    },

    initObjects() {
      this.addCube();
    },
    addCube() {
      var r = "./static/textures/cube/skybox/";
      var urls = [
        r + "px.jpg",
        r + "nx.jpg",
        r + "py.jpg",
        r + "ny.jpg",
        r + "pz.jpg",
        r + "nz.jpg"
      ];

      textureCube = new THREE.CubeTextureLoader().load(urls);
      textureCube.format = THREE.RGBFormat;
      textureCube.mapping = THREE.CubeReflectionMapping;
      textureCube.encoding = THREE.sRGBEncoding;

      var cubeShader = THREE.ShaderLib["cube"];
      var cubeMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });
      cubeMaterial.uniforms["tCube"].value = textureCube;
      Object.defineProperty(cubeMaterial, "map", {
        get: function() {
          return this.uniforms.tCube.value;
        }
      });

      //Equirect
      var textureLoader = new THREE.TextureLoader();
      textureEquirec = textureLoader.load(
        "./static/textures/2294472375_24a3b8ef46_o.jpg"
      );
      textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
      textureEquirec.magFilter = THREE.LinearFilter;
      textureEquirec.minFilter = THREE.LinearMipmapLinearFilter;
      textureEquirec.encoding = THREE.sRGBEncoding;

      // Materials
      var equirectShader = THREE.ShaderLib["equirect"];
      var equirectMaterial = new THREE.ShaderMaterial({
        fragmentShader: equirectShader.fragmentShader,
        vertexShader: equirectShader.vertexShader,
        uniforms: equirectShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });
      equirectMaterial.uniforms["tEquirect"].value = textureEquirec;
      // enable code injection for non-built-in material
      Object.defineProperty(equirectMaterial, "map", {
        get: function() {
          return this.uniforms.tEquirect.value;
        }
      });
      cubeMesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(100, 100, 100),
        equirectMaterial
      );
      sceneCube.add(cubeMesh);

      var geometry = new THREE.SphereBufferGeometry(400.0, 48, 24);
      sphereMaterial = new THREE.MeshLambertMaterial({
        envMap: textureEquirec
      });
      var sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
      scene.add(sphereMesh);
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
      camera.lookAt(scene.position);
      cameraCube.rotation.copy(camera.rotation);
      renderer.render(sceneCube, cameraCube);
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
