import * as THREE from "three";
const TWEEN = require('@tweenjs/tween.js');
require("threebsp");

const addMaterial = (skin) => {
    console.log(skin, "change skin.......")
    const { imgurl=null } = skin||{};
    let material
    if(!imgurl) {
        material = {
            vertexColors: THREE.FaceColors
        }
    }else{
        const texture = new THREE.TextureLoader().load(imgurl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        material = { map: texture, transparent: true }
    }

    return new THREE.MeshLambertMaterial(material)
}

export default {
    objects: [],
    createCubeX(dataObj) {
        const {
            width=1000,
            height=1000,
            depth=10,
            x=0,
            y=0,
            z=0,
            style = { skinColor: 0x98750f }
        } = dataObj
        var cubeGeometry = new THREE.CubeGeometry(width, height, depth, 0, 0, 1);
        for (var i = 0; i < cubeGeometry.faces.length; i += 2) {
            var hex = Math.random() * 0x531844;
            cubeGeometry.faces[i].color.setHex(hex);
            cubeGeometry.faces[i + 1].color.setHex(hex);
        }

        const { skin } = style

        var cubeMaterialArray = [];
        cubeMaterialArray.push(addMaterial(skin.before));
        cubeMaterialArray.push(addMaterial(skin.after));
        cubeMaterialArray.push(addMaterial(skin.up));
        cubeMaterialArray.push(addMaterial(skin.down));
        cubeMaterialArray.push(addMaterial(skin.left));
        cubeMaterialArray.push(addMaterial(skin.right));
        // var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterialArray);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.uuid = dataObj.uuid;
        cube.name = dataObj.name;
        cube.position.set(x, y, z);
        return cube
    },
    createEmptyCabinetX(dataObj){
        const { size, position, skin, doors } = dataObj

        var upobj= {
            uuid: "",
            name: '',
            objType: 'cube',
            depth: size.depth,
            width: size.width+1 ,
            height: size.thick+1,
            x: position.x+1,
            y:0,
            z:position.z,
            style: {
                skinColor: skin.skinColor,
                skin: skin.up.skin
            }
        }
        var upcube = this.createCubeX(upobj);
        //左
        var leftobj = {
            uuid: "",
            name: '',
            objType: 'cube',
            depth: size.thick,
            width: size.width ,
            height: size.height,
            x: 0,
            y: -(size.height / 2 - size.thick / 2),
            z: 0 - (size.depth / 2 - size.thick / 2) - 1,
            style: {
                skinColor: skin.skinColor,
                skin: skin.left.skin
            }
        }
        var leftcube = this.createCubeX(leftobj);

        var Cabinet = this.mergeModel('+', upcube, leftcube);

        var Rightobj = {
            show: true,
            uuid: "",
            name: '',
            objType: 'cube',
            width: size.width,
            depth: size.thick,
            height: size.height,
            x: 0,
            y: -(size.height / 2 - size.thick / 2),
            z: (size.depth / 2 - size.thick / 2)+1,
            style: {
                skinColor: skin.skinColor,
                skin: skin.right.skin
            }
        }
        var Rightcube = this.createCubeX(Rightobj);

        Cabinet = this.mergeModel('+', Cabinet, Rightcube);

        var Behidobj = {
            show: true,
            uuid: "",
            name: '',
            objType: 'cube',
            width: size.thick,
            depth: size.width,
            height: size.height,
            x: (size.width / 2 - size.thick / 2)+1,
            y: -(size.height / 2 - size.thick / 2),
            z:0,
            style: {
                skinColor: skin.skinColor,
               skin: skin.after.skin
            }
        }
        var Behindcube = this.createCubeX(Behidobj);
        Cabinet = this.mergeModel('+', Cabinet, Behindcube);



        var Downobj = {
            show: true,
            uuid: "",
            name: '',
            objType: 'cube',
            width: size.width+1,
            depth: size.depth,
            height: size.thick,
            x:-1,
            y: -(size.height- size.thick)-1,
            z: 0,
            style: {
                skinColor: skin.skinColor,
                skin: skin.down.skin
            }
        }
        var Downcube = this.createCubeX(Downobj);

        Cabinet = this.mergeModel('+', Cabinet, Downcube);

        var singledoorobj = {
            show: true,
            uuid:"",
            name: doors.doorname[0],
            objType: 'cube',
            width: size.thick,
            depth: size.depth,
            height: size.height,
            x: position.x - size.width / 2 - size.thick / 2,
            y: -(size.height / 2 - size.thick / 2),
            z: position.z,
            style: {
                skinColor: doors.skins[0].skinColor,
                skin: doors.skins[0]
            }
        }
        var singledoorcube = this.createCubeX(singledoorobj);

        const tempobj = new THREE.Object3D();

        tempobj.add(Cabinet);
        tempobj.name = dataObj.name;
        tempobj.uuid = dataObj.uuid;
        Cabinet.name = dataObj.shellname,
        this.objects.push(Cabinet);

       // tempobj.position.set(Cabinet.position.x, Cabinet.position.y,Cabinet.position.z);

        tempobj.add(singledoorcube);
        this.objects.push(singledoorcube);

        this.objects.push(tempobj);

        return tempobj
    },
    openRightDoor(_obj) {
        var doorstate = "close";
        var tempobj = null;
        if (_obj.doorState != null && typeof (_obj.doorState) != 'undefined') {
            doorstate = _obj.doorState;
            tempobj = _obj.parent;
        } else {
            console.log("add parent");
            var _objparent = _obj.parent;
            tempobj = new THREE.Object3D();
            tempobj.position.set(_obj.position.x - _obj.geometry.parameters.width / 2, _obj.position.y, _obj.position.z);
            _obj.position.set(_obj.geometry.parameters.width/2, 0, 0);
            tempobj.add(_obj);
            _objparent.add(tempobj);
        }
        _obj.doorState = (doorstate == "close" ? "open" : "close");
        console.log(_obj.doorState,  tempobj.rotation, tempobj.position, _obj.position)
        new TWEEN.Tween(tempobj.rotation).to({
            y: (doorstate == "close" ? 0.25 * 2 * Math.PI : 0 * 2 * Math.PI)
        }, 10000).easing(TWEEN.Easing.Quadratic.Out).start();
    },
    openServer (_obj) {
        var cardstate = "in";
        if (_obj.cardstate != null && typeof (_obj.cardstate) != 'undefined') {
            cardstate = _obj.cardstate;
        } else {
            _obj.cardstate = "out";
        }
        new TWEEN.Tween(_obj.position).to({
            x: (cardstate == "in" ? _obj.position.x - 50 : _obj.position.x + 50),
        }, 1000).easing(TWEEN.Easing.Quadratic.Out).start().onUpdate(function () { _obj.cardstate = cardstate == "in" ? "out" : "in"; });
    },
    mergeModel(mergeOP, _fobj, _sobj) {
        var fobjBSP = new ThreeBSP(_fobj);
        var sobjBSP = new ThreeBSP(_sobj);
       // var sobjBSP = new ThreeBSP(_sobj);
        var resultBSP = null; 
        if (mergeOP == '-') {
            resultBSP = fobjBSP.subtract(sobjBSP);
        } else if (mergeOP == '+') {
            var subMesh = new THREE.Mesh(_sobj);
            _sobj.updateMatrix();
            _fobj.geometry.merge(_sobj.geometry, _sobj.matrix);
            return _fobj;
           // resultBSP = fobjBSP.union(sobjBSP);
        } else if (mergeOP == '&') {//交集
            resultBSP = fobjBSP.intersect(sobjBSP);
        } else {
            this.objects.push(_sobj);
            return _fobj;
        }
        var cubeMaterialArray = [];
        for (var i = 0; i < 1; i++) {
            cubeMaterialArray.push(new THREE.MeshLambertMaterial({
                vertexColors: THREE.FaceColors
            }));
        }
        var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
        var result = resultBSP.toMesh(cubeMaterials);
        result.material.shading = THREE.FlatShading;
        result.geometry.computeFaceNormals();
        result.geometry.computeVertexNormals();
        result.uuid= _fobj.uuid+mergeOP+_sobj.uuid;
        result.name=_fobj.name+mergeOP+_sobj.name;
        result.material.needsUpdate = true;
        result.geometry.buffersNeedUpdate = true;
        result.geometry.uvsNeedUpdate = true;
        var _foreFaceSkin = null;
        for (var i = 0; i < result.geometry.faces.length; i++) {
            var _faceset = false;
            for (var j = 0; j < _fobj.geometry.faces.length; j++) {
                if (result.geometry.faces[i].vertexNormals[0].x === _fobj.geometry.faces[j].vertexNormals[0].x
                    && result.geometry.faces[i].vertexNormals[0].y === _fobj.geometry.faces[j].vertexNormals[0].y
                    && result.geometry.faces[i].vertexNormals[0].z === _fobj.geometry.faces[j].vertexNormals[0].z
                     && result.geometry.faces[i].vertexNormals[1].x === _fobj.geometry.faces[j].vertexNormals[1].x
                    && result.geometry.faces[i].vertexNormals[1].y === _fobj.geometry.faces[j].vertexNormals[1].y
                    && result.geometry.faces[i].vertexNormals[1].z === _fobj.geometry.faces[j].vertexNormals[1].z
                    && result.geometry.faces[i].vertexNormals[2].x === _fobj.geometry.faces[j].vertexNormals[2].x
                    && result.geometry.faces[i].vertexNormals[2].y === _fobj.geometry.faces[j].vertexNormals[2].y
                    && result.geometry.faces[i].vertexNormals[2].z === _fobj.geometry.faces[j].vertexNormals[2].z) {
                    result.geometry.faces[i].color.setHex(_fobj.geometry.faces[j].color.r * 0xff0000 + _fobj.geometry.faces[j].color.g * 0x00ff00 + _fobj.geometry.faces[j].color.b * 0x0000ff);
                    _foreFaceSkin = _fobj.geometry.faces[j].color.r * 0xff0000 + _fobj.geometry.faces[j].color.g * 0x00ff00 + _fobj.geometry.faces[j].color.b * 0x0000ff;
                    _faceset =true;
                }
            }
            if (_faceset == false){
                for(var j = 0; j < _sobj.geometry.faces.length; j++) {
                    if (result.geometry.faces[i].vertexNormals[0].x === _sobj.geometry.faces[j].vertexNormals[0].x
                        && result.geometry.faces[i].vertexNormals[0].y === _sobj.geometry.faces[j].vertexNormals[0].y
                        && result.geometry.faces[i].vertexNormals[0].z === _sobj.geometry.faces[j].vertexNormals[0].z
                         && result.geometry.faces[i].vertexNormals[1].x === _sobj.geometry.faces[j].vertexNormals[1].x
                        && result.geometry.faces[i].vertexNormals[1].y === _sobj.geometry.faces[j].vertexNormals[1].y
                        && result.geometry.faces[i].vertexNormals[1].z === _sobj.geometry.faces[j].vertexNormals[1].z
                        && result.geometry.faces[i].vertexNormals[2].x === _sobj.geometry.faces[j].vertexNormals[2].x
                        && result.geometry.faces[i].vertexNormals[2].y === _sobj.geometry.faces[j].vertexNormals[2].y
                        && result.geometry.faces[i].vertexNormals[2].z === _sobj.geometry.faces[j].vertexNormals[2].z
                        && result.geometry.faces[i].vertexNormals[2].z === _sobj.geometry.faces[j].vertexNormals[2].z) {
                        result.geometry.faces[i].color.setHex(_sobj.geometry.faces[j].color.r * 0xff0000 + _sobj.geometry.faces[j].color.g * 0x00ff00 + _sobj.geometry.faces[j].color.b * 0x0000ff);
                        _foreFaceSkin = _sobj.geometry.faces[j].color.r * 0xff0000 + _sobj.geometry.faces[j].color.g * 0x00ff00 + _sobj.geometry.faces[j].color.b * 0x0000ff;
                        _faceset = true;
                    }
                }
            }
            if (_faceset == false) {
                result.geometry.faces[i].color.setHex(_foreFaceSkin);
            }
        // result.geometry.faces[i].materialIndex = i
        }
        result.castShadow = true;
        result.receiveShadow = true;
        return result;
    },
    createPlaneGeometry(_obj) {

 var  options = _obj;
  if (typeof options.pic == "string") {//传入的材质是图片路径，使用 textureloader加载图片作为材质
      var loader = new THREE.TextureLoader();
      loader.setCrossOrigin(this.crossOrigin);
      var texture = loader.load(options.pic, function () { }, undefined, function () { });
  } else {
      var texture = new THREE.CanvasTexture(options.pic)
  }
  var MaterParam = {//材质的参数
      map: texture,
      overdraw: true,
      side: THREE.FrontSide,
      //              blending: THREE.AdditiveBlending,
      transparent: options.transparent,
      //needsUpdate:true,
      //premultipliedAlpha: true,
      opacity: options.opacity
  }
  if (options.blending) {
      MaterParam.blending = THREE.AdditiveBlending//使用饱和度叠加渲染
  }
  var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(options.width, options.height, 1, 1),
      new THREE.MeshBasicMaterial(MaterParam)
  );
  plane.position.x = options.position.x;
  plane.position.y = options.position.y;
  plane.position.z = options.position.z;
  plane.rotation.x = options.rotation.x;
  plane.rotation.y = options.rotation.y;
  plane.rotation.z = options.rotation.z;
  return plane;
},
CreateFloor(_obj) {
    return this.createCubeX(_obj);
}
}