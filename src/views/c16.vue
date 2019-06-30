<template>
  <div id="container"></div>
</template>

<script>


import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import testdata from "@/data/test.js";
import Tools from "@/tools/tools.js";
import gModel from "@/tools/gmodel.js";



let scene, camera, renderer, light, controls, floor;

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
      Tools.addCamera(camera);
      Tools.addScene(scene);
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
      //this.createTube();
      //this.createFloor();
      // this.addFlyLine();
      // this.addLine2();
      // this.addCurve();
      //this.createCricle();
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
            scene.add(Tools.createWall(item));
            break;
          case "floor":
          floor = Tools.createFloor(item)
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

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);

      gModel.run();

      renderer.render(scene, camera);
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },

    createFlyLine(startPoint, endPoint, heightLimit, flyTime, lineStyle) {
      var middleCurvePositionX = (startPoint.x + endPoint.x) / 2;
      var middleCurvePositionY = heightLimit;
      var middleCurvePositionZ = (startPoint.z + endPoint.z) / 2;

      var curveData = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z),
        new THREE.Vector3(
          middleCurvePositionX,
          middleCurvePositionY,
          middleCurvePositionZ
        ),
        new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
      ]);
      var curveModelData = curveData.getPoints(50);

      var curveGeometry = new THREE.Geometry();
      curveGeometry.vertices = curveModelData.slice(0, 1);
      var curveMaterial = new THREE.LineBasicMaterial({
        color: lineStyle.color,
        linewidth: lineStyle.linewidth
      });
      var curve = new THREE.Line(curveGeometry, curveMaterial);

      var tween = new TWEEN.Tween({ endPointIndex: 1 }).to(
        { endPointIndex: 50 },
        flyTime
      );
      console.log(tween);
      tween.onUpdate(function tweenHandler(data) {
        console.log(data);
        var endPointIndex = Math.ceil(data.endPointIndex);

        var curvePartialData = new THREE.CatmullRomCurve3(
          curveModelData.slice(0, endPointIndex)
        );

        curve.geometry.vertices = curvePartialData.getPoints(50);
        curve.geometry.verticesNeedUpdate = true;
      });

      tween.start();

      return curve;
    },

    addFlyLine() {
      var startPoint = {
        x: 0,
        y: 0,
        z: 0
      };

      var endPoint = {
        x: -80,
        y: 0,
        z: 50
      };

      var heightLimit = 20;

      var flyTime = 8000;

      var lineStyle = {
        color: 0xcc0000,
        linewidth: 2
      };
      var aCurve = this.createFlyLine(
        startPoint,
        endPoint,
        heightLimit,
        flyTime,
        lineStyle
      );
      scene.add(aCurve);
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
      var width = 2;
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
        })
      );
      scene.add(ribbon);

      var line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: "red",
          depthTest: false
        })
      );
      scene.add(line);
    },
    addCurve() {
      var curve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-80, -40, 0),
          new THREE.Vector3(-70, 40, 0),
          new THREE.Vector3(70, 40, 0),
          new THREE.Vector3(80, -40, 0)
        ],
        false /*是否闭合*/
      );
      var tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.6, 50, false);
      var textureLoader = new THREE.TextureLoader();
      var texture = textureLoader.load("run.jpg");
      // 设置阵列模式为 RepeatWrapping
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
      //等价texture.repeat= new THREE.Vector2(20,1)
      texture.repeat.x = 20;
      var tubeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true
      });
      var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);
      /**
       * 创建一个半透明管道
       */
      var tubeGeometry2 = new THREE.TubeGeometry(curve, 100, 20, 50, false);
      var tubeMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      var tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial2);
      scene.add(tube2);
    },
    createCricle() {
      var radius = 40,
        segments = 64,
        material = new THREE.LineBasicMaterial({ color: 0x0000ff }),
        geometry = new THREE.CircleGeometry(radius, segments);

      // Remove center vertex
      geometry.vertices.shift();

      scene.add(new THREE.Line(geometry, material));
    },

  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObjects();
    this.initRender();

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
