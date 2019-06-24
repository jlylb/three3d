<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test.js";
import Tools from "@/tools/tools.js";

let scene, camera, renderer, light, controls;

const floorJpg = require("../assets/floor.jpg");

const TWEEN = require("@tweenjs/tween.js");
require("threebsp");

export default {
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
      camera.position.z = 200;
      camera.position.y = 120;
      camera.position.x = 100;
      camera.up.x = 0;
      camera.up.y = 0;
      camera.up.z = 1;
      camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);
      // var helper = new THREE.CameraHelper(camera);
      // scene.add(helper);
      console.log(controls, "controls.......");
      scene.add(camera);
      Tools.addCamera(camera)
      Tools.addScene(scene)
    },
    initRender() {
      var axis = new THREE.AxesHelper(200);
      // 在场景中添加坐标轴
      scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x225f93, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;
           renderer.domElement.addEventListener(
        "mousedown",
        Tools.onDocumentMouseDown,
        false
      );

    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(0, 0, 300);
      scene.add(light);
      var light2 = new THREE.PointLight(0x555555);
      // var sphereSize = 10;
      // var pointLightHelper = new THREE.PointLightHelper(light2, sphereSize);
      // scene.add(pointLightHelper);
      // light2.shadow.camera.near = 1;
      // light2.shadow.camera.far = 1000;
      light2.position.set(0, 0, 0);
      // light2.shadow.mapSize.width = 2048;
      // light2.shadow.mapSize.height = 2048;
      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);
    },
    createFloor() {
      var shape = new THREE.Shape();
      const width = 120;
      shape.moveTo(-width, -width);
      shape.lineTo(-width, width);
      shape.lineTo(width, width);
      shape.lineTo(width, -width + 10);
      shape.lineTo(width - 10, -width);
      shape.lineTo(-width, -width);

      var extrudeSettings = {
        steps: 1,
        depth: 3,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0,
        bevelSegments: 1
      };

      var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      console.log(geometry);

      let mats = [];

      const texture = new THREE.TextureLoader().load(floorJpg);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.05, 0.05);

      const material2 = { map: texture, transparent: true };
      mats.push(new THREE.MeshLambertMaterial(material2));
      mats.push(
        new THREE.MeshLambertMaterial({
          color: new THREE.Color(0x393939),
          vertexColors: THREE.FaceColors
          // side: THREE.DoubleSide
        })
      );
      // for (let i = 0; i < geometry.faces.length; i += 2) {
      //   geometry.faces[i].materialIndex = i / 2;
      //   geometry.faces[i + 1].materialIndex = i / 2;
      // }
      var edges1 = new THREE.EdgesGeometry(geometry);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
      );
      scene.add(line1);

      var mesh = new THREE.Mesh(geometry, mats);

      //mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);
    },
    initObjects() {
      this.createBox();
      // this.createTube();
      //this.createFloor();
    },
    createTube() {
      var radius = 10; // 管子的半径
      var shape = new THREE.Shape();
      shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

      var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.2
      });

      var v1 = new THREE.Vector3(0, 0, 0);
      var v2 = new THREE.Vector3(100, 0, 0);

      var path = new THREE.LineCurve3(v1, v2);

      var extrudeSettings = {
        bevelEnabled: false,
        steps: 1,
        extrudePath: path
      };

      var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = 100;
      scene.add(mesh);
    },
    createBox() {
      testdata.models.forEach(item => {
        switch (item.modelType) {
          case "room":
            scene.add(Tools.createWall(item))
            break;
          case "floor":
            scene.add(Tools.createFloor(item));
            break;
          default:
            break;
        }
      });
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);

      renderer.render(scene, camera);
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
