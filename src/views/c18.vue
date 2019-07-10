<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test2.js";
import Tools from "@/tools/tools2.js";

let scene,
  camera,
  renderer,
  light,
  controls,
  floor,
  otherCamera,
  sphere1,
  curve;

let progress = 0;

let alpha = 0;

//let points = [];

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
      controls = new OrbitControls(camera);

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

      light2.position.set(0, 0, 0);

      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);
    },
    createBox() {
      testdata.models.forEach(item => {
        switch (item.modelType) {
          case "floor":
            floor = Tools.createFloor(item);
            scene.add(floor);
            break;
          default:
            break;
        }
      });
    },
    initObjects() {
      this.addLine2();
      // this.createBox();
      this.addLine3();
    },
    addLine2() {
      var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 2, 0),
        new THREE.Vector3(-1, 0.5, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 3, 0),
        new THREE.Vector3(2, 1, 0)
      ]);

      var pointsCount = 50;
      var pointsCount1 = pointsCount + 1;
      var points = curve.getPoints(pointsCount);

      var pts = curve.getPoints(pointsCount);
      var width = 200;
      var widthSteps = 1;
      let pts2 = curve.getPoints(pointsCount);
      pts2.forEach(p => {
        p.z += width;
      });
      pts = pts.concat(pts2);

      var ribbonGeom = new THREE.BufferGeometry().setFromPoints(pts);

      var indices = [];
      for (let iy = 0; iy < widthSteps; iy++) {
        // the idea taken from PlaneBufferGeometry
        for (let ix = 0; ix < pointsCount; ix++) {
          var a = ix + pointsCount1 * iy;
          var b = ix + pointsCount1 * (iy + 1);
          var c = ix + 1 + pointsCount1 * (iy + 1);
          var d = ix + 1 + pointsCount1 * iy;
          // faces
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
      ribbonGeom.setIndex(indices);
      ribbonGeom.computeVertexNormals();

      var ribbon = new THREE.Mesh(
        ribbonGeom,
        new THREE.MeshNormalMaterial({
          side: THREE.DoubleSide
          //color: 0x00ff00
        })
      );
      scene.add(ribbon);
      // ribbon.position.set(0, 0, 0);

      var line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: 0x00ff00,
          depthTest: false
        })
      );
      scene.add(line);
      // var box = new THREE.BoxGeometry(100, 100, 10, 1, 1, 1);

      // var boxMesh = new THREE.Mesh(
      //   box,
      //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // );
      // scene.add(boxMesh);
    },
    addLine3() {
      const v1 = new THREE.Vector3();
      const v2 = new THREE.Vector3(100, 100, 100);
      let points = [];
      if (alpha > 1) return;

      while (alpha < 1) {
        let v3 = v1.lerp(v2, alpha);
        alpha += 0.01;
        points.push(v3.x, v3.y, v3.z);
      }

      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3)
      );
      var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      // var mesh = new THREE.Mesh(geometry, material);
      var mesh = new THREE.Line(geometry, material);
      scene.add(mesh);
      console.log(points, "vector three..........");
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
      // this.addLine3();
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
