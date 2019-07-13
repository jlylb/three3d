<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test2.js";
import Tools from "@/tools/tools2.js";

import {
  Path3D,
  PathPointList,
  PathGeometry,
  PathTubeGeometry
} from "three-path-builder";

// console.log(Path3D);

let scene, camera, renderer, light, controls, floor, curve;

let progress = 0;

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
          case "cabinet":
            const cabinet = Tools.createCabinet(item);
            scene.add(cabinet);
            break;
          default:
            break;
        }
      });
    },
    initObjects() {
      //this.addLine2();
      this.createBox();
      this.addMerge();
      //this.addAnimateLine();
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
    addAnimateLine() {
      path3D = new Path3D();
      var fixRadius = 0.5;
      var height = 0.1;

      geometry = new PathGeometry();
      var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        depthWrite: true,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
      });
      var line = new THREE.Mesh(geometry, material);
      line.drawMode = THREE.TriangleStripDrawMode;
      scene.add(line);

      const points1 = new THREE.Vector3();
      const points2 = new THREE.Vector3(100, 100, 100);
      path3D.start();
      path3D.update(points1);
      path3D.confirm();
      path3D.update(points2);
      path3D.confirm();
      path3D.stop();
      geometry.update(path3D.getPathPointList(), {
        width: params.width,
        side: params.side,
        arrow: true
      });
    },
    lineAnimate() {
      var pathPointList = path3D.getPathPointList();
      var distance = pathPointList.distance();

      if (distance > 0) {
        params.progress += params.playSpeed / distance;
        if (params.progress >= 1) {
          params.progress = 0;
        }
      }
      console.log(pathPointList);
      geometry.update(pathPointList, {
        width: params.width,
        side: params.side,
        progress: params.progress,
        arrow: true
      });
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
      // this.lineAnimate();
      // this.addLine3();
    },
    addMerge() {
      const box1 = {
        name: "side_board1",
        box: [100, 20, 30],
        position: [0, 15, 0],
        style: {
          skin: {
            left: {
              color: 0xff0000
            },
            right: {
              color: 0xff0000
            },
            up: {
              color: 0xff0000
            },
            down: {
              color: 0xff0000
            }
          }
        }
      };
      const box2 = {
        name: "side_board2",
        box: [100, 200, 10],
        position: [100, 85, 0],
        style: {
          skin: {
            left: {
              color: 0xff0000
            },
            right: {
              color: 0xff0000
            },
            up: {
              color: 0xff0000
            },
            down: {
              color: 0xff0000
            }
          }
        }
      };
      const gp = new THREE.Group();

      const mesh1 = Tools.createBox(box1);
      const mesh2 = Tools.createBox(box2);
      mesh2.updateMatrix();
      mesh1.geometry.merge(mesh2.geometry, mesh2.matrix);

      gp.add(mesh1);
      //gp.position.copy(mesh1.position);
      //scene.add(gp);
      //scene.add(mesh2);
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
