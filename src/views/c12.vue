<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import { GLTFLoader } from "three/examples/js/loaders/GLTFLoader";

let scene, camera, renderer, light, controls;

const floorJpg = require("../assets/floor.jpg");
const plantJpg = require("../assets/plant.png");
const drPng = require("../assets/door_right.png");
const dlPng = require("../assets/door_left.png");
const desktopJpg = require("../assets/orange.jpg");

const TWEEN = require("@tweenjs/tween.js");
require("threebsp");

let selectObj;
let raycaster;
let mouse;

var idleAction, walkAction, runAction;
var model, skeleton, mixer, clock, actions;
clock = new THREE.Clock();
// mouse = new THREE.Vector2();
// raycaster = new THREE.Raycaster();
let flag = 0;

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
      camera.position.y = -120;
      camera.position.x = 0;
      camera.up.x = 0;
      camera.up.y = 0;
      camera.up.z = 1;
      camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);

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

      renderer.domElement.addEventListener(
        "mousedown",
        this.onDocumentMouseDown,
        false
      );
      renderer.domElement.addEventListener(
        "mousemove",
        this.onDocumentMouseMove,
        false
      );
    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(-100, 300, 300);
      scene.add(light);
      var light2 = new THREE.PointLight(0x555555);
      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 1000;
      light2.position.set(0, -200, 300);
      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);
    },
    initObjects() {
      this.createFloor();
      //this.createPlan();
      //this.createDesk();
      //this.createChairs();
    },
    openDoor(obj, doorDirection = "left") {
      var doorstate = "close";
      var tempobj = null;
      if (obj.doorState != null && typeof obj.doorState != "undefined") {
        doorstate = obj.doorState;
        tempobj = obj.parent;
      } else {
        console.log("add parent");
        var objparent = obj.parent;
        tempobj = new THREE.Group();
        tempobj.position.set(
          obj.position.x + obj.geometry.parameters.width / 2,
          obj.position.y,
          obj.position.z
        );

        obj.position.set(-obj.geometry.parameters.width / 2, 0, 0);

        tempobj.add(obj);

        objparent.add(tempobj);
      }
      obj.doorState = doorstate == "close" ? "open" : "close";
      console.log("tween..........", tempobj, obj);

      new TWEEN.Tween(tempobj.rotation)
        .to(
          {
            y:
              doorstate == "close"
                ? (doorDirection == "left" ? -3 / 5 : -3 / 5) * Math.PI
                : 0 * (3 / 5) * Math.PI
          },
          10000
        )
        .easing(TWEEN.Easing.Elastic.Out)
        .start();
      console.log("update..........xxxxxx", tempobj, obj);
    },
    onDocumentMouseDown(event) {
      //raycaster.setFromCamera(mouse, camera);

      var mouse = {};
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera);

      //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
      raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
      );

      console.log(scene.children, "scene......", raycaster, camera);

      var intersects = raycaster.intersectObjects(scene.children, true);

      console.log(intersects, "intersect......");

      if (intersects.length > 0) {
        controls.enabled = false;

        selectObj = intersects[0].object;

        if (selectObj.name.includes("leftdoor")) {
          this.openDoor(selectObj);
        }
        if (selectObj.name.includes("rightdoor")) {
          this.openDoor(selectObj, "right");
        }

        controls.enabled = true;
      }
    },

    onDocumentMouseMove(event) {
      // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // mouse.y = -(event.clientY / window.innerWidth) * 2 + 1;
      // raycaster.setFromCamera(mouse, camera);
    },
    createChairs() {
      const yOffset = 20 / 3;

      const chair1 = this.createChair();

      var axis = new THREE.AxesHelper(50);

      const leftGroup = new THREE.Group();

      chair1.position.y = -40;
      leftGroup.add(chair1);
      for (let i = 0; i < 3; i++) {
        let chairObj = chair1.clone();
        chairObj.position.y = -40 + (i + 1) * 20 + yOffset * (i + 1);
        leftGroup.add(chairObj);
      }

      scene.add(leftGroup);
      const rightGroup = leftGroup.clone();
      leftGroup.add(axis);
      rightGroup.rotation.set(0, 0, Math.PI);
      rightGroup.add(axis);
      scene.add(rightGroup);

      const topGroup = new THREE.Group();
      topGroup.position.set(0, 20, 0);
      topGroup.rotation.set(0, 0, -Math.PI / 2);
      for (let i = 0; i < 2; i++) {
        let chairObj = chair1.clone();
        chairObj.position.y = -20 + i * 20 + 20 * i;
        topGroup.add(chairObj);
      }

      scene.add(topGroup);

      const bottomGroup = topGroup.clone();
      topGroup.add(axis);
      bottomGroup.position.set(0, -20, 0);
      bottomGroup.rotation.set(0, 0, Math.PI / 2);
      bottomGroup.add(axis);
      console.log(bottomGroup, "bottom......");
      scene.add(bottomGroup);
    },
    createDesk() {
      const size = {
        width: 60,
        height: 100,
        depth: 30
      };

      const holes = {
        width: 10,
        height: 80,
        depth: 30
      };

      const sideHoles = {
        width: 25,
        height: 80,
        depth: 20
      };

      const desktop = {
        size: [size.width, size.height, size.depth],
        position: [0, 0, size.depth / 2 + 3],
        rotation: null,
        holes: [
          {
            size: [holes.width, holes.height, holes.depth],
            position: [0, 0, 0]
          },
          {
            size: [sideHoles.width, sideHoles.height, sideHoles.depth],
            position: [
              -size.width / 2 + sideHoles.width / 2,
              0,
              -(size.depth - sideHoles.depth) / 2
            ]
          },
          {
            size: [sideHoles.width, sideHoles.height, sideHoles.depth],
            position: [
              size.width / 2 - sideHoles.width / 2,
              0,
              -(size.depth - sideHoles.depth) / 2
            ]
          }
        ]
      };
      this.addDesk(
        desktop.size,
        desktop.position,
        desktop.rotation,
        desktop.holes
      );
    },
    createChair() {
      const size = {
        width: 20,
        height: 20,
        depth: 2
      };

      const height = 20;

      const holes = {
        width: 2,
        height: 2,
        depth: 20
      };
      const x = size.width / 2 - holes.width / 2;
      const y = size.height / 2 - holes.height / 2;
      const board = {
        width: 2,
        height: 20,
        depth: 10
      };
      const desktop = {
        size: [size.width, size.height, size.depth],
        position: [-50, 0, holes.depth + size.depth / 2],
        rotation: null,
        holes: [
          {
            size: [holes.width, holes.height, holes.depth],
            position: [x, y, -holes.depth / 2]
          },
          {
            size: [holes.width, holes.height, holes.depth],
            position: [-x, y, -holes.depth / 2]
          },
          {
            size: [holes.width, holes.height, holes.depth],
            position: [-x, -y, -holes.depth / 2]
          },
          {
            size: [holes.width, holes.height, holes.depth],
            position: [x, -y, -holes.depth / 2]
          },
          {
            size: [holes.width, holes.height, holes.depth],
            position: [-x, y, holes.depth / 2]
          },
          {
            size: [holes.width, holes.height, holes.depth],
            position: [-x, -y, holes.depth / 2]
          },
          {
            size: [board.width, board.height, board.depth],
            position: [-x, 0, board.height]
          }
        ]
      };
      return this.addChair(
        desktop.size,
        desktop.position,
        desktop.rotation,
        desktop.holes
      );
    },
    addChair(size, position, rotation, holes) {
      var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

      let mats = [];

      const texture = new THREE.TextureLoader().load(desktopJpg);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.25, 0.25);

      const material2 = { map: texture, transparent: true };
      mats.push(new THREE.MeshBasicMaterial(material2));

      var materials = new THREE.MeshLambertMaterial({
        color: 0xb0cee0,
        side: THREE.DoubleSide
      });

      var result = new THREE.Mesh(geometry, materials);

      if (holes) {
        for (var i = 0; i < holes.length; i++) {
          var totalBSP = new ThreeBSP(result);
          var hole = holes[i];
          var holeGeometry = new THREE.BoxGeometry(
            hole.size[0],
            hole.size[1],
            hole.size[2]
          );

          var holeCube = new THREE.Mesh(holeGeometry, materials);

          holeCube.position.x = hole.position[0];
          holeCube.position.y = hole.position[1];
          holeCube.position.z = hole.position[2];

          if (hole.rotation) {
            holeCube.rotation.set(...hole.rotation);
          }
          var clipBSP = new ThreeBSP(holeCube);
          var resultBSP = totalBSP.union(clipBSP);
          result = resultBSP.toMesh(mats);
        }
      }
      console.log(result, "result....... desktop");
      // result.material = materials;
      result.position.set(...position);
      if (rotation) {
        result.rotation.set(...rotation);
      }
      var geom = result.geometry;
      var edges1 = new THREE.EdgesGeometry(geom);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0x0000ff })
      );
      var group = new THREE.Group();
      group.position.copy(result.position);
      group.rotation.copy(result.rotation);
      result.position.set(0, 0, 0);
      result.rotation.set(0, 0, 0);

      // var axis = new THREE.AxesHelper(50);
      // // 在场景中添加坐标轴
      // group.add(axis);

      group.add(line1);
      group.add(result);
      scene.add(group);
      return group;
    },
    createPlan() {
      this.createWall();
      const width = 180;
      const position = {
        x: width / 2,
        y: width / 2,
        z: 3
      };
      const offset = 5;
      this.addPlant(
        [-position.x + offset, position.y - offset, position.z],
        [Math.PI / 2, 0, 0]
      );
      this.addPlant(
        [-position.x + offset, -position.y + offset, position.z],
        [Math.PI / 2, 0, 0]
      );
      this.addPlant(
        [position.x - offset, position.y - offset, position.z],
        [Math.PI / 2, 0, 0]
      );
      this.addPlant(
        [position.x - offset, -position.y + offset, position.z],
        [Math.PI / 2, 0, 0]
      );
    },
    addDesk(size, position, rotation, holes) {
      var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

      let mats = [];

      const texture = new THREE.TextureLoader().load(desktopJpg);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.25, 0.25);

      const material2 = { map: texture, transparent: true };
      mats.push(new THREE.MeshBasicMaterial(material2));

      var materials = new THREE.MeshLambertMaterial({
        color: 0xb0cee0,
        side: THREE.DoubleSide
      });

      var result = new THREE.Mesh(geometry, materials);

      if (holes) {
        for (var i = 0; i < holes.length; i++) {
          var totalBSP = new ThreeBSP(result);
          var hole = holes[i];
          var holeGeometry = new THREE.BoxGeometry(
            hole.size[0],
            hole.size[1],
            hole.size[2]
          );

          var holeCube = new THREE.Mesh(holeGeometry, materials);

          holeCube.position.x = hole.position[0];
          holeCube.position.y = hole.position[1];
          holeCube.position.z = hole.position[2];
          var clipBSP = new ThreeBSP(holeCube);
          var resultBSP = totalBSP.subtract(clipBSP);
          result = resultBSP.toMesh(mats);
        }
      }
      console.log(result, "result....... desktop");
      // result.material = materials;
      result.position.set(...position);
      if (rotation) {
        result.rotation.set(...rotation);
      }
      var geom = result.geometry;
      var edges1 = new THREE.EdgesGeometry(geom);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0x0000ff })
      );
      var group = new THREE.Group();
      group.position.copy(result.position);
      group.rotation.copy(result.rotation);
      result.position.set(0, 0, 0);
      result.rotation.set(0, 0, 0);

      result.castShadow = true;
      //result.receiveShadow = true;

      group.castShadow = true;
      //group.receiveShadow = true;

      var axis = new THREE.AxesHelper(50);
      // 在场景中添加坐标轴
      group.add(axis);

      group.add(line1);
      group.add(result);
      scene.add(group);
      return group;
    },
    createWall() {
      const size = {
        width: 180,
        height: 100,
        depth: 3
      };
      const floorHeight = 3;

      const frontHoles = {
        width: 60,
        height: size.depth,
        depth: 60
      };
      const windowsNum = 2;

      const cemianHoles = {
        width: 80,
        height: 80,
        depth: size.depth
      };

      const wall1 = {
        size: [size.width, size.depth, size.height],
        position: [0, -size.width / 2, size.height / 2 + floorHeight],
        rotation: null,
        holes: [
          {
            size: [frontHoles.width, frontHoles.height, frontHoles.depth],
            position: [(size.width - frontHoles.width) / 3, 0, 0]
          },
          {
            size: [frontHoles.width, frontHoles.height, frontHoles.depth],
            position: [-(size.width - frontHoles.width) / 3, 0, 0]
          }
        ],
        doors: null
      };

      const wall2 = {
        size: [size.width, size.depth, size.height],
        position: [0, size.width / 2, size.height / 2 + floorHeight],
        rotation: null,
        holes: null,
        doors: null
      };

      const wall3 = {
        size: [size.height, size.width - size.depth, size.depth],
        position: [
          -size.width / 2 + size.depth / 2,
          0,
          size.height / 2 + floorHeight
        ],
        rotation: [0, Math.PI / 2, 0],
        holes: [
          {
            size: [cemianHoles.width, cemianHoles.height, size.depth],
            position: [(size.height - cemianHoles.height) / 2, 0, 0]
          }
        ],
        doors: [
          {
            size: [cemianHoles.width / 2, cemianHoles.height, 1],
            position: [
              (size.height - cemianHoles.height) / 2,
              cemianHoles.height / 4,
              0
            ],
            name: "leftdoor",
            rotation: [0, 0, Math.PI / 2]
          },
          {
            size: [cemianHoles.width / 2, cemianHoles.height, 1],
            position: [
              (size.height - cemianHoles.height) / 2,
              -cemianHoles.height / 4,
              0
            ],
            name: "rightdoor",
            rotation: [0, 0, -Math.PI / 2]
          }
        ]
      };

      const wall4 = {
        size: [size.height, size.width - size.depth, size.depth],
        position: [
          size.width / 2 - size.depth / 2,
          0,
          size.height / 2 + floorHeight
        ],
        rotation: [0, Math.PI / 2, 0],
        holes: null,
        doors: null
      };
      const walls = [wall1, wall2, wall3, wall4];
      walls.forEach(item => {
        this.addWall(
          item.size,
          item.position,
          item.rotation,
          item.holes,
          item.doors
        );
      });
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
      texture.repeat.set(0.25, 0.25);

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
    addDoor(size, position, rotation, name) {
      var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

      var materials = new THREE.MeshLambertMaterial({
        color: 0xb0cee0,
        side: THREE.DoubleSide,
        transparent: true
        // opacity: 0.1
      });

      let mats = [];
      var defaultMaterials = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0x393939),
        vertexColors: THREE.FaceColors
      });

      const texture = new THREE.TextureLoader().load(drPng);

      const material2 = { map: texture, transparent: true };
      const leftM = new THREE.MeshLambertMaterial(material2);

      const texture1 = new THREE.TextureLoader().load(dlPng);

      const material3 = { map: texture1, transparent: true };
      const rightM = new THREE.MeshLambertMaterial(material3);
      mats = [
        defaultMaterials,
        defaultMaterials,
        defaultMaterials,
        defaultMaterials,
        leftM,
        rightM
      ];
      var result = new THREE.Mesh(geometry, mats);

      result.name = name;

      console.log(geometry, result, "doors........");

      result.position.set(...position);

      if (rotation) {
        result.rotation.set(...rotation);
      }

      var edges1 = new THREE.EdgesGeometry(geometry);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      );
      var group = new THREE.Group();

      result.castShadow = true;
      //result.receiveShadow = true;

      group.position.copy(result.position);
      group.rotation.copy(result.rotation);
      result.position.set(0, 0, 0);
      result.rotation.set(0, 0, 0);

      group.add(line1);
      group.add(result);

      return group;
    },
    addWall(size, position, rotation, holes, doors) {
      var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

      var materials = new THREE.MeshLambertMaterial({
        color: 0xb0cee0,
        side: THREE.DoubleSide
      });
      var result = new THREE.Mesh(geometry, materials);

      if (holes) {
        for (var i = 0; i < holes.length; i++) {
          var totalBSP = new ThreeBSP(result);
          var hole = holes[i];
          var holeGeometry = new THREE.BoxGeometry(
            hole.size[0],
            hole.size[1],
            hole.size[2]
          );

          var holeCube = new THREE.Mesh(holeGeometry, materials);

          holeCube.position.x = hole.position[0];
          holeCube.position.y = hole.position[1];
          holeCube.position.z = hole.position[2];
          var clipBSP = new ThreeBSP(holeCube);
          var resultBSP = totalBSP.subtract(clipBSP);
          result = resultBSP.toMesh(materials);
        }
      }
      console.log(result, "result.......");
      result.material = materials;
      result.position.set(...position);
      if (rotation) {
        result.rotation.set(...rotation);
      }
      var geom = result.geometry;
      var edges1 = new THREE.EdgesGeometry(geom);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0x0000ff })
      );
      var group = new THREE.Group();
      group.position.copy(result.position);
      group.rotation.copy(result.rotation);
      result.position.set(0, 0, 0);
      result.rotation.set(0, 0, 0);

      if (doors) {
        doors.forEach(item => {
          let door = this.addDoor(
            item.size,
            item.position,
            item.rotation,
            item.name
          );
          group.add(door);
        });
      }
      var axis = new THREE.AxesHelper(50);
      // 在场景中添加坐标轴
      group.add(axis);

      group.add(line1);
      group.add(result);
      scene.add(group);
      return group;
    },
    addPlant(position, rotation, scale) {
      var plant = new THREE.Object3D();
      var geometry = new THREE.CylinderBufferGeometry(0.15, 0.1, 0.4, 22);
      var material = new THREE.MeshLambertMaterial({ color: 0xcccccc });

      var cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.x = 0;
      cylinder.position.y = 0.2;
      cylinder.position.z = 0;
      plant.add(cylinder);

      var leafTexture = new THREE.TextureLoader().load(plantJpg);
      var leafMaterial = new THREE.MeshBasicMaterial({
        map: leafTexture,
        side: THREE.DoubleSide,
        transparent: true
      });
      // var leafMaterial = new THREE.MeshBasicMaterial({
      //   side: THREE.DoubleSide,
      //   transparent: true
      // });
      var geom = new THREE.PlaneGeometry(0.4, 0.8);
      for (var i = 0; i < 4; i++) {
        var leaf = new THREE.Mesh(geom, leafMaterial);
        leaf.position.y = 0.8;
        leaf.rotation.y = -Math.PI / (i + 1);
        plant.add(leaf);
      }
      plant.position.x = position[0];
      plant.position.y = position[1];
      plant.position.z = position[2];
      plant.scale.set(15, 15, 15);
      if (rotation) {
        plant.rotation.set(...rotation);
      }
      scene.add(plant);
      return plant;
    },
    createOther() {
      var geometry = new THREE.Geometry();

      geometry.vertices.push(
        new THREE.Vector3(-10, 10, 10),
        new THREE.Vector3(-10, -10, 0),
        new THREE.Vector3(10, -10, 0)
      );

      geometry.faces.push(new THREE.Face3(0, 2, 1));

      geometry.computeBoundingSphere();
      geometry.computeFaceNormals();

      var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        color: 0x0000ff,
        transparent: true,
        opacity: 0.1
      });

      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);
    },
    createCustom() {
      var geometry = new THREE.BufferGeometry();
      var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide
      });
      var v = new THREE.Vector3();
      var v0 = new THREE.Vector3();
      var v1 = new THREE.Vector3();
      var v2 = new THREE.Vector3();
      var color = new THREE.Color();
      var vertices = [];
      var colors = [];
      for (var i = 0; i < 1; i++) {
        v.set(
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500
        );
        v0.set(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50
        );
        v1.set(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50
        );
        v2.set(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50
        );
        // v0.add(v);
        // v1.add(v);
        // v2.add(v);
        color.setHex(Math.random() * 0xffffff);
        // create a single triangle
        vertices.push(v0.x, v0.y, v0.z);
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
      }
      console.log(vertices);
      geometry.addAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.addAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      var group = new THREE.Mesh(geometry, material);
      group.scale.set(2, 2, 2);
      scene.add(group);
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);

      //cube.rotation.x += 0.1;
      //cube.rotation.y += 0.1;
      renderer.render(scene, camera);

      if (!model) {
        return;
      }

      if (flag == 0) {
        model.position.y += 0.1;
        flag = model.position.y > 100 ? 1 : 0;
        if (flag == 1) {
          model.rotation.set(model.rotation.x, -Math.PI, 0);
        }
      } else {
        model.position.y -= 0.1;
        flag = model.position.y > 0 ? 1 : 0;
        if (flag == 0) {
          model.rotation.set(model.rotation.x, Math.PI * 2, 0);
        }
      }
    },
    addPerson() {
      var loader = new THREE.GLTFLoader();
      loader.load("./static/Soldier.glb", gltf => {
        console.log(gltf, "gltf......");
        model = gltf.scene;
        model.position.set(0, 0, 3);
        // model.up.set(0, 0, 1);
        model.rotation.set(Math.PI / 2, 0, 0);
        var axis = new THREE.AxesHelper(50);
        // 在场景中添加坐标轴
        model.add(axis);
        model.scale.set(20, 20, 20);
        scene.add(model);
        model.visible = true;
        model.traverse(function(object) {
          if (object.isMesh) object.castShadow = true;
        });
        //
        skeleton = new THREE.SkeletonHelper(model);
        skeleton.visible = false;
        scene.add(skeleton);

        var animations = gltf.animations;
        mixer = new THREE.AnimationMixer(model);
        idleAction = mixer.clipAction(animations[0]);
        walkAction = mixer.clipAction(animations[3]);
        runAction = mixer.clipAction(animations[1]);
        actions = [idleAction, walkAction, runAction];
        this.activateAllActions();
        this.animate();
      });

      renderer.gammaOutput = true;
      renderer.gammaFactor = 2.2;
      window.addEventListener("resize", this.onWindowResize, false);
    },
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      // Render loop
      requestAnimationFrame(this.animate);

      // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
      var mixerUpdateDelta = clock.getDelta();
      // If in single step mode, make one step and then do nothing (until the user clicks again)

      // Update the animation mixer, the stats panel, and render this frame
      mixer.update(mixerUpdateDelta);

      renderer.render(scene, camera);
    },
    activateAllActions() {
      this.setWeight(idleAction, 0.0);
      this.setWeight(walkAction, 1.0);
      this.setWeight(runAction, 0.0);
      actions.forEach(function(action) {
        action.play();
      });
    },
    setWeight(action, weight) {
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(weight);
    }
  },
  mounted() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObjects();

    this.initRender();

    this.addPerson();
    this.render();
  }
};
</script>

<style>
</style>
