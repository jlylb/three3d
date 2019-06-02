<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE);
require("threebsp");
let scene, camera, renderer, light, controls;
const floorJpg = require('../assets/floor.jpg');


export default {
methods: {
    initScene(){
        scene = new THREE.Scene();
    },
    updateControls() {
        controls.update();
    },
    initCamera(){
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.z = 40;
        camera.position.y = 40;
        camera.position.x = 20;
        camera.lookAt({x:0,y:0,z:0});
        controls = new OrbitControls( camera );
        //controls.addEventListener( 'change', this.updateControls );
    },
    initRender(){
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild( renderer.domElement );
        renderer.setClearColor(0xFFFFFF, 1.0);
    },
    initLight() {
            // A start
            // 第二个参数是光源强度，你可以改变它试一下
            light = new THREE.DirectionalLight(0xFF0000,1);
            // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
            light.position.set(0,0,1);
            scene.add(light);
            // A end
        },

        initObject(){
            // 坐标轴
            var axis = new THREE.AxisHelper(20);
            // 在场景中添加坐标轴
            scene.add(axis);
 
            // 地面
            var floor  = new THREE.BoxGeometry( 70, 100, 1);
            //var floorMaterial = new THREE.MeshBasicMaterial( {color: '#87CEEB', wireframe: false } );
            var floorMaterial = new THREE.MeshBasicMaterial( {color: '#87CEEB', wireframe: false } );
            var texture = THREE.ImageUtils.loadTexture(floorJpg,null,function(t)
            {
            });
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(40, 40);
            var material = new THREE.MeshBasicMaterial({map:texture});
            var floorCube = new THREE.Mesh( floor, material );
            scene.add( floorCube );
            floorCube.rotation.x += 0.5*Math.PI;
 
            // 墙面
            var cubeGeometry = new THREE.BoxGeometry(1, 10, 60);
            // 创建墙面材料
            //var cubeMaterial = new THREE.MeshBasicMaterial({ color: '#8B0A50', wireframe: false});
            var cubeMaterial = new THREE.MeshBasicMaterial({ color: '#8B0A50', wireframe: false});
 
            /************各个面设置不同的纹理*********/
            var matArray = [];
            //matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0xafc0ca}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0xd6e4ec}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            var faceMaterial = new THREE.MeshFaceMaterial(matArray);
 
            var matArray = [];
            matArray.push(new THREE.MeshBasicMaterial({color: 0xafc0ca}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0xd6e4ec}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            matArray.push(new THREE.MeshBasicMaterial({color: 0x9cb2d1}));
            var faceMaterial1 = new THREE.MeshFaceMaterial(matArray);
 
            // 合成立方体
            //var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
            var cube = new THREE.Mesh( cubeGeometry, faceMaterial1 );
            // 设置墙面位置
            cube.position.x = -15;
            cube.position.y = 5;
            cube.position.z = 0;
            // 在场景中添加墙面
            scene.add(cube);
 
            // 墙面1
            var cubeGeometry = new THREE.BoxGeometry(1, 10, 30);
            // 合成立方体
            var cube = new THREE.Mesh( cubeGeometry, faceMaterial1 );
            // 设置墙面位置
            cube.position.x = 0;
            cube.position.y = 5;
            cube.position.z = 30;
            cube.rotation.y += 0.5*Math.PI;
            // 在场景中添加墙面
            scene.add(cube);
 
            // 墙面2
            var cubeGeometry = new THREE.BoxGeometry(1, 10, 60);
            // 合成立方体
            var cube = new THREE.Mesh( cubeGeometry, faceMaterial );
            // 设置墙面位置
            cube.position.x = 15;
            cube.position.y = 5;
            cube.position.z = 0;
            // 在场景中添加墙面
            scene.add(cube);
 
            // 墙面3
            var cubeGeometry = new THREE.BoxGeometry(1, 10, 30);
            // 合成立方体
            //var cube = new THREE.Mesh( cubeGeometry, faceMaterial );
 
            var cube = new THREE.Mesh( cubeGeometry );            // 设置墙面位置
            cube.position.x = 0;
            cube.position.y = 5;
            cube.position.z = -30;
            cube.rotation.y += 0.5*Math.PI;
            // 在场景中添加墙面
           // scene.add(cube);
 
            // 门
            var door = new THREE.BoxGeometry(1, 8, 9);
            // 创建门材料
            //var doorMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true,transparent:true,opacity:0.6});
            //var door_cube = new THREE.Mesh( door, faceMaterial);
            var door_cube = new THREE.Mesh( door);
            // 设置门位置
            door_cube.position.x = 0;
            door_cube.position.y = 5;
            door_cube.position.z = -30;
            door_cube.rotation.y += 0.5*Math.PI;
            //scene.add(cube);
 
 
            var sphere1BSP = new ThreeBSP(cube);
            var cube2BSP = new ThreeBSP(door_cube);
 
            var resultBSP = sphere1BSP.subtract(cube2BSP);
            var result = resultBSP.toMesh();
            result.material.shading = THREE.FlatShading;
            result.geometry.computeFaceNormals();
            result.geometry.computeVertexNormals();
            result.material.needsUpdate = true;
            result.geometry.buffersNeedUpdate = true;
            result.geometry.uvsNeedUpdate = true;
            scene.add(result);
        },
         drawShape(){
            var shape = new THREE.Shape();
            shape.moveTo(10, 10);
            shape.lineTo(10, 40);
            shape.lineTo(40, 40);
            shape.lineTo(10, 10);
            return shape;
        },
        render() {
            requestAnimationFrame( this.render );
 
            //cube.rotation.x += 0.1;
            //cube.rotation.y += 0.1;
            renderer.render( scene, camera );
        },
        init(){
            this.initRender();
            this.initScene();
            this.initCamera();
            //initLight();
            this.initObject();
        }
},
mounted() {
this.init()
this.render()
}

}
</script>

<style>

</style>
