<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three'
window.THREE = THREE

import Stats from 'stats.js'

import { OrbitControls } from 'three/examples/js/controls/OrbitControls'

let scene, camera, renderer, light, controls, particleSystem, wuPoints

const TWEEN = require('@tweenjs/tween.js')
var wuPng = require('../assets/smoking.png')

var clock = new THREE.Clock()

let shaderMaterial
let dt = 0
let emitter, stats, proton

export default {
  components: {},
  data() {
    return {
      camera: null
    }
  },

  methods: {
    initScene() {
      scene = new THREE.Scene({ antialias: true })
    },
    initCamera() {
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )

      camera.position.set(0, 0, 100)

      controls = new OrbitControls(camera)

      scene.add(camera)
    },
    initRender() {
      //var axis = new THREE.AxesHelper(1200);
      // 在场景中添加坐标轴
      //  scene.add(axis);
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement)
      renderer.setClearColor(0x000040, 1.0)
      renderer.shadowMap.enabled = true
      renderer.shadowMapSoft = true
    },
    initLight() {
      light = new THREE.AmbientLight(0xcccccc)
      light.position.set(0, 0, 0)

      scene.add(light)
      var light2 = new THREE.PointLight(0xffffff)

      light2.position.set(0, 350, 0)

      scene.add(light2)
    },

    initObjects() {
      const texture = new THREE.TextureLoader().load(wuPng)
      var uniforms = {
        texture: { value: texture },
        time: { type: 'f', value: 0.0 },
        color: { type: 'c', value: new THREE.Color(0xfc2200) },
        heightOfNearPlane: { type: 'f', value: 10.0 }
      }
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: [
          'uniform float time;',
          'varying vec3 vPos;',
          'uniform float heightOfNearPlane;',
          'attribute float timeOffset;',

          'varying float vOpacity;',
          'varying vec4 vColor;',
          'float PI = 3.14;',
          'float randomNoise(vec3 p) {',
          'return fract(6791.*sin(47.*p.x+p.y*9973.));',
          '}',
          'float quadraticIn( float t ) {',
          'float tt = t * t;',
          'return tt * tt;',
          '}',
          'void main()',
          '{',
          'float customOpacity = 1.0;',
          'float timediff = 1.0;',
          'float speed = randomNoise(position) * fract(time);',
          'vec3 p = position;',
          //"float speed = mix(0.,1.,fract(time));",
          'float influence = sin( 2.*PI * fract(speed) );',
          'float progressNeg = 1.0 - speed;',
          // 'vec3 newPosition = position * vec3( 1.0, mod(time-timeOffset,1.8)*speed, 1.0 );',
          'float frac_opacity = customOpacity / timediff;',
          'float opacity = customOpacity - (mod(time-timeOffset, timediff))*frac_opacity;',
          'vColor = vec4( vec3(0.5,0.5,0.5), opacity );',

          'p.y += (mod(time-timeOffset, timediff))*25.0;',

          'vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );',
          'gl_Position = projectionMatrix * mvPosition;',
          'gl_PointSize = 10.0 * ( 300.0 / length( mvPosition.xyz ) );',
          'vPos = mvPosition.xyz;',
          // "vOpacity = min( influence * 4.0, 1.0 )*progressNeg;",
          'vOpacity = mix(0.,1.,fract(time-1.));',
          '}'
        ].join('\n'),
        fragmentShader: [
          'uniform sampler2D texture;',
          'uniform vec3 color;',
          'varying vec3 vPos;',
          'varying float vOpacity;',
          'varying vec4 vColor;',

          'float randomNoise(vec2 p) {',
          'return fract(6791.*sin(47.*p.x+p.y*9973.));',
          '}',
          'void main()',
          '{',
          'vec2 circCoord = 2.0 * gl_PointCoord - 1.0;',
          'if (dot(circCoord, circCoord) > 1.0) {',
          'discard;',
          '}',
          'float radius = 10.;',
          'float thickness = 0.5;',
          'vec3 cLight = normalize(vec3(.75, .15, 0.));',
          'vec3 normal = normalize(vec3(vPos.x, vPos.y, vPos.z));',
          'float diffuse = max(0., dot(normal, cLight));',
          'float pi = 3.14159265359;',
          'float d = dot(normal, vec3(0.5));',
          'if(d > 0.5){',
          'discard;',
          '}',
          //"float wave = sin(16.*2.*pi*(vPos.x+vPos.y));",
          //"wave = fract(10000.*wave);",
          'float tiles = 4.;',
          'vec2 position = floor(normalize(vec2(vPos.xy))*tiles);',
          'float wave = randomNoise(position);',
          'vec4 rotatedTexture = texture2D( texture,  gl_PointCoord );',
          'if(rotatedTexture.r < 0.1){',
          'discard;',
          '}',
          // "gl_FragColor = vec4(vec3(wave), 1.) * texture2D(texture, gl_PointCoord);",
          'gl_FragColor = vec4( rotatedTexture.xyz * color, 1.0 )*vColor;',
          // "if (length(vPos.xy) > radius - thickness) {",
          // "gl_FragColor = vec4(vec3(0.,0.5,0.5), 1.);",
          // "} else {",
          // "gl_FragColor = vec4(vec3(wave)*vec3(1.0,0.5,0.), 1.);",
          // "}",
          '}'
        ].join('\n'),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide
      })
      // var geometry = new THREE.CircleGeometry(10, 32);
      var geometry = this.createGeometry()
      var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
      })
      console.log(geometry)
      var circle = new THREE.Points(geometry, shaderMaterial)
      scene.add(circle)
      this.createEmitter()
    },
    createGeometry() {
      const geom = new THREE.BufferGeometry()
      const radius = 5
      // const angle = Math.PI / 180;
      const num = 300
      const positions = []
      const timeOffset = []

      const halfHeight = 10 * 0.5
      for (let i = 0; i < num; i++) {
        let angle = Math.random() * 2 * Math.PI
        const r = Math.sqrt(Math.random()) * radius
        //const r = Math.random() * radius;
        let posX = Math.cos(angle) * r
        let posY = ((radius - r) / radius) * halfHeight + halfHeight
        let posZ = Math.sin(angle) * r
        positions.push(posX, posY, posZ)
        timeOffset.push(THREE.Math.randFloat(0, 1.0))
      }
      geom.addAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      )
      geom.addAttribute(
        'timeOffset',
        new THREE.Float32BufferAttribute(timeOffset, 1)
      )
      return geom
    },

    createStats() {
      //stats
      stats = new Stats()
      document.getElementById('container').appendChild(stats.dom)
    },
    createEmitter() {},
    render() {
      if (TWEEN != null && typeof TWEEN != 'undefined') {
        TWEEN.update()
      }
      var delta = clock.getDelta()
      //console.log(delta);
      // if (dt > 1) dt = delta;
      // dt += 0.01;
      shaderMaterial.uniforms.time.value += 0.01
      stats.update()
      renderer.render(scene, camera)
      requestAnimationFrame(this.render)
    }
  },
  mounted() {
    this.initScene()
    this.initCamera()
    this.initLight()
    this.initRender()
    this.initObjects()
    this.createStats()
    this.render()
  }
}
</script>

<style></style>
