<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

import Tools from "@/tools/utils.js";

import gData from "@/data/jigui.js";
import host from "@/data/host.js";

const TWEEN = require("@tweenjs/tween.js");
let scene, camera, renderer, light, controls;
const floorJpg = require("../assets/floor.jpg");




let raycaster;
let mouseClick;
// mouseClick = new THREE.Vector2();
// raycaster = new THREE.Raycaster();
const objects = [];
let dbclick = 0;
let SELECTED;

const floor = {
                show: true,
                uuid: "",
                name: 'floor',
                objType: 'floor',
                width: 2000,
                depth: 1600,
                height: 10,
                rotation: [{ direction: 'x', degree: 0 }],//旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle] 
                x: 0,
                y: 0,
                z: 0,
                style: {
                    skinColor: 0x8ac9e2,
                    skin: {
                        up: {
                            skinColor: 0x98750f,
                            imgurl: floorJpg,
                            repeatx: true,
                            repeaty: true,
                            // width: 128,
                            // height: 128
                        },
                        down: {
                            skinColor: 0x8ac9e2,
                        },
                        before: {
                            skinColor: 0x8ac9e2,
                        }
                    }
                }
            }

export default {
  methods: {
    initScene() {
      scene = new THREE.Scene();
    },
    updateControls() {
      controls.update();
    },
    initCamera() {
      camera = new THREE.PerspectiveCamera(
        20,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.z = -1800;
      camera.position.y = 1000;
      camera.position.x = 0;
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);
      objects.push(camera);
      //controls.addEventListener( 'change', this.updateControls );
    },
    initRender() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0xffffff, 1.0);
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
      // A start
      // 第二个参数是光源强度，你可以改变它试一下
      light = new THREE.DirectionalLight(0xff0000, 1);
      // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
      light.position.set(0, 0, 1);
      scene.add(light);
      // A end
    },
    initLight1() {
      var light = new THREE.AmbientLight(0xcccccc);
      light.position.set(0, 0, 0);
      scene.add(light);
      var light2 = new THREE.PointLight(0x555555);
      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 10000;
      light2.position.set(0, 350, 0);
      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);

      // A end
    },
    initObject() {
        console.log( gData, 'data...........')
scene.add(Tools.CreateFloor(floor));

      scene.add(Tools.createEmptyCabinetX(gData));

      const data1 = {
        ...gData,
        name: "cabinet1_2",
        shellname: "cabinet1_2_shell",

        position: { x: 180, y: 0, z: -180 },
        doors: {
          doorType: "lr", // ud上下门 lr左右门 单门可以缺省
          doorSize: [1],
          doorname: ["cabinet_door_02"],
          skins: gData.doors.skins
        }
      };
      console.log(data1, "jigui 111111");
      scene.add(Tools.createEmptyCabinetX(data1));

      const data2 = {
        ...gData,
        name: "cabinet1_3",
        shellname: "cabinet1_3_shell",

        position: { x: 360, y: 0, z: -180 },
        doors: {
          doorType: "lr", // ud上下门 lr左右门 单门可以缺省
          doorSize: [1],
          doorname: ["cabinet_door_03"],
          skins: gData.doors.skins
        }
      };
      console.log(data2, "jigui 33333333333333");
      scene.add(Tools.createEmptyCabinetX(data2));

      const hostObj = Tools.createCubeX(host);
      scene.add(hostObj);
      objects.push(hostObj);

      const host1 = { ...host, y: -40, name: "equipment_card_2" };

      const hostObj1 = Tools.createCubeX(host1);
      scene.add(hostObj1);
      objects.push(hostObj1);

      const host2 = { ...host, y: -60, name: "equipment_card_3" };
      const hostObj2 = Tools.createCubeX(host2);
      scene.add(hostObj2);
      objects.push(hostObj2);
    },
    drawShape() {
      var shape = new THREE.Shape();
      shape.moveTo(10, 10);
      shape.lineTo(10, 40);
      shape.lineTo(40, 40);
      shape.lineTo(10, 10);
      return shape;
    },
    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);

      //cube.rotation.x += 0.1;
      //cube.rotation.y += 0.1;
      renderer.render(scene, camera);
    },

    init() {
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight1();
      this.initObject();
    },
    onDocumentMouseDown(event) {
      var mouse = {};
      mouse.x = event.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

      //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
      raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
      );
      dbclick++;
      console.log(111111111111111111);
      setTimeout(function() {
        dbclick = 0;
      }, 500);
      event.preventDefault();
      if (dbclick >= 2) {
        // raycaster.setFromCamera(mouseClick, camera);
        console.log(objects.concat(Tools.objects));
        var intersects = raycaster.intersectObjects(
          objects.concat(Tools.objects)
        );
        console.log(intersects);
        if (intersects.length > 0) {
          controls.enabled = false;
          SELECTED = intersects[0].object;
          if (SELECTED.name.includes("cabinet_door")) {
            console.log("open the door");
            Tools.openRightDoor(SELECTED);
          }
          if (SELECTED.name.includes("equipment_card")) {
            console.log("open the door");
            Tools.openServer(SELECTED);
          }
          controls.enabled = true;
        }
      }
    },

    onDocumentMouseMove(event) {
      // event.preventDefault();
      // mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
      // mouseClick.y = -(event.clientY / window.innerWidth) * 2 + 1;
      // raycaster.setFromCamera(mouseClick, camera);
    }
  },
  mounted() {
    this.init();
    this.render();
  }
};
</script>

<style>
</style>
