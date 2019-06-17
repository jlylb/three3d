<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE);
require("threebsp");
let scene, camera, renderer, light, controls;
const floorJpg = require('../assets/floor.jpg');
import dat from "dat.gui";
import SceneUtils  from '@/plugin/sceneutils.js';

export default {
methods: {
    initScene(){
        scene = new THREE.Scene();
    },
    updateControls() {
        controls.update();
    },
    initCamera(){
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 100000);
        camera.position.z = 0;
        camera.position.y = 100;
        camera.position.x = 0;

        
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;

        camera.lookAt({x:0,y:0,z:0});
        controls = new OrbitControls( camera );
        //controls.addEventListener( 'change', this.updateControls );
        scene.add(camera)
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
            light = new THREE.AmbientLight(0x00ff00,1);
            // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
            light.position.set(0, 0, 0);
            scene.add(light);
            // A end
        },

        initObject(){
            // 坐标轴
            var axis = new THREE.AxesHelper(20);
            // 在场景中添加坐标轴
            scene.add(axis);
           // scene.fog = new THREE.Fog(0xffffff, 0.015, 100)

            var gui = new dat.GUI();


            const box = new THREE.BoxGeometry(100, 10, 10,0,0,1);
            // const la = new THREE.MeshBasicMaterial({color: 0xcccccc})
            // const mesh1 = new THREE.Mesh(box,la)
            let mesh1 = this.createMesh(box)
            console.log(mesh1, 'box......')

            var self = this

            var actionControls =new function () {
                var obj = mesh1.children[0].geometry
                
                this.w = obj.parameters.width;
                this.h = obj.parameters.height;
                this.d = obj.parameters.depth;

                this.wf = obj.parameters.widthSegments;
                this.hf = obj.parameters.heightSegments;
                this.df = obj.parameters.depthSegments;

                this.px = mesh1.position.x
                this.py = mesh1.position.y
                this.pz = mesh1.position.z

                this.rx = mesh1.rotation.x
                this.ry = mesh1.rotation.y
                this.rz = mesh1.rotation.z

                // camera

                this.cpx = camera.position.x
                this.cpy = camera.position.y
                this.cpz = camera.position.z

                this.rpx = camera.rotation.x
                this.rpy = camera.rotation.y
                this.rpz = camera.rotation.z

                //light

                this.lpx = light.position.x
                this.lpy = light.position.y
                this.lpz = light.position.z

                // 

                this.redraw = function () {
                    // remove the old plane
                    scene.remove(mesh1);
                    // create a new one
                    mesh1 = self.createMesh(new THREE.BoxGeometry(actionControls.w, actionControls.h, actionControls.d, actionControls.wf, actionControls.hf, actionControls.df));
                    // add it to the scene.
                    scene.add(mesh1);

                    mesh1.position.set(actionControls.px, actionControls.py, actionControls.pz)
                    mesh1.rotation.set(actionControls.rx, actionControls.ry, actionControls.rz)
                };

                this.redrawCamera = function () {
                    camera.position.x = actionControls.cpx
                    camera.position.y = actionControls.cpy
                    camera.position.z = actionControls.cpz

                    camera.rotation.x = actionControls.rpx
                    camera.rotation.y = actionControls.rpy
                    camera.rotation.z = actionControls.rpz

                }

                this.redrawLight = function () {
                    light.position.x = actionControls.lpx
                    light.position.y = actionControls.lpy
                    light.position.z = actionControls.lpz
                }


            };
            let boxctrl = gui.addFolder('box1')

            boxctrl.add(actionControls, 'w', 10, 1000).step(10).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'h', 10, 1000).step(10).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'd', 10, 1000).step(10).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'wf', 0, 100).step(2).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'hf', 0, 100).step(2).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'df', 0, 100).step(2).onChange(actionControls.redraw);

            boxctrl.add(actionControls, 'px', -1000, 1000).step(20).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'py', -1000, 1000).step(20).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'pz', -1000, 1000).step(20).onChange(actionControls.redraw);

            boxctrl.add(actionControls, 'rx', -1, 1).step(0.1).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'ry', -1, 1).step(0.1).onChange(actionControls.redraw);
            boxctrl.add(actionControls, 'rz', -1, 1).step(0.1).onChange(actionControls.redraw);

            boxctrl.open()
 

            let lightctrl = gui.addFolder('light1')
            lightctrl.add(actionControls, 'lpx', -200, 1000).step(1).onChange(actionControls.redrawLight);
            lightctrl.add(actionControls, 'lpy', -200, 1000).step(1).onChange(actionControls.redrawLight);
            lightctrl.add(actionControls, 'lpz', -200, 1000).step(1).onChange(actionControls.redrawLight);

            let cameractrl = gui.addFolder('camera1')
            cameractrl.add(actionControls, 'rpx', -200, 1000).step(1).onChange(actionControls.redrawCamera);
            cameractrl.add(actionControls, 'rpy', -200, 1000).step(1).onChange(actionControls.redrawCamera);
            cameractrl.add(actionControls, 'rpz', -200, 1000).step(1).onChange(actionControls.redrawCamera);
            cameractrl.add(actionControls, 'cpx', -200, 1000).step(1).onChange(actionControls.redrawCamera);
            cameractrl.add(actionControls, 'cpy', -200, 1000).step(1).onChange(actionControls.redrawCamera);
            cameractrl.add(actionControls, 'cpz', -200, 1000).step(1).onChange(actionControls.redrawCamera);


            scene.add(mesh1)
 

        },

        createMesh(geom){
            // const la = new THREE.MeshLambertMaterial({color: 0xcccccc, side: THREE.DoubleSide})
            // const mesh1 = new THREE.Mesh(box,la)
            // return mesh1
            var meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;
            var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;

            // create a multimaterial
            var mesh1 = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

            return mesh1;
        },

        createObj() {
            
        },

        render() {
            requestAnimationFrame( this.render );
 
            //cube.rotation.x += 0.1;
            //cube.rotation.y += 0.1;
            renderer.render( scene, camera );
        },
        init(){
            
            this.initScene();
            this.initCamera();
            this.initLight();
            this.initObject();
            this.initRender();
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
