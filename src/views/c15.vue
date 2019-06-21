<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import { GLTFLoader } from "three/examples/js/loaders/GLTFLoader";

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
      var helper = new THREE.CameraHelper(camera);
      scene.add(helper);
      console.log(controls, "controls.......");
      scene.add(camera);
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
    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(-100, 300, 300);
      scene.add(light);
      var light2 = new THREE.PointLight(0xff0000);
      var sphereSize = 10;
      var pointLightHelper = new THREE.PointLightHelper(light2, sphereSize);
      scene.add(pointLightHelper);
      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 1000;
      light2.position.set(0, 0, 0);
      light2.shadow.mapSize.width = 2048;
      light2.shadow.mapSize.height = 2048;
      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);
    },
    initObjects() {
      this.createFloor();
      this.createBox();
    },

    createBox() {
      var cubeGeometry = new THREE.CubeGeometry(40, 40, 40);
      var cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
      });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(-50, -50, 23 - 50);
      cube.castShadow = true;
      scene.add(cube);
      // var geometry = new THREE.SphereBufferGeometry(100, 100, 100);

      // var wireframe = new THREE.WireframeGeometry(geometry);

      // var line = new THREE.LineSegments(wireframe);
      // line.material.depthTest = false;
      // line.material.opacity = 0.25;
      // line.material.transparent = true;

      // scene.add(line);

      // var box = new THREE.Box3();
      // box.setFromCenterAndSize(
      //   new THREE.Vector3(10, 10, 10),
      //   new THREE.Vector3(200, 100, 300)
      // );

      // var helper = new THREE.Box3Helper(box, 0xffff00);
      // scene.add(helper);

      var curve = new THREE.SplineCurve([
        new THREE.Vector2(-100, 0),
        new THREE.Vector2(-5, 5),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(5, -5),
        new THREE.Vector2(10, 0)
      ]);

      var points = curve.getPoints(50);
      console.log(points, "points......");
      var geometry = new THREE.BufferGeometry().setFromPoints(points);

      var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

      // Create the final object to add to the scene
      var splineObject = new THREE.Line(geometry, material);
      splineObject.position.x = 60;
      scene.add(splineObject);

      var curve = new THREE.EllipseCurve(
        0,
        0, // ax, aY
        100,
        100, // xRadius, yRadius
        0,
        2 * Math.PI, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
      );

      var points1 = curve.getPoints(50);
      var geometry1 = new THREE.BufferGeometry().setFromPoints(points1);

      var material1 = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // Create the final object to add to the scene
      var ellipse = new THREE.Line(geometry1, material1);

      scene.add(ellipse);
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

      var edges1 = new THREE.EdgesGeometry(geometry);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
      );

      var group = new THREE.Group();
      group.add(line1);
      //scene.add(line1);

      var mesh = new THREE.Mesh(geometry, mats);

      //mesh.castShadow = true;
      mesh.receiveShadow = true;

      group.position.set(-50, -50, -50);
      group.add(mesh);
      scene.add(group);
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
