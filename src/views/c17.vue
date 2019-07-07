<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import {
  CSS2DObject,
  CSS2DRenderer
} from "three/examples/js/renderers/CSS2DRenderer";

// import { CSS2DObject, CSS2DRenderer } from "@/plugin/CSS2DRenderer";

import testdata from "@/data/test2.js";
import Tools from "@/tools/tools2.js";

import gModel from "@/tools/gmodel.js";

const pathPng = require("../assets/path_007_18.png");

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

var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

var tubeGeometry;

let labelRenderer;

var controls1;

let texture

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
      this.addPoint()
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

        new THREE.Vector3(-350, 10, -200),

        new THREE.Vector3(350, 10, -200),

        new THREE.Vector3(350, 10, 0),

        new THREE.Vector3(600, 10, 0)

        //new THREE.Vector3(-350, 10, -200)
      ]);
      curve.closed = true;

      var pointsCount = 100;
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

      texture = new THREE.TextureLoader().load(pathPng);

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      //texture.repeat.set(0.05, 0.05);

      tubeGeometry = new THREE.TubeGeometry(curve, 100, 20, 50, false);
      var tubeMaterial2 = new THREE.MeshPhongMaterial({
        // color: 0x4488ff,
        transparent: true,
        //opacity: 0.3,
        side: THREE.DoubleSide,
        map: texture
      });
      console.log(tubeGeometry, "log.......");
      var tube2 = new THREE.Mesh(tubeGeometry, tubeMaterial2);
      scene.add(tube2);
      this.getvv(curve);
    },
    offsetTexture() {
      if(texture) {
              texture.offset.x -= 0.055;
              texture.offset.y -= 0.055;
      texture.repeat.x = 4;
      texture.repeat.y = 4;
      }
    },
    getvv(curve) {
      var time = Date.now();
      var looptime = 20 * 1000;
      var t = (time % looptime) / looptime;
      var pos = curve.getPointAt(t);

      var points = curve.getPoints(100);
      var point0 = points[0].normalize();

      console.log(
        point0,
        "picker.......",
        point0.cross(tubeGeometry.tangents[0])
      );

      sphere1 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(5),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 * Math.random() })
      );
      var points = curve.getPoints(100);
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
      if (progress > 0.99) {
        progress = 0;
      }
      progress += 0.0003;
      // console.log(progress);
      if (curve) {
        let point = curve.getPointAt(progress);
        let curPoint = point;
        let nextPoint = curve.getPointAt(progress + 0.0003);
        let angle = curPoint.angleTo(nextPoint);

        var dir = curve.getTangentAt(progress);

        if (point) {
          // console.log(dir, point, angle, "animation point.......");
          sphere1.position.copy(point);
          // otherCamera.position.copy(point);
          const [camera2, chelper, sphere] = otherCamera.children;
          camera2.position.copy(point);

          chelper.rotation.y += angle;

          var lookAt = nextPoint.multiplyScalar(1);

          camera2.matrix.lookAt(camera2.position, lookAt, {
            x: 0,
            y: 0,
            z: 0
          });

          camera2.rotation.setFromRotationMatrix(
            camera2.matrix,
            camera2.rotation.order
          );
          // console.log(camera2.rotation, "animation camera2.......");
          chelper.position.copy(point);
          sphere.position.copy(point);

          this.openAutoDoor(point);

          chelper.update();
          const mObject = gModel.getModel();
          if (mObject) {
            mObject.position.copy(point);

            //mObject.rotation.y += angle;
            // mObject.rotateY(angle);

            mObject.matrix.lookAt(camera2.position, lookAt, {
              x: 0,
              y: 0,
              z: 0
            });
            mObject.rotation.setFromRotationMatrix(
              mObject.matrix,
              mObject.rotation.order
            );
          }
        }
      }
    },
    animation2() {
      const [camera2, chelper, sphere] = otherCamera.children;
      var scale = 1;
      var time = Date.now();
      var looptime = 50 * 1000;
      var t = (time % looptime) / looptime;
      var pos = tubeGeometry.parameters.path.getPointAt(t);
      pos.multiplyScalar(scale);
      // interpolation
      var segments = tubeGeometry.tangents.length;
      var pickt = t * segments;
      var pick = Math.floor(pickt);
      var pickNext = (pick + 1) % segments;
      binormal.subVectors(
        tubeGeometry.binormals[pickNext],
        tubeGeometry.binormals[pick]
      );
      binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
      var dir = tubeGeometry.parameters.path.getTangentAt(t);
      var offset = 15;
      normal.copy(binormal).cross(dir);
      // we move on a offset on its binormal
      pos.add(normal.clone().multiplyScalar(offset));
      camera2.position.copy(pos);
      sphere.position.copy(pos);
      // using arclength for stablization in look ahead
      var lookAt = tubeGeometry.parameters.path
        .getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1)
        .multiplyScalar(scale);
      // camera orientation 2 - up orientation via normal
      console.log(
        lookAt,
        "look at.......",
        tubeGeometry.parameters.path.getLength()
      );
      camera2.matrix.lookAt(camera2.position, lookAt, normal);
      camera2.rotation.setFromRotationMatrix(
        camera2.matrix,
        camera2.rotation.order
      );

      chelper.update();

      const mObject = gModel.getModel();
      if (mObject) {
        mObject.position.copy(pos);

        mObject.matrix.lookAt(mObject.position, lookAt, normal);
        mObject.rotation.setFromRotationMatrix(
          mObject.matrix,
          mObject.rotation.order
        );
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
        // console.log(x, isOpen, isEnter, "var.......");
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
      //this.animation2();
      this.offsetTexture()
      renderer.render(scene, camera);

      controls1 && controls1.update();

      // console.log(camera.position, "render camera....");
    },
    labelRender() {
      var moonDiv = document.createElement("div");
      moonDiv.className = "label";
      moonDiv.textContent = "Moon";
      moonDiv.style.marginTop = "-1em";
      var moonLabel = new THREE.CSS2DObject(moonDiv);
      moonLabel.position.set(0, 10, 0);

      scene.getObjectByName("desk").add(moonLabel);

      labelRenderer = new THREE.CSS2DRenderer();
      labelRenderer.setSize(100, 100);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = 0;
      document.body.appendChild(labelRenderer.domElement);
      controls1 = new OrbitControls(camera, labelRenderer.domElement);
      labelRenderer.render(scene, camera);
    },
    addPoint() {
      var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(100, 20, 0))
    geometry.colors.push(new THREE.Color(0xff0000));

    var material = new THREE.PointsMaterial({size: 10, vertexColors: THREE.VertexColors, opacity: 0.75, sizeAttenuation: true, transparent: true});
    var point = new THREE.Points(geometry, material);
    point.position.set(100, 120, 0);
    scene.add(point);
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
    this.labelRender();
  }
};
</script>

<style>
dd {
  color: rgba(1, 1, 1);
}
</style>
