import * as THREE from 'three'
const TWEEN = require('@tweenjs/tween.js')
require('threebsp')

// let localObj = null

const Tools = {
  camera: null,
  scene: null,
  selectObj: null,
  floor: 10,
  addCamera(camera) {
    this.camera = camera
  },
  addScene(scene) {
    this.scene = scene
  },
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
        doorDirection == 'left'
          ? obj.position.x + obj.geometry.parameters.width / 2
          : obj.position.x - obj.geometry.parameters.width / 2,
        obj.position.y,
        obj.position.z
      )

      doorDirection == 'left'
        ? obj.position.set(-obj.geometry.parameters.width / 2, 0, 0)
        : obj.position.set(obj.geometry.parameters.width / 2, 0, 0)

      tempobj.add(obj)

      objparent.add(tempobj)
    }
    obj.doorState = doorstate == 'close' ? 'open' : 'close'

    new TWEEN.Tween(tempobj.rotation)
      .to(
        {
          y:
            doorstate == 'close'
              ? (doorDirection == 'left' ? -3 / 5 : 3 / 5) * Math.PI
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
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(Tools.camera)

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(
      Tools.camera.position,
      vector.sub(Tools.camera.position).normalize()
    )

    var intersects = raycaster.intersectObjects(Tools.scene.children, true)

    console.log(intersects, 'intersect......')

    if (intersects.length > 0) {
      //this.controls.enabled = false

      Tools.selectObj = intersects[0].object

      if (Tools.selectObj.name.includes('leftdoor')) {
        Tools.openDoor(Tools.selectObj)
      }
      if (Tools.selectObj.name.includes('rightdoor')) {
        Tools.openDoor(Tools.selectObj, 'right')
      }

      //this.controls.enabled = true
    }
  },
  onWindowResize() {
    Tools.camera.aspect = window.innerWidth / window.innerHeight
    Tools.camera.updateProjectionMatrix()
    Tools.renderer.setSize(window.innerWidth, window.innerHeight)
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
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors
      },
      params
    )

    return new maps[name](materials)
  },
  createMaterials(params, name = 'lambert') {
    const result = []
    const { skin = {} } = params || {}
    const faces = ['left', 'right', 'up', 'down', 'after', 'before']
    faces.forEach(key => {
      let curSkin = skin[key] || null
      let { path = null } = curSkin || {}
      let materialsObj
      if (!path) {
        materialsObj = this.addMaterials(curSkin, name)
      } else {
        materialsObj = this.addTexture(curSkin, name)
      }

      result.push(materialsObj)
    })

    return result
  },
  //添加材质
  addTexture(params) {
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
      // color: 0xb0cee0,
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    })
    var cubeMaterialArray = []
    cubeMaterialArray.push(
      new THREE.MeshLambertMaterial({
        color: 0xb0cee0,
        vertexColors: THREE.FaceColors
      })
    )
    cubeMaterialArray.push(
      new THREE.MeshLambertMaterial({
        // color: 0xdddddd,
        vertexColors: THREE.FaceColors
      })
    )

    //result.material = materials;
    console.log(sObj, 'merge......')
    var toResult = result.toMesh(cubeMaterialArray)
    console.log(toResult, 'merge......1111111111')

    toResult.material.shading = THREE.FlatShading
    toResult.geometry.computeFaceNormals()
    toResult.geometry.computeVertexNormals()
    toResult.material.needsUpdate = true
    toResult.geometry.buffersNeedUpdate = true
    toResult.geometry.uvsNeedUpdate = true
    toResult.geometry.colorsNeedUpdate = true
    toResult.geometry.elementsNeedUpdate = true

    // for (let i = 0; i < toResult.geometry.faces.length; i++) {
    //   i > 29 && (toResult.geometry.faces[i].materialIndex = 1)

    //   //(28< i< 38 ) && (toResult.geometry.faces[i].materialIndex = 0)
    // }

    // toResult.geometry.faces[0].vertexColors=[0xff0000, 0x00ff00, 0x0000ff]
    return toResult
  },

  addWall(params) {
    const { position, rotation, childrens } = params

    let result = this.createBox(params)

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

    // const box1 = {
    //   box: [width, thick, height],
    //   position: [0, -length / 2, height / 2 + this.floor],
    //   rotation: wall1.rotation,
    //   style: this.getStyle(wall1),
    //   childrens: wall1.childrens
    // }
    // group.add(this.addWall(box1))

    // const box2 = {
    //   box: [width, thick, height],
    //   position: [0, length / 2, height / 2 + this.floor],
    //   rotation: wall2.rotation,
    //   style: this.getStyle(wall2),
    //   childrens: wall2.childrens
    // }
    // group.add(this.addWall(box2))

    const box3 = {
      box: [height, length - thick, thick],
      position: [-width / 2 + thick / 2, 0, height / 2 + this.floor],
      rotation: [0, Math.PI / 2, 0],
      style: this.getStyle(wall3),
      childrens: wall3.childrens
    }

    const plan = {
      box: [3, length - thick, 1],
      position: [-width / 2 + thick / 2, 0, -height / 2 + this.floor],
      rotation: [0, Math.PI / 2, 0],
      style: {
        skin: {
          left: {
            color: 0xb0cee0
          },
          right: {
            color: 0xb0cee0
          },
          up: {
            color: 0xb0cee0
          },
          down: {
            color: 0xb0cee0
          },
          after: {
            color: 0xdddddd
          },
          before: {
            color: 0xb0cee0
          }
        }
      }
    }
    const planObj = this.createBox(plan)
    planObj.position.set(-width / 2 + thick / 2, 0, 130 + 0.5)
    group.add(planObj)
    group.add(this.addWall(box3))
    // const box4 = {
    //   box: [height, length - thick, thick],
    //   position: [width / 2 - thick / 2, 0, height / 2 + this.floor],
    //   rotation: [0, Math.PI / 2, 0],
    //   style: this.getStyle(wall4),
    //   childrens: wall4.childrens
    // }
    // group.add(this.addWall(box4))
    console.log(group, 'wall group.....')
    return group
  },
  getStyle(params) {
    const { style = { skin: null } } = params

    return style
  },
  createFloor(params) {
    return this.createBox(params)
  },
  addDesk(params) {
    const { position, rotation, childrens } = params

    let result = this.createBox(params)

    const group = new THREE.Group()

    if (childrens && childrens.length > 0) {
      childrens.forEach(item => {
        result = this.createHoles(result, item)
      })
    }

    result.position.set(...position)

    if (rotation) {
      result.rotation.set(...rotation)
    }

    group.position.copy(result.position)
    group.rotation.copy(result.rotation)
    result.position.set(0, 0, 0)
    result.rotation.set(0, 0, 0)

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

    return group
  },
  createDesk(params) {
    const { sideHoles, holes, box } = params

    const holeParams = {
      box: holes,
      position: [0, 0, 0]
    }
    const allHoles = [
      holeParams,
      {
        box: sideHoles,
        position: [
          -box[0] / 2 + sideHoles[0] / 2,
          0,
          -(box[2] - sideHoles[2]) / 2
        ]
      },
      {
        box: sideHoles,
        position: [
          box[0] / 2 - sideHoles[0] / 2,
          0,
          -(box[2] - sideHoles[2]) / 2
        ]
      }
    ]
    allHoles.forEach(item => {
      params.childrens.push(item)
    })

    return this.addDesk(params)
  },
  createChair(params) {
    const { box, height, holes, board } = params

    const x = box[0] / 2 - holes[0] / 2
    const y = box[1] / 2 - holes[1] / 2

    const desktop = {
      box: box,
      position: [-50, 0, holes[2] + box[2] / 2],
      rotation: params.rotation,
      name: params.name,
      modelType: params.modelType,
      childrens: [
        {
          box: holes,
          position: [x, y, -holes[2] / 2],
          op: '+'
        },
        {
          box: holes,
          position: [-x, y, -holes[2] / 2],
          op: '+'
        },
        {
          box: holes,
          position: [-x, -y, -holes[2] / 2],
          op: '+'
        },
        {
          box: holes,
          position: [x, -y, -holes[2] / 2],
          op: '+'
        },
        {
          box: holes,
          position: [-x, y, holes[2] / 2],
          op: '+'
        },
        {
          box: holes,
          position: [-x, -y, holes[2] / 2],
          op: '+'
        },
        {
          box: board,
          position: [-x, 0, board[1]],
          op: '+'
        }
      ]
    }
    return this.addChair(desktop)
  },
  addChair(params) {
    const { position, rotation, childrens } = params

    let result = this.createBox(params)

    const group = new THREE.Group()

    if (childrens && childrens.length > 0) {
      childrens.forEach(item => {
        result = this.createHoles(result, item)
      })
    }

    result.position.set(...position)

    if (rotation) {
      result.rotation.set(...rotation)
    }

    group.position.copy(result.position)
    group.rotation.copy(result.rotation)
    result.position.set(0, 0, 0)
    result.rotation.set(0, 0, 0)

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

    return group
  },
  createChairs(params) {
    const yOffset = 20 / 3

    const chair1 = this.createChair(params)

    var axis = new THREE.AxesHelper(50)

    const leftGroup = new THREE.Group()

    chair1.position.y = -40
    leftGroup.add(chair1)
    for (let i = 0; i < 3; i++) {
      let chairObj = chair1.clone()
      chairObj.position.y = -40 + (i + 1) * 20 + yOffset * (i + 1)
      leftGroup.add(chairObj)
    }

    //scene.add(leftGroup);
    const rightGroup = leftGroup.clone()
    leftGroup.add(axis)
    rightGroup.rotation.set(0, 0, Math.PI)
    rightGroup.add(axis)
    //scene.add(rightGroup);

    const topGroup = new THREE.Group()
    topGroup.position.set(0, 20, 0)
    topGroup.rotation.set(0, 0, -Math.PI / 2)
    for (let i = 0; i < 2; i++) {
      let chairObj = chair1.clone()
      chairObj.position.y = -20 + i * 20 + 20 * i
      topGroup.add(chairObj)
    }

    //scene.add(topGroup);

    const bottomGroup = topGroup.clone()
    topGroup.add(axis)
    bottomGroup.position.set(0, -20, 0)
    bottomGroup.rotation.set(0, 0, Math.PI / 2)
    bottomGroup.add(axis)

    console.log(bottomGroup, 'bottom......')

    // scene.add(bottomGroup);
    return [leftGroup, rightGroup, topGroup, bottomGroup]
  },
  addPlant(params) {
    const { position, rotation, scale = 15, style } = params
    const plant = new THREE.Group()
    const geometry = new THREE.CylinderBufferGeometry(0.15, 0.1, 0.4, 22)
    const material = new THREE.MeshLambertMaterial({ color: 0xcccccc })

    const cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.x = 0
    cylinder.position.y = 0.2
    cylinder.position.z = 0
    plant.add(cylinder)

    const leafTexture = new THREE.TextureLoader().load(style)
    const leafMaterial = new THREE.MeshBasicMaterial({
      map: leafTexture,
      side: THREE.DoubleSide,
      transparent: true
    })
    // var leafMaterial = new THREE.MeshBasicMaterial({
    //   side: THREE.DoubleSide,
    //   transparent: true
    // });
    const geom = new THREE.PlaneGeometry(0.4, 0.8)
    for (var i = 0; i < 4; i++) {
      var leaf = new THREE.Mesh(geom, leafMaterial)
      leaf.position.y = 0.8
      leaf.rotation.y = -Math.PI / (i + 1)
      plant.add(leaf)
    }
    plant.position.x = position[0]
    plant.position.y = position[1]
    plant.position.z = position[2]
    plant.scale.set(scale, scale, scale)
    if (rotation) {
      plant.rotation.set(...rotation)
    }
    return plant
  },
  createPlan(params) {
    const { width, offset } = params

    const position = {
      x: width / 2,
      y: width / 2,
      z: 3
    }
    const plants = [
      {
        position: [-position.x + offset, position.y - offset, position.z],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        position: [-position.x + offset, -position.y + offset, position.z],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        position: [position.x - offset, position.y - offset, position.z],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        position: [position.x - offset, -position.y + offset, position.z],
        rotation: [Math.PI / 2, 0, 0]
      }
    ]
    const plantObj = []
    plants.forEach(item => {
      plantObj.push(this.addPlant(item))
    })

    return plantObj
  }
}

export default Tools
