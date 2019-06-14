<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

import Tools from "@/tools/utils.js";

// import gData from "@/data/jigui.js";
// import host from "@/data/host.js";

const TWEEN = require("@tweenjs/tween.js");
let scene, camera, renderer, light, controls;
const floorJpg = require("../assets/floor.jpg");

let raycaster;
let mouse;

mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

const objects = [];
let dbclick = 0;
let SELECTED;

const openRightDoor = _obj => {
  var doorstate = "close";
  var tempobj = null;
  if (_obj.doorState != null && typeof _obj.doorState != "undefined") {
    doorstate = _obj.doorState;
    tempobj = _obj.parent;
  } else {
    console.log("add parent");
    var _objparent = _obj.parent;
    tempobj = new THREE.Object3D();
    tempobj.position.set(
      _obj.position.x - _obj.geometry.parameters.width / 2,
      _obj.position.y,
      _obj.position.z
    );

    console.log(
      _obj.position.x - _obj.geometry.parameters.width / 2,
      _obj.position.y,
      _obj.position.z,
      _obj.geometry.parameters.width,
      "open the door"
    );
    _obj.position.set(_obj.geometry.parameters.width / 2, 0, 0);
    // tempobj.name = _obj.name;
    tempobj.add(_obj);
    _objparent.add(tempobj);
  }
  _obj.doorState = doorstate == "close" ? "open" : "close";

  new TWEEN.Tween(tempobj.rotation)
    .to(
      {
        y: doorstate == "close" ? (3 / 4) * Math.PI : 0 * 2 * Math.PI
      },
      10000
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
};

const floor = {
  show: true,
  uuid: "",
  name: "floor",
  objType: "floor",
  width: 2000,
  depth: 1600,
  height: 10,
  rotation: [{ direction: "x", degree: 0 }], //旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle]
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
        repeaty: true
        // width: 128,
        // height: 128
      },
      down: {
        skinColor: 0x8ac9e2
      },
      before: {
        skinColor: 0x8ac9e2
      }
    }
  }
};

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
        60,
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
      var helper = new THREE.CameraHelper(camera);
      scene.add(helper);
      //controls.addEventListener( 'change', this.updateControls );
    },
    initRender() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x225f93, 1.0);
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
    },
    addtest() {
      var box = new THREE.BoxGeometry(1000, 100, 10, 1, 1, 100);

      var boxMesh = new THREE.Mesh(
        box,
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      );

      var boxFace = new THREE.BoxGeometry(1000, 100, 10, 1, 1, 100);

      var boxFaceMesh = new THREE.Mesh(
        boxFace,
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
      );
      // objects.push(boxMesh);
      boxFaceMesh.position.set(0, 0, -600);

      scene.add(boxFaceMesh);

      var boxFaceLeft = new THREE.BoxGeometry(600, 100, 10, 1, 1, 100);

      var boxFaceLeftMesh = new THREE.Mesh(
        boxFaceLeft,
        new THREE.MeshBasicMaterial({
          color: 0x0000ff * THREE.Math.randInt(1, 100)
        })
      );
      // objects.push(boxMesh);
      boxFaceLeftMesh.position.set(500, 0, -300);

      boxFaceLeftMesh.rotateY(Math.PI / 2);

      scene.add(boxFaceLeftMesh);

      var boxFaceRight = new THREE.BoxGeometry(600, 100, 10, 1, 1, 100);

      var boxFaceRightMesh = new THREE.Mesh(
        boxFaceRight,
        new THREE.MeshBasicMaterial({
          color: 0x0000ff * THREE.Math.randInt(1, 100)
        })
      );
      // objects.push(boxMesh);
      boxFaceRightMesh.position.set(-500, 0, -300);

      boxFaceRightMesh.rotateY(Math.PI / 2);

      scene.add(boxFaceRightMesh);

      var rd = new THREE.BoxGeometry(50, 100, 10, 1, 1, 1);
      // rd.name = "red_door_outer";
      var plane = new THREE.Mesh(
        rd,
        new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
      );

      plane.side = THREE.DoubleSide;

      plane.name = "red_door_inner";
      //plane.position.set(50, 0, 0);

      var fobjBSP = new ThreeBSP(boxMesh);
      var sobjBSP = new ThreeBSP(plane);
      var resultBSP = fobjBSP.subtract(sobjBSP);

      var result = resultBSP.toMesh();
      result.material.shading = THREE.FlatShading;
      result.geometry.computeFaceNormals();
      result.geometry.computeVertexNormals();
      result.material.needsUpdate = true;
      result.geometry.buffersNeedUpdate = true;
      result.geometry.uvsNeedUpdate = true;
      result.name = "red_wall_outer";
      result.castShadow = true;
      result.receiveShadow = true;
      // dummy.add(plane);

      // dummy.position.set(0, 0, 0);

      scene.add(result);

      objects.push(result);
      var axesHelper = new THREE.AxesHelper(205);
      scene.add(axesHelper);
      scene.add(plane);

      objects.push(plane);

      var helper = new THREE.GridHelper(2000, 100);
      helper.position.y = -300;
      helper.material.opacity = 0.25;
      helper.material.transparent = true;
      scene.add(helper);

      var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
      planeGeometry.rotateX(-Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.y = -200;
      plane.receiveShadow = true;
      scene.add(plane);
    },
    initObject() {
      this.addtest();
    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera);

      requestAnimationFrame(this.render);
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
      var intersects = raycaster.intersectObjects(objects);
      console.log(intersects, "111111111");
      var obj;
      if (intersects.length > 0) {
        obj = intersects[0].object;
      }
      if (!obj) {
        return;
      }
      if (obj.name.includes("red_door")) {
        openRightDoor(obj);
      }
    },

    onDocumentMouseMove(event) {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
