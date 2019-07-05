import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader'

var idleAction, walkAction, runAction
var model, skeleton, mixer, clock, actions
clock = new THREE.Clock()
let flag = 0

const Models = {
  model: null,
  scene: null,
  camera: null,
  renderer: null,
  setScene(scene) {
    this.scene = scene
    return this
  },
  setCamera(camera) {
    this.camera = camera
    return this
  },
  setRenderer(renderer) {
    this.renderer = renderer
    return this
  },
  setModel(model) {
    this.model = model
  },
  getModel() {
    return this.model
  },
  addPerson() {
    var loader = new THREE.GLTFLoader()
    loader.load('./static/Soldier.glb', gltf => {
      console.log(gltf, 'gltf......')

      model = gltf.scene

      this.setModel(model)
      model.position.set(0, 0, 3)
      // model.up.set(0, 0, 1);
      model.rotation.set(0, Math.PI / 2, 0)
      var axis = new THREE.AxesHelper(50)
      // 在场景中添加坐标轴
      model.add(axis)
      model.scale.set(100, 100, 100)
      this.scene.add(model)
      model.visible = true
      model.traverse(function(object) {
        if (object.isMesh) object.castShadow = true
      })
      //
      skeleton = new THREE.SkeletonHelper(model)
      skeleton.visible = false
      this.scene.add(skeleton)

      var animations = gltf.animations
      mixer = new THREE.AnimationMixer(model)
      idleAction = mixer.clipAction(animations[0])
      walkAction = mixer.clipAction(animations[3])
      runAction = mixer.clipAction(animations[1])
      actions = [idleAction, walkAction, runAction]
      this.activateAllActions()
      this.animate()
    })

    this.renderer.gammaOutput = true
    this.renderer.gammaFactor = 2.2
    window.addEventListener('resize', this.onWindowResize, false)
  },
  onWindowResize() {
    Models.camera.aspect = window.innerWidth / window.innerHeight
    Models.camera.updateProjectionMatrix()
    Models.renderer.setSize(window.innerWidth, window.innerHeight)
  },
  animate() {
    // Render loop
    requestAnimationFrame(Models.animate)

    // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
    var mixerUpdateDelta = clock.getDelta()
    // If in single step mode, make one step and then do nothing (until the user clicks again)

    // Update the animation mixer, the stats panel, and render this frame
    mixer.update(mixerUpdateDelta)

    Models.renderer.render(Models.scene, Models.camera)
  },
  activateAllActions() {
    this.setWeight(idleAction, 0.0)
    this.setWeight(walkAction, 1.0)
    this.setWeight(runAction, 0.0)
    actions.forEach(function(action) {
      action.play()
    })
  },
  setWeight(action, weight) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  },
  run() {
    if (!model) {
      return
    }

    if (flag == 0) {
      model.position.y += 0.1
      flag = model.position.y > 100 ? 1 : 0
      if (flag == 1) {
        model.rotation.set(model.rotation.x, -Math.PI, 0)
      }
    } else {
      model.position.y -= 0.1
      flag = model.position.y > 0 ? 1 : 0
      if (flag == 0) {
        model.rotation.set(model.rotation.x, Math.PI * 2, 0)
      }
    }
  }
}

export default Models
