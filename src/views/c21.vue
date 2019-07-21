<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

import ParticleEngine from "../tools/patricle2.js";
import { Examples } from "../tools/patricleExample.js";


let scene, camera, renderer, light, controls, floor, curve, particle;

var krq = new THREE.Object3D();

var wuPng = require("../assets/smoking.png");

var floorJpg = require('../assets/patricle/checkerboard.jpg')


var systemp
var particles = 1000
var particleSystem
var geometry

var engine
var clock = new THREE.Clock();

const TWEEN = require("@tweenjs/tween.js");
require("threebsp");

export default {
  components: {  },
  data() {
    return {
      camera: null
    };
  },

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
      this.camera = camera;

      camera.position.z = 150;
      camera.position.y = 0;
      camera.position.x = 0;
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      controls = new OrbitControls(camera);

      scene.add(camera);


    },
    initRender() {
      var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      //scene.add(axis);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);
    //  renderer.setClearColor(0x000040, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;

    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(0, 0, 0);

      scene.add(light);
      var light2 = new THREE.PointLight(0xffffff);

      light2.position.set(0, 350, 0);

      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 5000;

      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);
    },
createFloor() {
    var floorTexture = new THREE.TextureLoader().load( floorJpg);
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x444444, map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -10.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
},
    initObjects() {
     // this.init()
this.createFloor()
     //this.createSprites()
     // this.createPatricle1()
     // this.createParticle2()
         engine = new ParticleEngine(scene);
        console.log(engine, 'dddd.....')
        engine.setValues( Examples.smoke );
        engine.initialize();
    },
    createParticle2() {
        var texture = new THREE.TextureLoader().load(wuPng)
        const shaderMaterial = new THREE.PointsMaterial({
            size: 4, 
           // vertexColors: true,
            map: texture,
            transparent: true
        })
                var radius = 200;
                
				geometry = new THREE.BufferGeometry();
				var positions = [];
				var colors = [];
				var sizes = [];
				var color = new THREE.Color();
				for ( var i = 0; i < particles; i ++ ) {
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					color.setHSL( i / particles, 1.0, 0.5 );
					colors.push( color.r, color.g, color.b );
					sizes.push( 20 );
				}
				geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );
				particleSystem = new THREE.Points( geometry, shaderMaterial );
				scene.add( particleSystem );
    },
    updateGeometry() {
        if(!particleSystem) return
        var time = Date.now() * 0.005;
        particleSystem.rotation.z = 0.01 * time;
        var sizes = geometry.attributes.size.array;
        for ( var i = 0; i < particles; i ++ ) {
            sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );
        }
        geometry.attributes.size.needsUpdate = true;
    },
    createPatricle1() {
        var texture = new THREE.TextureLoader().load(wuPng)
        const material = new THREE.PointsMaterial({
            size: 4, 
           // vertexColors: true,
            map: texture,
            transparent: true
        })
        var geo = new THREE.Geometry()
        for (var x = -5; x < 5; x++) {
                for (var y = -5; y < 5; y++) {
                    var particle = new THREE.Vector3(x*10, y*10, 0)
                    geo.vertices.push(particle)
                    geo.colors.push(
                        new THREE.Color(Math.random()*0x00ffff)
                    )
                }
            }
        systemp = new THREE.Points(geo, material)
        //system.scale.x = system.scale.y = Math.random() * 1032 + 16;
        //system.scale.multiplyScalar(100)
        console.log(systemp)
        scene.add(systemp)
        // new TWEEN.Tween( system.position )
        //     .delay( 1000 )
        //    // .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
        //     .to({x:300,y:400,z:Math.random()*-100 + 50},3000)
        //     .start();

        new TWEEN.Tween( systemp.scale )
            .delay( 1000 )
            .to({x:300,y:400,z:100},3000)
            .start();


            var t1 = new TWEEN.Tween(systemp.position)
                .delay(1000)
                .to({x: 200, y:300}, 2000)
                .onComplete((data)=>{
                    //system.position.set(0,0,0)
                    this.createPatricle1()
                })

                t1.start();
    },
  createSprites() {
            var material = new THREE.SpriteMaterial();
            for (var x = -5; x < 5; x++) {
                for (var y = -5; y < 5; y++) {
                    var sprite = new THREE.Sprite(material);
                    sprite.position.set(x * 10, y * 10, 0);
                    scene.add(sprite);
                }
            }
        },
    init() {


        var material = new THREE.SpriteMaterial( {
            map: new THREE.CanvasTexture( this.generateSprite() ),
            blending: THREE.AdditiveBlending
        } );

        for ( var i = 0; i < 1000; i++ ) {

            particle = new THREE.Sprite( material );

            this.initParticle( particle, i * 10 );

            krq.add( particle );
        }
        krq.position.z = -200;
        krq.rotateZ(1);
        scene.add(krq);

    },
    generateSprite() {

        var canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        // gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        // gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
        // gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
        // gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.6, 'rgba(0,255,255,.5)' );
        gradient.addColorStop( 0.8, 'rgba(0,53,169,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );


        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );

        return canvas;

    },

    initParticle( particle, delay ) {

        var particle = this instanceof THREE.Sprite ? this : particle;
        var delay = delay !== undefined ? delay : 0;

        particle.position.set( 0, 0, 0 );
        particle.scale.x = particle.scale.y = Math.random() * 32 + 16;
        //下面是一系列的动画
        var xx = Math.random()* 400 -200;
        var yy = -Math.cos((Math.PI/400) * xx)*500;
        //位移
        new TWEEN.Tween( particle.position )
            .delay( delay )
           // .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
            .to({x:xx,y:yy,z:Math.random()*-100 + 50},3000)
            .start();
        //理解为存活时间    x加一个判断
        if(Math.abs(xx) > 150){
            new TWEEN.Tween(particle)
                .delay(delay)
                .to({}, 0)
                .onComplete(this.initParticle)
                .start();
        }else {
            new TWEEN.Tween(particle)
                .delay(delay)
                .to({}, 2000)
                .onComplete(this.initParticle)
                .start();
        }
        // new TWEEN.Tween( particle )
        //     .delay( delay )
        //     .to( {}, 10000 )
        //     .onComplete( this.initParticle )
        //     .start();

        // new TWEEN.Tween( particle.position )
        //     .delay( delay )
        //     .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
        //     .start();

        new TWEEN.Tween( particle.scale )
            .delay( delay )
            .to( { x: 0.01, y: 0.01 }, 10000 )
            .start();

    },

    render() {
      if (TWEEN != null && typeof TWEEN != "undefined") {
        TWEEN.update();
      }
      // this.updateGeometry()
      requestAnimationFrame(this.render);
    renderer.render(scene, camera);
    //           if(krq.position.z !== 0){
    //         krq.position.z += 1;
    //         krq.position.x -= 1;
    //     }else{
    //         krq.rotation.z = 0;
    //     }
    var dt = clock.getDelta();
    if(engine) {
	
	engine.update( dt * 0.5 );
    }

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

</style>
