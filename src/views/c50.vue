<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/js/controls/OrbitControls'

let scene, camera, renderer, light, controls, particleSystem, wuPoints, bgeom

const TWEEN = require('@tweenjs/tween.js')

import testM from '@/shader/test3.js'

import SimplexNoise from 'simplex-noise'

import DotPng from '@/assets/dot.png'
var wuPng = require('../assets/smoking.png')
var smokePng = require('../assets/patricle/smokeparticle.png')
let dt = 0
let shaderMaterial
let linepos = []
var flameStartingHeight = 101
var flameSize = 7
var flameTTL = 2.7

var clock = new THREE.Clock()

var simplex = new SimplexNoise()

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

      camera.position.set(0, 300, 150)

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
    flameBufferPos(n) {
      var pos = new Float32Array(n * 3)

      for (let i = 0; i < n; i++) {
        pos[i * 3] = THREE.Math.randFloat(1, 20)
        pos[i * 3 + 1] = flameStartingHeight
        pos[i * 3 + 2] = THREE.Math.randFloat(1, 20)
      }

      const radius = 5
      const positions = new Float32Array(n * 3)
      const halfHeight = 10 * 0.5
      for (let i = 0; i < n; i++) {
        let angle = Math.random() * 2 * Math.PI
        const r = Math.sqrt(Math.random()) * radius
        //const r = Math.random() * radius;
        let posX = Math.cos(angle) * r
        let posY = ((radius - r) / radius) * halfHeight + halfHeight
        let posZ = Math.sin(angle) * r

        positions[i * 3] = posX
        positions[i * 3 + 1] = posY
        positions[i * 3 + 2] = posZ
      }
      return positions
    },
    createFlameParticles(n) {
      var pos = this.flameBufferPos(n)

      var siz = new Float32Array(n)

      for (let i = 0; i < n; i++) {
        siz[i] = THREE.Math.randFloat(1, flameSize)
      }

      var ang = new Float32Array(n)

      for (let i = 0; i < n; i++) {
        ang[i] = THREE.Math.randFloat(0, 2 * Math.PI)
      }

      var to = new Float32Array(n)

      for (let i = 0; i < n; i++) {
        to[i] = THREE.Math.randFloat(0, flameTTL)
      }

      return { positions: pos, sizes: siz, angles: ang, timeOffsets: to }
    },
    initObjects() {
      // var linear = THREE.Math.lerp(0.1, 0.6, Math.random())
      // console.log(linear, 'linear.....')
      const texture = new THREE.TextureLoader().load(smokePng)
      // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      var uniforms = {
        // color: { type: "c", value: new THREE.Color(0xfc2200) },
        t: { value: 0.0 },
        texture: { value: texture },
        customOpacity: { type: 'f', value: 1.0 },
        customColor: { value: new THREE.Color(1.0, 0.3, 0.5) },
        timeLife: { value: flameTTL },
        size: { type: 'f', value: 1.4 },
        speed: { value: 25.0 },
        u_t: { type: 'f', value: 0.0 }
      }
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: testM.vertexShader,
        fragmentShader: testM.fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide
      })

      const geom = new THREE.BufferGeometry()
      // const radius = 5
      // // const angle = Math.PI / 180;
      // const num = 50
      // const positions = []
      // const randam = []
      // const sprite = []
      // const halfHeight = 20 * 0.5
      // for (let i = 0; i < num; i++) {
      //   let angle = Math.random() * 2 * Math.PI
      //   const r = Math.sqrt(Math.random()) * radius
      //   let posX = Math.cos(angle) * r
      //   let posY = ((radius - r) / radius) * halfHeight + halfHeight
      //   let posZ = Math.sin(angle) * r

      //   // let xxx = simplex.noise3D(posX, posY, posZ)
      //   // console.log(xxx, 'noise....')
      //   //let posZ = 0;
      //   positions.push(posX, posY, posZ)
      //   // randam.push(Math.random());
      //   // sprite.push(Math.random());
      // }
      var flameData = this.createFlameParticles(100)
      console.log(flameData)
      geom.addAttribute(
        'position',
        new THREE.BufferAttribute(flameData.positions, 3)
      )
      geom.addAttribute(
        'customSize',
        new THREE.BufferAttribute(flameData.sizes, 1)
      )
      geom.addAttribute(
        'customAngle',
        new THREE.BufferAttribute(flameData.angles, 1)
      )
      geom.addAttribute(
        'timeOffset',
        new THREE.BufferAttribute(flameData.timeOffsets, 1)
      )
      // geom.addAttribute(
      //   'position',
      //   new THREE.Float32BufferAttribute(positions, 3)
      // )
      // geom.addAttribute("randam", new THREE.Float32BufferAttribute(randam, 1));
      // geom.addAttribute("sprite", new THREE.Float32BufferAttribute(sprite, 1));
      wuPoints = new THREE.Points(geom, shaderMaterial)
      bgeom = geom
      scene.add(wuPoints)
    },
    addAnimation() {
      // const position = bgeom.attributes.position.array
      //for (let i = 0; i < position.length / 3; i++) {
      // let i = 0
      // let ps = position[3 * i + 1]
      // let max1 = 20
      // new TWEEN.Tween({ y: ps })
      //   .to({ y: max1 })
      //   .onUpdate(data => {
      //     console.log(data, 'on update.....')
      //     position[3 * i + 1] = data.y >= max1 ? 0 : data.y
      //   })
      //   .start()
      //}
      // var time = Date.now() * 0.005
      // let i = 0
      // // for (var i = 0; i < position.length / 3; i++) {
      // position[3 * i + 1] = (20 * (1 + Math.sin(0.1 * i + time))) / 2
      // //}
      // bgeom.attributes.position.needsUpdate = true
      // if (dt >= 60) {
      //   dt = 0.0
      // } else {
      //   dt += 1.0
      // }
      // shaderMaterial.uniforms.u_t.value = dt
      // shaderMaterial.uniforms.u_t.value += 0.05
      console.log(shaderMaterial.uniforms.u_t.value)
    },

    render() {
      if (TWEEN != null && typeof TWEEN != 'undefined') {
        TWEEN.update()
      }
      var delta = clock.getDelta()
      this.addAnimation()
      // shaderMaterial.uniforms.time.value += delta;
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
    console.log(wuPoints.geometry, 'mounted.......')
    this.render()
  }
}
</script>

<style></style>
