<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test2.js";
import Tools from "@/tools/tools2.js";

import gModel from "@/tools/gmodel.js";

let scene,
  camera,
  renderer,
  light,
  controls,
  floor,
  otherCamera,
  sphere1,
  curve;
let isOpen = false;
let isEnter = true;
let ldoor, rdoor;

let progress = 0;

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
      // camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);
      // var helper = new THREE.CameraHelper(camera);
      // scene.add(helper);
      console.log(controls, "controls.......");
      scene.add(camera);
      Tools.addCamera(camera);
      Tools.addScene(scene);
      //scene.add(Tools.addCameraHelper(camera));
      otherCamera = Tools.addGroupCamera();
      console.log(otherCamera, "other camera.......");
      //otherCamera.position.setY(100);
      scene.add(otherCamera);
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
      curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(600, 10, 100),

        new THREE.Vector3(350, 10, 100),

        new THREE.Vector3(350, 10, 300),

        new THREE.Vector3(-350, 10, 300),

        new THREE.Vector3(-350, 10, 0),

        new THREE.Vector3(-350, 10, -200),

        new THREE.Vector3(350, 10, -200),

        new THREE.Vector3(350, 10, 0),

        new THREE.Vector3(600, 10, 0),
        new THREE.Vector3(600, 10, 100)

        //new THREE.Vector3(-350, 10, -200)
      ]);
      this.getvv(curve);
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
      line.visible = false;

      console.log(curve, line, "curve line.........");

      line.position.set(0, 12, 0);
      scene.add(line);

      var tubeGeometry2 = new THREE.TubeGeometry(curve, 100, 20, 50, false);
      var tubeMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      console.log(tubeGeometry2, "log.......");
      var tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial2);
      scene.add(tube2);
    },
    getvv(curve) {
      var time = Date.now();
      var looptime = 20 * 1000;
      var t = (time % looptime) / looptime;
      var pos = curve.getPointAt(t);

      var segments = 50;
      var pickt = t * segments;
      var pick = Math.floor(pickt);
      var pickNext = (pick + 1) % segments;

      console.log(pickt, pick, pickNext, "picker.......");

      sphere1 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(5),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 * Math.random() })
      );
      var points = curve.getPoints(50);
      for (let point of points) {
        const sphere = new THREE.Mesh(
          new THREE.SphereBufferGeometry(3),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 * Math.random() })
        );
        sphere.position.copy(point);
        scene.add(sphere);
      }
      // sphere.position.copy(pos);
      scene.add(sphere1);

      console.log(pos, curve.getLength(), "get vvv...............");
    },
    animationSphere() {
      if (progress > 1.0) {
        progress = 0;
      }
      progress += 0.0003;
      // console.log(progress);
      if (curve) {
        let point = curve.getPoint(progress);
        let curPoint = point;
        let nextPoint = curve.getPoint(progress + 0.0003);
        let angle = curPoint.angleTo(nextPoint);

        var dir = curve.getTangentAt(progress);

        // console.log(
        //   curPoint.angleTo(nextPoint),
        //   dir,
        //   dir.normalize(),
        //   angle,
        //   "animation point....."
        // );

        if (point) {
          console.log(dir, point, angle, "animation point.......");
          sphere1.position.copy(point);
          // otherCamera.position.copy(point);
          const [camera2, chelper, sphere] = otherCamera.children;
          camera2.position.copy(point);
          // otherCamera.children[0].lookAt(point);
          // if (dir.z > 0) {
          //   camera2.rotation.y += angle;
          //   chelper.rotation.y += angle;
          // } else {
          //   camera2.rotation.y -= angle;
          //   chelper.rotation.y -= angle;
          // }
          camera2.rotation.y += angle;
          chelper.rotation.y += angle;
          chelper.position.copy(point);
          sphere.position.copy(point);

          this.openAutoDoor(point);

          chelper.update();
          const mObject = gModel.getModel();
          if (mObject) {
            mObject.position.copy(point);
            if (dir.z > 0) {
              mObject.rotation.y -= angle;
            } else {
              mObject.rotation.y += angle;
            }
            //mObject.rotation.y += angle;
            // mObject.rotateY(angle);
          }
        }
      }
    },
    openAutoDoor(point) {
      const x = Math.floor(point.x);
      const z = point.z;

      if (z > 0) {
        isEnter = true;
      } else {
        isEnter = false;
      }
      // console.log(x, z, isEnter, "var.......");
      if (isEnter) {
        // console.log(500 < x < 510, !isOpen, "var.......");
        if (500 < x && x < 510 && !isOpen) {
          this.openDoor();
          isOpen = true;
        }
        if (470 < x && x < 480 && isOpen) {
          this.openDoor();
          isOpen = false;
        }
      } else {
        console.log(x, isOpen, isEnter, "var.......");
        if (530 < x && x < 550 && isOpen) {
          this.openDoor();
          isOpen = false;
        }
        if (493 < x && x < 500 && !isOpen) {
          this.openDoor();
          isOpen = true;
        }
      }

      // console.log(ldoor, rdoor, "get door...............");
    },
    openDoor() {
      Tools.openDoor(ldoor);

      Tools.openDoor(rdoor, "right");
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);
      this.animationSphere();
      renderer.render(scene, camera);

      // console.log(camera.position, "render camera....");
    }
  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObjects();
    // this.getDoor();
    this.initRender();
    ldoor = scene.getObjectByName("leftdoor");

    rdoor = scene.getObjectByName("rightdoor");
    // gModel
    //   .setScene(scene)
    //   .setCamera(camera)
    //   .setRenderer(renderer)
    //   .addPerson();
    this.render();
  }
};
</script>

<style>
dd {
  color: rgba(1, 1, 1);
}
</style>
