<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test2.js";
import Tools from "@/tools/tools2.js";

let scene, camera, renderer, light, controls, floor;

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
        100000
      );
      camera.position.z = 300;
      camera.position.y = 1000;
      camera.position.x = -1800;
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);
      // var helper = new THREE.CameraHelper(camera);
      // scene.add(helper);
      console.log(controls, "controls.......");
      scene.add(camera);
      Tools.addCamera(camera);
      Tools.addScene(scene);
    },
    initRender() {
      var axis = new THREE.AxesHelper(1200);
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
      light.position.set(0, 0, 0);
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

    initObjects() {
      this.createBox1();
      this.addLine2();
    },
    createBox1() {
      testdata.models.forEach(item => {
        switch (item.modelType) {
          case "room":
            scene.add(Tools.createWall(item));
            break;
          case "floor":
            floor = Tools.createFloor(item);
            scene.add(floor);
            break;
          case "desk":
            scene.add(Tools.createDesk(item));
            break;
          case "chair":
            const chairs = Tools.createChairs(item);
            chairs.forEach(item => {
              scene.add(item);
            });
            break;
          case "plant":
            const plants = Tools.createPlan(item);
            plants.forEach(item => {
              scene.add(item);
            });
            break;
          default:
            break;
        }
      });
    },
    addLine2() {
      var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-350, 10, -300),

        new THREE.Vector3(-350, 10, 300),

        new THREE.Vector3(350, 10, 300),

        new THREE.Vector3(350, 10, -300),

        new THREE.Vector3(-350, 10, -300)
      ]);

      var pointsCount = 50;
      var pointsCount1 = pointsCount + 1;
      var points = curve.getPoints(pointsCount);

      var line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: "red",
          depthTest: false,
          side: THREE.DoubleSide
        })
      );
      line.position.set(0, 12, 0);
      scene.add(line);
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
    this.initObjects();
    this.initRender();

    this.render();
  }
};
</script>

<style>
dd {
  color: rgba(1, 1, 1);
}
</style>
