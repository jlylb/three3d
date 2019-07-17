<template>
  <div class="box">
    <btn-group></btn-group>
    <div id="container1"></div>
  </div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test2.js";
import Tools from "@/tools/tools2.js";

import btnGroup from "@/components/buttons";

// console.log(Path3D);

let scene, camera, renderer, light, controls, floor, curve;

let progress = 0;

var material;
var line;
var lineLength;

let path3D;
var geometry;
var params = {
  useTexture: true,
  color: [88, 222, 222],
  scrollUV: true,
  scrollSpeed: 0.03,
  width: 10,
  side: "both",
  cornerRadius: 0.2,
  cornerSplit: 10,
  progress: 1,
  playSpeed: 1
};

//let points = [];

const TWEEN = require("@tweenjs/tween.js");
require("threebsp");

export default {
  components: { btnGroup },
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
      //scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container1").appendChild(renderer.domElement);
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

      light2.position.set(0, 350, 0);

      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 5000;

      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);
    },
    createBox() {
      testdata.models.forEach(item => {
        switch (item.modelType) {
          // case "room":
          //   scene.add(Tools.createWall(item));
          //   break;
          // case "floor":
          //   floor = Tools.createFloor(item);
          //   scene.add(floor);
          //   break;
          // case "cabinet":
          //   const cabinet = Tools.createCabinet(item);
          //   cabinet.forEach((item)=>{
          //     scene.add(item);
          //   })

          //   break;
          case "box":
            scene.add(Tools.addObject(item));
            break;
          default:
            break;
        }
      });
    },
    initObjects() {
      this.addLine3();
      //this.createBox();

      //this.addAnimateLine();
    },
    addLine3() {
      var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 2, 0),
        new THREE.Vector3(200, 200, 0),
        new THREE.Vector3(500, 100, 80),
        new THREE.Vector3(700, 210, 180)
      ]);

      var pointsCount = 50;
      var points = curve.getPoints(pointsCount);

      lineLength = curve.getLength();

      material = new THREE.LineDashedMaterial({
        color: 0x00ff00,
        depthTest: false,
        dashSize: 0,
        gapSize: 1000000,
        scale: 10
      });
      var geometry = new THREE.BufferGeometry().setFromPoints(points);

      line = new THREE.Line(geometry, material);

      console.log(line, "line.....");
      line.computeLineDistances();
      scene.add(line);
      var num = 2;
      var count = 0;
      const t1 = new TWEEN.Tween({ length: 0 })
        .to({ length: lineLength }, 2000)
        .onStart(() => {
          material.dashSize = 0;
          line.material = material;
          console.log("start", material);
        })
        .onUpdate(data => {
          console.log(data);

          material.dashSize += 300;
          // material.scale += 10;
          line.material = material;
          // if (data.length == lineLength && count != num) {
          //   count += 1;
          //   material.dashSize = -10;
          // }
          if (data.length == lineLength) {
            material.dashSize = -10;
          }
        })
        .repeat(Infinity);

      t1.start();
    },
    animationLine() {
      if (line) {
        material.dashSize += 5;
        console.log(material.dashSize, lineLength);
        line.material = material;
      }
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
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
      //this.animationLine();
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
.box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
