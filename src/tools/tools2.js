import * as THREE from 'three'
const TWEEN = require('@tweenjs/tween.js')
require('threebsp')

// let localObj = null

const Tools = {
  camera: null,
  scene: null,
  selectObj: null,
  floor: 10,
  points: [],
  line: null,
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
      // tempobj.add(this.createAxes(300))

      tempobj.position.set(
        obj.position.x,
        obj.position.y,
        doorDirection == 'left'
          ? obj.position.z - obj.geometry.parameters.depth / 2
          : obj.position.z + obj.geometry.parameters.depth / 2
      )

      doorDirection == 'left'
        ? obj.position.set(0, 0, obj.geometry.parameters.depth / 2)
        : obj.position.set(0, 0, -obj.geometry.parameters.depth / 2)

      tempobj.add(obj)

      objparent.add(tempobj)
    }
    obj.doorState = doorstate == 'close' ? 'open' : 'close'

    new TWEEN.Tween(tempobj.rotation)
      .to(
        {
          y:
            doorstate == 'close'
              ? (doorDirection == 'left' ? 3 / 5 : -3 / 5) * Math.PI
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
      console.log(Tools.selectObj.isMesh, 'click.......')

      const parent = Tools.selectObj.parent

      if (Tools.selectObj.isMesh && parent.type === 'Group') {
        const children = parent.children
        const line = children[children.length - 1]
        if (line.type === 'LineSegments') {
          parent.remove(line)
        } else {
          parent.add(Tools.createEdges(Tools.selectObj.geometry))
        }
      }

      if (intersects[0].point) {
        console.log(Tools.points, Tools.line, 'tools line poings..........')
        // if(!Tools.line) {
        //   Tools.points.push(intersects[0].point)
        // }else{
        //   Tools.line.geometry.vertices.push(intersects[0].point)
        //   Tools.line.geometry.verticesNeedUpdate = true
        // }
        //Tools.points.push(intersects[0].point)
      }

      // if(Tools.points.length>1) {
      //   Tools.scene.remove(Tools.line)
      //   Tools.line = Tools.drawLine(Tools.points)
      //   Tools.line.geometry.verticesNeedUpdate = true
      //   Tools.scene.add(Tools.line)
      // }
      //this.controls.enabled = true
    }
  },
  onWindowResize() {
    Tools.camera.aspect = window.innerWidth / window.innerHeight
    Tools.camera.updateProjectionMatrix()
    Tools.renderer.setSize(window.innerWidth, window.innerHeight)
  },
  //添加模型
  addObject(params) {
    const { rotation, childrens } = params

    let ss = this.createBox(params)
    let result = ss

    //模型原坐标
    let pos = ss.position

    const group = new THREE.Group()
    group.add(result)
    group.position.copy(pos)
    group.rotation.copy(result.rotation)

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

    group.position.copy(pos)
    group.rotation.copy(result.rotation)
    // group.position.set(0, 0, 0)
    result.position.set(0, 0, 0)
    result.rotation.set(0, 0, 0)

    if (params.name) {
      result.name = params.name
    }

    if (rotation) {
      result.rotation.set(...rotation)
    }

    //开启阴影
    if (params.enabledShadow) {
      result.castShadow = true
    }
    //接收阴影
    if (params.enabledReceive) {
      result.receiveShadow = true
    }

    //开启坐标
    if (params.enabledAxes) {
      group.add(this.createAxes(params.AxesLen || null))
    }

    //开启边框
    if (params.enabledLine) {
      const geom = result.geometry
      const line = this.createEdges(geom)
      group.add(line)
    }

    //group.add(result)

    return group
  },
  //位置参数
  getBoxParams(params, thick = 20, height = 240) {
    const [startX = 0, startY = 0, startZ = 0] = params.start
    const [endX = 0, endY = 0, endZ = 0] = params.end

    const positionX = (startX + endX) / 2
    const positionY = (startY + endY) / 2
    const positionZ = (startZ + endZ) / 2
    let wallLength
    let wallWidth
    //z相同 表示x方向为长度
    if (startZ == endZ) {
      wallLength = Math.abs(startX - endX)
      wallWidth = params.thick || thick
    } else if (startX == endX) {
      wallLength = params.thick || thick
      wallWidth = Math.abs(startZ - endZ)
    }
    params.position = [positionX, positionY, positionZ]
    params.box = [wallLength, params.height || height, wallWidth]

    return params
  },
  addCameraHelper(camera) {
    let cameraHelper
    let parent
    if (camera instanceof THREE.Camera) {
      parent = new THREE.Group()
      parent.add(camera)
      cameraHelper = new THREE.CameraHelper(camera)
      parent.add(cameraHelper)
      const cameraEye = new THREE.Mesh(
        new THREE.SphereBufferGeometry(10),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      )
      cameraEye.position.copy(camera.position)
      parent.add(cameraEye)
    }
    return parent
  },
  addGroupCamera() {
    const parent = new THREE.Group()
    const splineCamera = new THREE.PerspectiveCamera(
      84,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )

    parent.add(splineCamera)
    const cameraHelper = new THREE.CameraHelper(splineCamera)
    parent.add(cameraHelper)
    const cameraEye = new THREE.Mesh(
      new THREE.SphereBufferGeometry(10),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    cameraEye.position.copy(splineCamera.position)
    parent.add(cameraEye)

    return parent
  },
  //创建盒子
  createBox(params) {
    if (params.start && params.end) {
      params = this.getBoxParams(params)
    }

    const { box, style, materialName = 'lambert' } = params

    const geometry = new THREE.BoxGeometry(...box)

    const materials = this.createMaterials(style, materialName)

    const result = this.createMesh(geometry, materials)

    if (params.position) {
      result.position.set(...params.position)
    }

    if (params.rotation) {
      result.rotation.set(...params.rotation)
    }
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
  getSkin(data, name) {
    let { path = null } = data || {}
    let materialsObj
    if (!path) {
      materialsObj = this.addMaterials(data, name)
    } else {
      materialsObj = this.addTexture(data, name)
    }
    return materialsObj
  },
  createMaterials(params, name = 'lambert') {
    const result = []
    const { skin = null } = params || {}
    if (!skin) {
      return this.getSkin(params, name)
    }
    const faces = ['left', 'right', 'up', 'down', 'after', 'before']
    faces.forEach(key => {
      let curSkin = skin[key] || null
      let materialsObj = this.getSkin(curSkin, name)
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
  merge(op, sObj, tObj, toMaterial) {
    let result
    let sResult = new ThreeBSP(sObj)
    const tResult = new ThreeBSP(tObj)

    switch (op) {
      case '+':
        //result = sResult.union(tResult)
        // tObj.position.set(sObj.position.x, 0, 0)
        tObj.updateMatrix()
        sObj.geometry.merge(tObj.geometry, tObj.matrix)

        return sObj
      // break
      case '&':
        result = sResult.intersect(tResult)
        break
      default:
        result = sResult.subtract(tResult)
        break
    }
    const materials = new THREE.MeshLambertMaterial({
      color: 0xb0cee0,
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    })

    var toResult = result.toMesh(toMaterial || materials)

    toResult.material.shading = THREE.FlatShading
    toResult.geometry.computeFaceNormals()
    toResult.geometry.computeVertexNormals()
    toResult.material.needsUpdate = true
    toResult.geometry.buffersNeedUpdate = true
    toResult.geometry.uvsNeedUpdate = true
    toResult.geometry.colorsNeedUpdate = true
    toResult.geometry.elementsNeedUpdate = true

    return toResult
  },

  addWall(params) {
    const { position, rotation, start, end, style } = params

    const group = this.addObject(params)

    //顶部横条颜色
    const topParams = {
      rotation,
      start,
      end,
      style,
      height: 1,
      position
    }

    const topResult = this.createBox(topParams)
    topResult.position.set(0, group.position.y, 0)
    topResult.rotation.set(0, 0, 0)

    group.add(topResult)

    return group
  },

  addHole(box, hole) {
    const holeCube = this.createBox(hole)

    holeCube.position.set(...hole.position)

    const resultBSP = this.merge(hole.op, box, holeCube)

    return resultBSP
  },
  //打孔
  createHoles(box, hole) {
    let result = this.addHole(box, hole)
    // result.position.set(0, 0, 0)
    return result
  },
  createDoor(params) {
    return this.addDoor(params)
  },
  addDoor(params) {
    return this.addObject(params)
  },

  createWall(params) {
    const { walls } = params

    const group = new THREE.Group()

    walls.forEach(item => {
      group.add(this.addWall(item))
    })

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
    return this.addObject(params)
  },
  createDesk(params) {
    return this.addDesk(params)
  },
  createChair(params) {
    return this.addChair(params)
  },
  addChair(params) {
    return this.addObject(params)
  },
  createChairs(params) {
    const offset = 10
    const [startX] = params.start
    const chair1 = this.createChair(params)

    var axis = new THREE.AxesHelper(50)

    const leftGroup = new THREE.Group()

    //chair1.position.y = -40
    leftGroup.add(chair1)
    for (let i = 1; i < 18; i++) {
      let chairObj = chair1.clone()
      chairObj.position.x = startX + offset * i + (2 * i - 1) * 10
      leftGroup.add(chairObj)
    }

    //scene.add(leftGroup);
    const rightGroup = leftGroup.clone()
    leftGroup.add(axis)
    rightGroup.position.z = 50
    rightGroup.rotation.set(0, Math.PI, 0)
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

    // scene.add(bottomGroup);
    return [leftGroup, rightGroup]
  },
  addPlant(params) {
    const { position, rotation, scale = 80, style } = params
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
    const { style } = params

    const plants = [
      {
        position: [-470, 5, 430],
        style
      },
      {
        position: [-470, 5, -330],
        style
      },
      {
        position: [470, 5, 430],
        style
      },
      {
        position: [470, 5, -330],
        style
      }
    ]
    const plantObj = []
    plants.forEach(item => {
      plantObj.push(this.addPlant(item))
    })

    return plantObj
  },
  drawLine(points) {
    console.log(TWEEN, 'tween.......')

    const curve = new THREE.CatmullRomCurve3([...points])
    //curve.closed = true;

    // var pointsCount = 50;

    // var points = curve.getPoints(pointsCount);
    // var material = new THREE.LineBasicMaterial({
    //   color: 0x0000ff
    // });

    // var geometry = new THREE.Geometry();
    // geometry.setFromPoints(points);
    // geometry.vertices.push(...points)
    // var pointArr = []
    // var line = new THREE.Line( geometry, material );
    // line.geometry.verticesNeedUpdate = true;
    // line.computeLineDistances ()

    const tubeGeometry = new THREE.TubeGeometry(curve, 5, 20, 50, false)
    var tubeMaterial2 = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    })
    console.log(tubeGeometry, 'log.......')

    var line = new THREE.Mesh(tubeGeometry, tubeMaterial2)
    // scene.add(tube2);

    var index = 0
    new TWEEN.Tween({ index: 1 })
      .to({ index: 50 }, 5000)
      .onUpdate(data => {
        index += 1
        console.log(data)
        // pointArr.push(point22)
        // line.geometry.vertices= pointArr
        // console.log(pointArr)
      })
      .onComplete(() => {})
      .easing(TWEEN.Easing.Linear.None)
      .start()

    return line
  },
  addCabinet(params) {
    return this.addObject(params)
  },
  createCabinet(params) {
    return this.addCabinet(params)
  }
}

export default Tools
