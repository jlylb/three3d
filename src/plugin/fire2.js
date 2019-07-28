/**
 * @author Mike Piecuch / https://github.com/mikepiecuch
 *
 * Based on research paper "Real-Time Fluid Dynamics for Games" by Jos Stam
 * http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
 *
 */

import * as THREE from 'three'

const Fire = function ( geometry, options ) {

	THREE.Mesh.call( this, geometry );

	this.type = 'Fire';

	this.clock = new THREE.Clock();

	options = options || {};

	var textureWidth = options.textureWidth || 512;
	var textureHeight = options.textureHeight || 512;




	var parameters = {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		depthBuffer: false,
		stencilBuffer: false
	};



	this.field1 = new THREE.WebGLRenderTarget( textureWidth, textureHeight, parameters );

	//this.field1.background = new THREE.Color( 0x000000 );





	this.fieldScene = new THREE.Scene();
	this.fieldScene.background = new THREE.Color( 0xfffffff);

	// this.orthoCamera = new THREE.OrthographicCamera( textureWidth / - 2, textureWidth / 2, textureHeight / 2, textureHeight / - 2, 1, 2 );
	// this.orthoCamera.position.z = 1;

	this.orthoCamera = new THREE.PerspectiveCamera(
        45,
		textureWidth / textureHeight,
        1,
        2000
      );
	 this.orthoCamera.position.set(0, 400, 400);

	 this.orthoCamera.lookAt(this.fieldScene.position)
	  
	var light = new THREE.AmbientLight(0xffffff);
	light.position.set(0, 0, 0);

	this.fieldScene.add(light)

	var light2 = new THREE.PointLight(0xff0000);

	light2.position.set(0, 300, 0);

	this.fieldScene.add(light2);




	this.fieldGeometry = new THREE.BoxBufferGeometry( 256, 256, 256);

	this.fieldMaterail = new THREE.MeshBasicMaterial({
		color: new THREE.Color(0xff00ff),
		//transparent: true,
		// opacity: 0.5
		side: THREE.DoubleSide
	})

	this.fieldMesh = new THREE.Mesh(this.fieldGeometry, this.fieldMaterail)

	// this.fieldMesh.position.set(150, 50, 50)

	this.fieldScene.add(this.fieldMesh)


	this.material = new THREE.MeshLambertMaterial( {
		// color: 0x0000ff,
		// side: THREE.DoubleSide,
		// transparent: true,
		// opacity: 0.2,
	} );




	this.renderSource = function ( renderer ) {


		renderer.setRenderTarget( this.field1 );
		renderer.render( this.fieldScene, this.orthoCamera );

		// this.swapTextures();

	};

	this.saveRenderState = function ( renderer ) {

		this.savedRenderTarget = renderer.getRenderTarget();
		this.savedVrEnabled = renderer.vr.enabled;
		this.savedShadowAutoUpdate = renderer.shadowMap.autoUpdate;
		this.savedAntialias = renderer.antialias;
		this.savedToneMapping = renderer.toneMapping;

	};

	this.restoreRenderState = function ( renderer ) {

		renderer.vr.enabled = this.savedVrEnabled;
		renderer.shadowMap.autoUpdate = this.savedShadowAutoUpdate;
		renderer.setRenderTarget( this.savedRenderTarget );
		renderer.antialias = this.savedAntialias;
		renderer.toneMapping = this.savedToneMapping;

	};


	this.onBeforeRender = function ( renderer ) {

		var delta = this.clock.getDelta();
		if ( delta > 0.1 ) {

			delta = 0.1;

		}
		var dt = delta * ( this.speed * 0.1 );

		this.saveRenderState( renderer );

		renderer.vr.enabled = false; // Avoid camera modification and recursion
		renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
		renderer.antialias = false;
		renderer.toneMapping = THREE.NoToneMapping;

		this.renderSource( renderer );
		
		this.fieldMesh.rotation.y += 0.01

		// Final result out for coloring

		this.material.map = this.field1.texture;
		this.material.color = new THREE.Color(0x00ff00, 1);
		this.material.transparent = true;
		//this.material.opacity = 0.2;
		this.material.minFilter = THREE.LinearFilter
		this.material.magFilter = THREE.LinearFilter

		this.material.needsUpdate = true

		this.restoreRenderState( renderer );

	};

};


Fire.prototype = Object.create( THREE.Mesh.prototype );
Fire.prototype.constructor = Fire;


export default Fire