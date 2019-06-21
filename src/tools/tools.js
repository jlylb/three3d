import * as THREE from 'three'
import { ReactiveTest } from 'rx';
const TWEEN = require('@tweenjs/tween.js')
require('threebsp')


export default {
    camera: null,
    selectObj: null,
    openDoor(obj, doorDirection = "left") {
        var doorstate = "close";
        var tempobj = null;
        if (obj.doorState != null && typeof obj.doorState != "undefined") {
          doorstate = obj.doorState;
          tempobj = obj.parent;
        } else {
          console.log("add parent");
          var objparent = obj.parent;
          tempobj = new THREE.Group();
          tempobj.position.set(
            obj.position.x + obj.geometry.parameters.width / 2,
            obj.position.y,
            obj.position.z
          );
  
          obj.position.set(-obj.geometry.parameters.width / 2, 0, 0);
  
          tempobj.add(obj);
  
          objparent.add(tempobj);
        }
        obj.doorState = doorstate == "close" ? "open" : "close";

        new TWEEN.Tween(tempobj.rotation)
          .to(
            {
              y:
                doorstate == "close"
                  ? (doorDirection == "left" ? -3 / 5 : -3 / 5) * Math.PI
                  : 0 * (3 / 5) * Math.PI
            },
            10000
          )
          .easing(TWEEN.Easing.Elastic.Out)
          .start();
      },

      onDocumentMouseDown(event) {
        //raycaster.setFromCamera(mouse, camera);
  
        var mouse = {};
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(this.camera);
  
        //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
        var raycaster = new THREE.Raycaster(
          this.camera.position,
          vector.sub(this.camera.position).normalize()
        );
  
  
        var intersects = raycaster.intersectObjects(scene.children, true);
  
        console.log(intersects, "intersect......");
  
        if (intersects.length > 0) {
          controls.enabled = false;
  
          selectObj = intersects[0].object;
  
          if (selectObj.name.includes("leftdoor")) {
            this.openDoor(selectObj);
          }
          if (selectObj.name.includes("rightdoor")) {
            this.openDoor(selectObj, "right");
          }
  
          controls.enabled = true;
        }
      },
      onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      //创建盒子
      createBox(box) {
        const geometry = new THREE.BoxGeometry(...box.size);
        const materials = new THREE.MeshLambertMaterial({
            color: 0xb0cee0,
            side: THREE.DoubleSide
          });
        const result = new THREE.Mesh(geometry, materials);
      },
      createMaterials(materials) {
        const materialsObj = new THREE.MeshLambertMaterial(materials || {
            color: 0xb0cee0,
            side: THREE.DoubleSide
        });
        return materialsObj
      },
      createMesh(geometry, materials, mesh) {
        const result = new THREE.Mesh(geometry, materials);
        return result
      },
      createEdges(geometry, materials) {
        const edges = new THREE.EdgesGeometry(geometry);

        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial(materials ||{ color: 0x00ff00 })
        );
        return line
      },
      createAxes(len) {
        const axis = new THREE.AxesHelper(len);
        return axis
      },
      merge(op, sObj, tObj) {
        let result
        let sResult = new ThreeBSP(sObj);
        const tResult = new ThreeBSP(tObj);
        switch (op) {
            case "+":
                result = sResult.union(tResult)
                break;
            case "&":
                result = sResult.intersect(tResult)
                break;
            default:
                result = sResult.subtract(tResult)
                break;
        }
        return result.toMesh()
      },
      //打孔
      createHoles(holes) {

      },

}

