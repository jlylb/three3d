<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/js/controls/OrbitControls";

// import Earcut from "earcut";

var Earcut = require("earcut");

let scene, camera, renderer, light, controls;

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
        10000
      );
      camera.position.z = 60;
      camera.position.y = 100;
      camera.position.x = 0;
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      camera.lookAt({ x: 0, y: 0, z: 0 });
      controls = new OrbitControls(camera);

      scene.add(camera);
    },
    initRender() {
      var axis = new THREE.AxesHelper(20);
      // 在场景中添加坐标轴
      scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
      renderer.setClearColor(0x225f93, 1.0);
    },
    initLight() {
      light = new THREE.AmbientLight(0xffffff);
      light.position.set(0, 300, 0);
      scene.add(light);
    },
    initObjects() {
      // const box = new THREE.BoxGeometry(100, 60, 30, 1, 1, 1);
      // const materia = new THREE.MeshBasicMaterial({
      //   color: 0x000000,
      //   transparent: true,
      //   opacity: 0.1
      // });
      // var edges1 = new THREE.EdgesGeometry(box);
      // var line1 = new THREE.LineSegments(
      //   edges1,
      //   new THREE.LineBasicMaterial({ color: 0x00fff0 })
      // );
      // scene.add(line1);
      // const mesh = new THREE.Mesh(box, materia);
      // scene.add(mesh);

      // var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
      // var edges = new THREE.EdgesGeometry(geometry);
      // var line = new THREE.LineSegments(
      //   edges,
      //   new THREE.LineBasicMaterial({ color: 0x00fff0 })
      // );
      // scene.add(line);

      // this.createCustom();
      // this.createOther();
      this.createPlan();
      this.createText();
    },
    createText() {},
    createPlan() {
      var geometry = new THREE.Geometry();
      // geometry.colorsNeedUpdate = true;
      // geometry.elementsNeedUpdate = true;

      geometry.vertices.push(
        new THREE.Vector3(-10, -10, 10), // 0
        new THREE.Vector3(10, -10, 10), // 1

        new THREE.Vector3(-10, 10, 10), // 2
        new THREE.Vector3(10, 10, 10), // 3

        new THREE.Vector3(-10, 10, -10), // 4
        new THREE.Vector3(10, 10, -10), // 5

        new THREE.Vector3(-10, -10, -10), // 6
        new THREE.Vector3(10, -10, -10) // 7
      );
      //正侧
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(1, 2, 3));

      //顶
      geometry.faces.push(new THREE.Face3(2, 3, 4));
      geometry.faces.push(new THREE.Face3(3, 4, 5));
      //右侧
      geometry.faces.push(new THREE.Face3(3, 7, 5));
      geometry.faces.push(new THREE.Face3(3, 7, 1));

      //底
      geometry.faces.push(new THREE.Face3(0, 1, 6));
      geometry.faces.push(new THREE.Face3(6, 1, 7));
      //左侧
      geometry.faces.push(new THREE.Face3(0, 6, 2));
      geometry.faces.push(new THREE.Face3(6, 2, 4));
      //对侧
      geometry.faces.push(new THREE.Face3(7, 6, 4));
      geometry.faces.push(new THREE.Face3(7, 4, 5));

      // for (let i = 0; i < geometry.faces.length; i++) {
      //   let hex = Math.random() * 0xffffff;
      //   geometry.faces[i].color.setHex(hex);
      // }
      // var geometry = new THREE.BoxGeometry(10, 10, 10);

      let mats = [];

      for (var i = 0; i < geometry.faces.length; i++) {
        mats.push(
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(Math.random() * 0xffffff),
            vertexColors: THREE.FaceColors,
            side: THREE.DoubleSide,
            wireframe: true
            // transparent: true,
            // opacity: 0.2
          })
        );
      }

      for (let i = 0; i < geometry.faces.length; i += 2) {
        geometry.faces[i].materialIndex = i / 2;
        geometry.faces[i + 1].materialIndex = i / 2;
      }

      var mesh = new THREE.Mesh(geometry, mats);

      console.log(geometry.faces, "log.....");
      mesh.position.set(0, 0, 0);
      geometry.computeBoundingSphere();
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      console.log(mesh);
      // scene.add(mesh);

      var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        color: 0x00ff00,
        transparent: true,
        opacity: 0.2
      });
      const points = [
        [-30, -20, -10],
        [-30, 20, 10],
        [30, 20, 10],
        [30, -10, -5],
        [30, -20, -10]
      ];
      var geom1 = this.getGeometry(points, 10);
      console.log(geom1, "gemo1.....");
      var edges1 = new THREE.EdgesGeometry(geom1);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0xfff000 })
      );
      //scene.add(line1);
      var mesh1 = new THREE.Mesh(geom1, material);
      var group = new THREE.Group();
      group.add(mesh1);
      group.add(line1);

      group.position.set(0, -20, 0);
      scene.add(group);
      this.createExcut();
    },
    getGeometry(points, height) {
      var topPoints = [];
      for (var i = 0; i < points.length; i++) {
        var vertice = points[i];
        topPoints.push([vertice[0], vertice[1] + height, vertice[2]]);
      }
      var totalPoints = points.concat(topPoints);
      var vertices = []; //所有的顶点
      for (var i = 0; i < totalPoints.length; i++) {
        vertices.push(
          new THREE.Vector3(
            totalPoints[i][0],
            totalPoints[i][1],
            totalPoints[i][2]
          )
        );
      }
      var length = points.length;
      var faces = [];
      for (var j = 0; j < length; j++) {
        //侧面生成三角形
        if (j != length - 1) {
          faces.push(new THREE.Face3(j, j + 1, length + j + 1));
          faces.push(new THREE.Face3(length + j + 1, length + j, j));
        } else {
          faces.push(new THREE.Face3(j, 0, length));
          faces.push(new THREE.Face3(length, length + j, j));
        }
      }
      var data = [];
      for (var i = 0; i < length; i++) {
        data.push(points[i][0], points[i][2]);
      }

      var triangles = Earcut(data);

      console.log(triangles, "Earcut...");
      if (triangles && triangles.length != 0) {
        for (var i = 0; i < triangles.length; i++) {
          var tlength = triangles.length;
          if (i % 3 == 0 && i < tlength - 2) {
            faces.push(
              new THREE.Face3(triangles[i], triangles[i + 1], triangles[i + 2])
            ); //底部的三角面
            faces.push(
              new THREE.Face3(
                triangles[i] + length,
                triangles[i + 1] + length,
                triangles[i + 2] + length
              )
            ); //顶部的三角面
          }
        }
      }
      var geometry = new THREE.Geometry();
      geometry.vertices = vertices;
      geometry.faces = faces;
      geometry.computeFaceNormals(); //自动计算法向量
      return geometry;
    },
    createExcut() {
      var length = 12,
        width = 30;

      var shape = new THREE.Shape();
      shape.moveTo(-30, -20);
      shape.lineTo(-30, 20);
      shape.lineTo(30, 20);
      shape.lineTo(30, -10);
      shape.lineTo(20, -20);
      shape.lineTo(-30, -20);

      var extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0,
        bevelSegments: 1
      };

      var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      var edges1 = new THREE.EdgesGeometry(geometry);

      var line1 = new THREE.LineSegments(
        edges1,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
      );
      scene.add(line1);
      var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.2
      });
      var mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);
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
      mesh.position.set(50, -50, 0);
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
      requestAnimationFrame(this.render);

      //cube.rotation.x += 0.1;
      //cube.rotation.y += 0.1;
      renderer.render(scene, camera);
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
