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

    },
    createBox1() {
      testdata.models.forEach(item => {
        switch (item.modelType) {
          case "room":
            scene.add(Tools.createWall(item));
            break;
          default:
            break;
        }
      });
    },

  createBox() {
    const box1 = {
          name: '',
          modelType: 'hole',
          op: '-',
          position: [0, 0, 0],
          rotation: [0, -Math.PI/4, 0],
          visible: true,
          box: [80, 80, 80],
          start:[-500, 120, -350],
          end:[500,120,-350],
    } 
    const box2 = {
          name: '',
          modelType: 'hole',
          op: '-',
          position: [0, 0, 0],
          rotation: [0, -Math.PI/4, 0],
          visible: true,
          box: [80, 80, 80],
          start:[-500, 120, 450],
          end:[500,120,450],
    } 
    const box3 = {
          name: '',
          modelType: 'hole',
          op: '-',
          position: [0, 0, 0],
          rotation: [0, -Math.PI/4, 0],
          visible: true,
          box: [80, 80, 80],
          start:[490, 120, -350],
          end:[490,120,450],
    } 
    const box4 = {
          name: '',
          modelType: 'hole',
          op: '-',
          position: [0, 0, 0],
          rotation: [0, -Math.PI/4, 0],
          visible: true,
          box: [80, 80, 80],
          start:[-490, 120, -350],
          end:[-490,120,450],
    } 
    // const boxObj1 = Tools.createBox(box1)
    // boxObj1.geometry.faces[0].color.setHex(0x00ff00)
    // scene.add(boxObj1)

    const params = [box1, box2, box3, box4]
    this.createWall(params)
  },


createWall(params) {
      var _commonThick =  40;//墙体厚度
    var _commonLength =  100;//墙体厚度
    var _commonHeight =  300;//强体高度
    var _commonSkin =  0x98750f;
  params.forEach((wallobj)=>{
        var wallLength = _commonLength;
        var wallWidth = wallobj.thick||_commonThick;
        var positionX = ((wallobj.start[0]||0) + (wallobj.end[0]||0)) / 2;
        var positionY = ((wallobj.start[1] || 0) + (wallobj.end[1] || 0)) / 2;
        var positionZ = ((wallobj.start[2] || 0) + (wallobj.end[2] || 0)) / 2;
        //z相同 表示x方向为长度
        if (wallobj.start[2] == wallobj.end[2]) {
            wallLength = Math.abs(wallobj.start[0] - wallobj.end[0]);
            wallWidth = wallobj.thick || _commonThick;
        } else if (wallobj.start[0] == wallobj.end[0]) {
            wallLength = wallobj.thick || _commonThick;
            wallWidth = Math.abs(wallobj.start[2]- wallobj.end[2]);
        }

        let param = {
            box: [wallLength,  wallobj.height || _commonHeight, wallWidth],
            position: [positionX, positionY, positionZ],
            rotation: null,
        }

        scene.add(Tools.createBox(param))
  })
},

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      requestAnimationFrame(this.render);

      renderer.render(scene, camera);
    },








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
