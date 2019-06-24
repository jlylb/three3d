import * as THREE from 'three'
const TWEEN = require('@tweenjs/tween.js')
require('threebsp')

export default {
  camera: null,
  selectObj: null,
  floor: 10,
  openDoor(obj, doorDirection = 'left') {
    var doorstate = 'close'
    var tempobj = null
    if (obj.doorState != null && typeof obj.doorState != 'undefined') {
      doorstate = obj.doorState
      tempobj = obj.parent
    } else {
      var objparent = obj.parent
      tempobj = new THREE.Group()
      tempobj.position.set(
        obj.position.x + obj.geometry.parameters.width / 2,
        obj.position.y,
        obj.position.z
      )

      obj.position.set(-obj.geometry.parameters.width / 2, 0, 0)

      tempobj.add(obj)

      objparent.add(tempobj)
    }
    obj.doorState = doorstate == 'close' ? 'open' : 'close'

    new TWEEN.Tween(tempobj.rotation)
      .to(
        {
          y:
            doorstate == 'close'
              ? (doorDirection == 'left' ? -3 / 5 : -3 / 5) * Math.PI
              : 0 * (3 / 5) * Math.PI
        },
        10000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  },

  onDocumentMouseDown(event) {
    //raycaster.setFromCamera(mouse, camera);

    var mouse = {}
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(this.camera)

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(
      this.camera.position,
      vector.sub(this.camera.position).normalize()
    )

    var intersects = raycaster.intersectObjects(this.scene.children, true)

    console.log(intersects, 'intersect......')

    if (intersects.length > 0) {
      this.controls.enabled = false

      this.selectObj = intersects[0].object

      if (this.selectObj.name.includes('leftdoor')) {
        this.openDoor(this.selectObj)
      }
      if (this.selectObj.name.includes('rightdoor')) {
        this.openDoor(this.selectObj, 'right')
      }

      this.controls.enabled = true
    }
  },
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  },
  //创建盒子
  createBox(params) {
    console.log(params, 'create box.....')
    const { box, style, materialName = 'lambert' } = params

    const geometry = new THREE.BoxGeometry(...box)

    const materials = this.createMaterials(style, materialName)

    const result = this.createMesh(geometry, materials)

    return result
  },
  addMaterials(params, name = 'lambert') {
    const maps = {
      lambert: THREE.MeshLambertMaterial,
      basic: THREE.MeshBasicMaterial,
      phong: THREE.MeshPhongMaterial
    }
    if (!maps[name]) {
      throw new Error(`${name} not found`)
    }
    let materials = Object.assign(
      {},
      {
        color: 0xb0cee0,
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors
      },
      params
    )

    return new maps[name](materials)
  },
  createMaterials(params) {
    console.log(params, 'dddddd')
    const result = []
    const { skin = {} } = params || {}
    const faces = ['left', 'right', 'up', 'down', 'after', 'before']
    faces.forEach(key => {
      let curSkin = skin[key] || {}
      let { path = null } = curSkin
      let materialsObj
      if (!path) {
        materialsObj = this.addMaterials(curSkin)
      } else {
        materialsObj = this.addTexture(curSkin)
      }

      result.push(materialsObj)
    })

    return result
  },
  //添加材质
  addTexture(params) {
    console.log(params, 'texture......')
    const texture = new THREE.TextureLoader().load(params.path)

    if (params.repeat) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2000 / 128, 1600 / 128)
    }

    const material = Object.assign(
      {},
      { map: texture, transparent: true },
      params
    )

    return this.addMaterials(material)
  },
  createMesh(geometry, materials) {
    const result = new THREE.Mesh(geometry, materials)
    return result
  },
  createEdges(geometry, materials) {
    const edges = new THREE.EdgesGeometry(geometry)

    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial(materials || { color: 0x00ff00 })
    )
    return line
  },
  createAxes(len = 50) {
    const axis = new THREE.AxesHelper(len)
    return axis
  },
  merge(op, sObj, tObj) {
    let result
    let sResult = new ThreeBSP(sObj)
    const tResult = new ThreeBSP(tObj)
    switch (op) {
      case '+':
        result = sResult.union(tResult)
        break
      case '&':
        result = sResult.intersect(tResult)
        break
      default:
        result = sResult.subtract(tResult)
        break
    }
    const materials = new THREE.MeshLambertMaterial({
      color: 0xb0cee0,
      side: THREE.DoubleSide
    })
    //result.material = materials;
    console.log(sObj, 'merge......')
    return result.toMesh(materials)
  },

  addWall(params) {
    console.log(params, 'add wall......')
    const { box, position, rotation, childrens } = params

    let result = this.createBox(params)
    //const material = result.material
    const group = new THREE.Group()

    if (childrens && childrens.length > 0) {
      childrens.forEach(item => {
        if (item.modelType === 'hole') {
          result = this.createHoles(result, item)
        } else if (item.modelType === 'door') {
          group.add(this.createDoor(item, item))
        } else {
          group.add(this.createBox(item))
        }
      })
    }

    // result.material = material
    result.position.set(...position)

    if (rotation) {
      result.rotation.set(...rotation)
    }

    group.position.copy(result.position)
    group.rotation.copy(result.rotation)
    result.position.set(0, 0, 0)
    result.rotation.set(0, 0, 0)

    // if (doors) {
    //   doors.forEach(item => {
    //     let door = this.addDoor(item);
    //     group.add(door);
    //   });
    // }
    //开启坐标
    if (params.enabledAxes) {
      group.add(this.createAxes())
    }
    //开启边框
    if (params.enabledLine) {
      const geom = result.geometry
      const line = this.createEdges(geom)
      group.add(line)
    }

    group.add(result)
    //scene.add(group);

    return group
  },

  addHole(box, hole) {
    //const { style = null } = hole
    const holeCube = this.createBox(hole)

    holeCube.position.set(...hole.position)

    const resultBSP = this.merge(hole.op, box, holeCube)

    //result = resultBSP.toMesh();

    return resultBSP
  },
  //打孔
  createHoles(box, hole) {
    let result = this.addHole(box, hole)
    return result
  },
  createDoor(params, wall) {
    const door = {
      box: [params.width / 2, params.height, 1],
      position: [
        (wall.height - params.height) / 2,
        params.direction == 'left' ? params.height / 4 : -params.height / 4,
        0
      ],
      name: params.name,
      rotation: params.rotation,
      style: params.style,
      enabledAxes: params.enabledAxes
    }
    return this.addDoor(door)
  },
  addDoor(params) {
    const group = new THREE.Group()

    const result = this.createBox(params)

    result.name = params.name

    result.position.set(...params.position)

    if (params.rotation) {
      result.rotation.set(...params.rotation)
    }

    //开启坐标
    if (params.enabledAxes) {
      group.add(this.createAxes())
    }
    //开启边框
    if (params.enabledLine) {
      const line = this.createEdges(result.geometry)
      group.add(line)
    }

    //开启阴影
    if (params.enabledShadow) {
      result.castShadow = true
    }
    //接收阴影
    if (params.enabledReceive) {
      result.receiveShadow = true
    }

    group.position.copy(result.position)
    group.rotation.copy(result.rotation)
    result.position.set(0, -20, 0)
    result.rotation.set(0, 0, 0)

    group.add(result)

    return group
  },

  createWall(params) {
    const {
      room: { length, width, height, thick },
      walls
    } = params
    const [wall1, wall2, wall3, wall4] = walls

    const group = new THREE.Group()

    const box1 = {
      box: [width, thick, height],
      position: [0, -length / 2, height / 2 + this.floor],
      rotation: wall1.rotation,
      style: this.getStyle(wall1),
      childrens: wall1.childrens
    }
    group.add(this.addWall(box1))

    const box2 = {
      box: [width, thick, height],
      position: [0, length / 2, height / 2 + this.floor],
      rotation: wall2.rotation,
      style: this.getStyle(wall2),
      childrens: wall2.childrens
    }
    group.add(this.addWall(box2))

    const box3 = {
      box: [height, length - thick, thick],
      position: [-width / 2 + thick / 2, 0, height / 2 + this.floor],
      rotation: [0, Math.PI / 2, 0],
      style: this.getStyle(wall3),
      childrens: wall3.childrens
    }
    group.add(this.addWall(box3))
    const box4 = {
      box: [height, length - thick, thick],
      position: [width / 2 - thick / 2, 0, height / 2 + this.floor],
      rotation: [0, Math.PI / 2, 0],
      style: this.getStyle(wall4),
      childrens: wall4.childrens
    }
    group.add(this.addWall(box4))
    console.log(group, 'wall group.....')
    return group
  },
  getStyle(params) {
    const { style = { skin: null } } = params

    return style
  },
  createFloor(params) {
    console.log(params, 'create floor..............')
    return this.createBox(params)
  }
}
