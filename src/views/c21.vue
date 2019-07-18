<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/js/controls/OrbitControls";

let scene, camera, renderer, light, controls, floor, curve, particle;

var krq = new THREE.Object3D();


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
      camera.layers.enable(0); // enabled by default
      camera.layers.disable(1);
      camera.layers.enable(2);

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
      renderer.setClearColor(0x000040, 1.0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;

    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc);
      light.position.set(0, 0, 0);
      light.layers.enable(0);
      light.layers.disable(1);
      scene.add(light);
      var light2 = new THREE.PointLight(0x555555);

      light2.position.set(0, 350, 0);

      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 5000;
      light2.layers.enable(0);
      light2.layers.disable(1);
      light2.castShadow = true; //表示这个光是可以产生阴影的
      scene.add(light2);

      camera.add(light);
      camera.add(light2);
    },

    initObjects() {
     // this.init()

     this.createSprites()

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
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
              if(krq.position.z !== 0){
            krq.position.z += 1;
            krq.position.x -= 1;
        }else{
            krq.rotation.z = 0;
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
