import * as THREE from 'three'
const TWEEN = require('@tweenjs/tween.js')
require('threebsp')

const addMaterial = (skin, cube, width, height, cface) => {
  const { imgurl = null } = skin || {}
  let material
  if (!imgurl) {
    console.log(skin.skinColor, 'add material', cface)
    if (skin.skinColor) {
      cube.faces[cface].color.setHex(skin.skinColor)
      cube.faces[cface + 1].color.setHex(skin.skinColor)
    }
    material = {
      vertexColors: THREE.FaceColors
    }
  } else {
    const texture = new THREE.TextureLoader().load(imgurl)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    if (skin.repeatx || skin.repeaty) {
      texture.repeat.set(width / 128, height / 128)
    }

    material = { map: texture, transparent: true }
  }

  return new THREE.MeshLambertMaterial(material)
}

export default {
  objects: [],
  scene: null,
  addScene(scene) {
    this.scene = scene
  },
  createCubeX(dataObj) {
    const {
      width = 1000,
      height = 1000,
      depth = 10,
      x = 0,
      y = 0,
      z = 0,
      rx = 0,
      ry = 0,
      rz = 0,
      style = { skinColor: 0x98750f }
    } = dataObj
    var cubeGeometry = new THREE.BoxGeometry(width, height, depth, 0, 0, 1)

    for (var i = 0; i < cubeGeometry.faces.length; i += 2) {
      var hex = Math.random() * 0x531844
      cubeGeometry.faces[i].color.setHex(hex)
      cubeGeometry.faces[i + 1].color.setHex(hex)
    }

    let { skin = {} } = style

    var cubeMaterialArray = []
    cubeMaterialArray.push(
      addMaterial(skin.left || '', cubeGeometry, width, depth, 8)
    )
    cubeMaterialArray.push(
      addMaterial(skin.right || '', cubeGeometry, width, depth, 10)
    )
    cubeMaterialArray.push(
      addMaterial(skin.up || '', cubeGeometry, width, depth, 4)
    )
    cubeMaterialArray.push(
      addMaterial(skin.down || '', cubeGeometry, width, depth, 6)
    )
    cubeMaterialArray.push(
      addMaterial(skin.after || '', cubeGeometry, width, depth, 2)
    )
    cubeMaterialArray.push(
      addMaterial(skin.before || '', cubeGeometry, width, depth, 0)
    )
    // var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterialArray)
    // var helper = new THREE.FaceNormalsHelper(cube, 2, 0x00ff00, 1)
    // scene.add(helper)
    cube.castShadow = true
    cube.receiveShadow = true
    cube.uuid = dataObj.uuid
    cube.name = dataObj.name
    cube.position.set(x, y, z)

    cube.rotation.set(rx, ry, rz)
    return cube
  },
  createEmptyCabinetX(dataObj) {
    const { size, position, doors, skin } = dataObj

    var upobj = {
      uuid: '',
      name: '',
      objType: 'cube',
      width: size.width,
      height: size.thick,
      depth: size.depth,
      x: position.x,
      y: position.y,
      z: position.z,
      style: {
        skinColor: skin.skinColor,
        skin: skin.up.skin
      }
    }
    var upcube = this.createCubeX(upobj)

    var downObj = {
      uuid: '',
      name: '',
      objType: 'cube',
      width: size.width,
      height: size.thick,
      depth: size.depth,
      x: 0,
      y: -size.height,
      z: 0,
      style: {
        skinColor: skin.skinColor,
        skin: skin.down.skin
      }
    }
    var downCube = this.createCubeX(downObj)

    var afterObj = {
      uuid: '',
      name: '',
      objType: 'cube',
      width: size.width,
      height: size.height,
      depth: size.thick,
      x: 0,
      y: -size.height / 2,
      z: size.width / 2,
      style: {
        skinColor: skin.skinColor,
        skin: skin.after.skin
      }
    }
    var afterCube = this.createCubeX(afterObj)

    var leftObj = {
      uuid: '',
      name: '',
      objType: 'cube',
      width: size.depth,
      height: size.height,
      depth: size.thick,
      x: size.width / 2,
      y: -size.height / 2,
      z: 0,
      ry: Math.PI / 2,
      style: {
        skinColor: skin.skinColor,
        skin: skin.left.skin
      }
    }
    var leftCube = this.createCubeX(leftObj)

    var rightObj = {
      uuid: '',
      name: '',
      objType: 'cube',
      width: size.depth,
      height: size.height,
      depth: size.thick,
      x: -size.width / 2,
      y: -size.height / 2,
      z: 0,
      ry: Math.PI / 2,
      style: {
        skinColor: skin.skinColor,
        skin: skin.right.skin
      }
    }
    var rightCube = this.createCubeX(rightObj)

    var Cabinet = this.mergeModel('+', upcube, leftCube)
    Cabinet = this.mergeModel('+', Cabinet, rightCube)
    Cabinet = this.mergeModel('+', Cabinet, afterCube)
    Cabinet = this.mergeModel('+', Cabinet, downCube)

    var singledoorobj = {
      show: true,
      uuid: '',
      name: doors.doorname[0],
      objType: 'cube',
      width: size.width,
      depth: size.thick,
      height: size.height,
      x: position.x,
      y: -size.height / 2,
      z: position.z - size.width / 2,
      style: {
        skinColor: doors.skins[0].skinColor,
        skin: doors.skins[0]
      }
    }
    var singledoorcube = this.createCubeX(singledoorobj)

    const tempobj = new THREE.Group()

    tempobj.add(Cabinet)
    tempobj.name = `${dataObj.name}_wrap`
    tempobj.uuid = dataObj.uuid
    Cabinet.name = dataObj.shellname
    this.objects.push(Cabinet)

    tempobj.add(singledoorcube)

    this.objects.push(singledoorcube)

    tempobj.position.set(
      Cabinet.position.x,
      Cabinet.position.y,
      Cabinet.position.z
    )

    this.objects.push(tempobj)

    return tempobj
  },

  openRightDoor(_obj) {
    var doorstate = 'close'
    var tempobj = null
    if (_obj.doorState != null && typeof _obj.doorState != 'undefined') {
      doorstate = _obj.doorState
      tempobj = _obj.parent
    } else {
      console.log('add parent')
      var _objparent = _obj.parent
      tempobj = new THREE.Object3D()
      tempobj.position.set(
        _obj.position.x - _obj.geometry.parameters.width / 2,
        _obj.position.y,
        _obj.position.z
      )
      _obj.position.set(_obj.geometry.parameters.width / 2, 0, 0)
      tempobj.add(_obj)
      _objparent.add(tempobj)
    }
    _obj.doorState = doorstate == 'close' ? 'open' : 'close'

    new TWEEN.Tween(tempobj.rotation)
      .to(
        {
          y: doorstate == 'close' ? 0.25 * 2 * Math.PI : 0 * 2 * Math.PI
        },
        10000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  },
  openDoor(_obj) {
    var doorstate = 'close'
    var tempobj = null
    if (_obj.doorState != null && typeof _obj.doorState != 'undefined') {
      doorstate = _obj.doorState
      tempobj = _obj.parent
    } else {
      console.log('add parent')
      var _objparent = _obj.parent
      tempobj = new THREE.Object3D()
      tempobj.position.set(
        _obj.position.x - _obj.geometry.parameters.width / 2,
        _obj.position.y,
        _obj.position.z
      )
      _obj.position.set(_obj.geometry.parameters.width / 2, 0, 0)
      tempobj.name = `${_obj.name}_temp`
      tempobj.add(_obj)
      _objparent.add(tempobj)
    }
    _obj.doorState = doorstate == 'close' ? 'open' : 'close'

    new TWEEN.Tween(tempobj.rotation)
      .to(
        {
          y: doorstate == 'close' ? 0.25 * 2 * Math.PI : 0 * 2 * Math.PI
        },
        10000
      )
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  },
  openLeftDoor(_obj) {
    var doorstate = 'close'
    var tempobj = null
    if (_obj.doorState != null && typeof _obj.doorState != 'undefined') {
      doorstate = _obj.doorState
      tempobj = _obj.parent
    } else {
      console.log('add parent')
      var _objparent = _obj.parent
      tempobj = new THREE.Object3D()
      tempobj.position.set(
        _obj.position.x + _obj.geometry.parameters.width / 2,
        _obj.position.y,
        _obj.position.z
      )
      _obj.position.set(-_obj.geometry.parameters.width / 2, 0, 0)

      tempobj.add(_obj)
      _objparent.add(tempobj)
    }
    _obj.doorState = doorstate == 'close' ? 'open' : 'close'
    console.log(TWEEN, 'tween..........')
    new TWEEN.Tween(tempobj.rotation)
      .to(
        {
          y: doorstate == 'close' ? -0.25 * 2 * Math.PI : 0 * 2 * Math.PI
        },
        10000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  },
  openServer(_obj) {
    var cardstate = 'in'
    if (_obj.cardstate != null && typeof _obj.cardstate != 'undefined') {
      cardstate = _obj.cardstate
    } else {
      _obj.cardstate = 'out'
    }

    new TWEEN.Tween(_obj.position)
      .to(
        {
          z: cardstate == 'in' ? _obj.position.z - 60 : _obj.position.z + 60
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
      .onUpdate(function() {
        _obj.cardstate = cardstate == 'in' ? 'out' : 'in'
      })
  },
  mergeModel(mergeOP, _fobj, _sobj) {
    var fobjBSP = new ThreeBSP(_fobj)
    var sobjBSP = new ThreeBSP(_sobj)
    // var sobjBSP = new ThreeBSP(_sobj);
    var resultBSP = null
    if (mergeOP == '-') {
      resultBSP = fobjBSP.subtract(sobjBSP)
    } else if (mergeOP == '+') {
      var subMesh = new THREE.Mesh(_sobj)
      _sobj.updateMatrix()
      _fobj.geometry.merge(_sobj.geometry, _sobj.matrix)
      return _fobj
      // resultBSP = fobjBSP.union(sobjBSP);
    } else if (mergeOP == '&') {
      //交集
      resultBSP = fobjBSP.intersect(sobjBSP)
    } else {
      this.objects.push(_sobj)
      this.scene.add(_sobj)
      return _fobj
    }
    var cubeMaterialArray = []
    for (var i = 0; i < 1; i++) {
      cubeMaterialArray.push(
        new THREE.MeshLambertMaterial({
          vertexColors: THREE.FaceColors
        })
      )
    }
    var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray)
    var result = resultBSP.toMesh(cubeMaterials)
    result.material.shading = THREE.FlatShading
    result.geometry.computeFaceNormals()
    result.geometry.computeVertexNormals()
    result.uuid = _fobj.uuid + mergeOP + _sobj.uuid
    result.name = _fobj.name + mergeOP + _sobj.name
    result.material.needsUpdate = true
    result.geometry.buffersNeedUpdate = true
    result.geometry.uvsNeedUpdate = true

    result.castShadow = true
    result.receiveShadow = true
    return result
  },
  createPlaneGeometry(_obj) {
    var options = _obj
    var texture
    if (typeof options.pic == 'string') {
      //传入的材质是图片路径，使用 textureloader加载图片作为材质
      var loader = new THREE.TextureLoader()
      // loader.setCrossOrigin(this.crossOrigin)
      texture = loader.load(
        options.pic,
        function() {},
        undefined,
        function() {}
      )
    } else {
      texture = new THREE.CanvasTexture(options.pic)
    }
    var MaterParam = {
      //材质的参数
      map: texture,
      overdraw: true,
      side: THREE.BackSide,
      //              blending: THREE.AdditiveBlending,
      transparent: options.transparent,
      //needsUpdate:true,
      //premultipliedAlpha: true,
      opacity: options.opacity
    }
    if (options.blending) {
      MaterParam.blending = THREE.AdditiveBlending //使用饱和度叠加渲染
    }
    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(options.width, options.height, 1, 1),
      new THREE.MeshBasicMaterial(MaterParam)
    )
    plane.position.x = options.position.x
    plane.position.y = options.position.y
    plane.position.z = options.position.z
    plane.rotation.x = options.rotation.x
    plane.rotation.y = options.rotation.y
    plane.rotation.z = options.rotation.z
    return plane
  },
  CreateFloor(_obj) {
    return this.createCubeX(_obj)
  },
  CreateHole(_obj) {
    var _commonThick = 40 //墙体厚度
    var _commonLength = 100 //墙体厚度
    var _commonHeight = 300 //强体高度
    var _commonSkin = 0x98750f
    //建立墙面
    var wallLength = _commonLength
    var wallWidth = _obj.thick || _commonThick
    var positionX = ((_obj.startDot.x || 0) + (_obj.endDot.x || 0)) / 2
    var positionY = ((_obj.startDot.y || 0) + (_obj.endDot.y || 0)) / 2
    var positionZ = ((_obj.startDot.z || 0) + (_obj.endDot.z || 0)) / 2
    //z相同 表示x方向为长度
    if (_obj.startDot.z == _obj.endDot.z) {
      wallLength = Math.abs(_obj.startDot.x - _obj.endDot.x)
      wallWidth = _obj.thick || _commonThick
    } else if (_obj.startDot.x == _obj.endDot.x) {
      wallLength = _obj.thick || _commonThick
      wallWidth = Math.abs(_obj.startDot.z - _obj.endDot.z)
    }
    var cubeobj = {
      width: wallLength,
      depth: wallWidth,
      height: _obj.height || _commonHeight,
      rotation: _obj.rotation,
      x: positionX,
      uuid: _obj.uuid,
      name: _obj.name,
      y: positionY,
      z: positionZ,
      style: {
        skinColor: _commonSkin,
        skin: _obj.skin
      }
    }
    var _cube = this.createCubeX(cubeobj)
    return _cube
  },
  CreateWall(_obj) {
    var _commonThick = _obj.thick || 40 //墙体厚度
    var _commonLength = _obj.length || 100 //墙体厚度
    var _commonHeight = _obj.height || 300 //强体高度
    var _commonSkin = _obj.style.skinColor || 0x98750f
    //建立墙面
    var walls = []

    _obj.wallData.forEach(wallobj => {
      var wallLength = _commonLength
      var wallWidth = wallobj.thick || _commonThick
      var positionX = ((wallobj.startDot.x || 0) + (wallobj.endDot.x || 0)) / 2
      var positionY = ((wallobj.startDot.y || 0) + (wallobj.endDot.y || 0)) / 2
      var positionZ = ((wallobj.startDot.z || 0) + (wallobj.endDot.z || 0)) / 2
      //z相同 表示x方向为长度
      if (wallobj.startDot.z == wallobj.endDot.z) {
        wallLength = Math.abs(wallobj.startDot.x - wallobj.endDot.x)
        wallWidth = wallobj.thick || _commonThick
      } else if (wallobj.startDot.x == wallobj.endDot.x) {
        wallLength = wallobj.thick || _commonThick
        wallWidth = Math.abs(wallobj.startDot.z - wallobj.endDot.z)
      }
      var cubeobj = {
        width: wallLength,
        depth: wallWidth,
        height: wallobj.height || _commonHeight,
        rotation: wallobj.rotation,
        x: positionX,
        y: positionY,
        z: positionZ,
        uuid: wallobj.uuid,
        name: wallobj.name,
        style: {
          skinColor: _commonSkin,
          skin: wallobj.skin
        }
      }
      var _cube = this.createCubeX(cubeobj)
      if (wallobj.childrens && wallobj.childrens.length > 0) {
        var _newobj
        wallobj.childrens.forEach(walchildobj => {
          //_newobj = null
          _newobj = this.CreateHole(walchildobj)
          _cube = this.mergeModel(walchildobj.op, _cube, _newobj)
        })
      }
      walls.push(_cube)
      this.objects.push(_cube)
    })
    return walls
  }
}
