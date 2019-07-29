import * as THREE from 'three'

const Particle = function (geometry, options) {

  THREE.Mesh.call(this, geometry);

  this.type = 'Fire';

  this.clock = new THREE.Clock();

  options = options || {};

  this.speed = (options.speed === undefined) ? 500.0 : options.speed;


  var textureWidth = options.textureWidth || 500;
	var textureHeight = options.textureHeight || 500;

  var parameters = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: false,
    stencilBuffer: false
  };


  this.field0 = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters);

  // this.field0.background = new THREE.Color(0xfF0000);

  this.fieldScene = new THREE.Scene();

 // this.fieldScene.background = new THREE.Color(0xff0000);

  const light = new THREE.AmbientLight(0xcccccc);
  light.position.set(0, 0, 0);

  this.fieldScene.add(light);

  this.fieldGeometry = new THREE.PlaneBufferGeometry( textureWidth, textureHeight );


  this.sourceMesh = new THREE.Mesh( this.fieldGeometry, {color: 0xff0000} );
	this.fieldScene.add( this.sourceMesh );

// this.material = {
//   map: this.field0.texture,
//    transparent: true,
//    color: 0xcc00ff,
//    vertexColor: true
// }
this.material = new THREE.MeshBasicMaterial( {
  color: 0xff9300, // 橙色
  // map: this.field0.texture // 使用 RTScene 作为贴图，也就是会贴一张环面图
} );
  this.camera = new THREE.PerspectiveCamera(
    45,
    textureWidth / textureHeight,
    1,
    2000
  );

	// var shader = Particle.shader;
	// this.material = new THREE.ShaderMaterial( {
	// 	uniforms: {
  //     texture: { type: 't', value: this.field0.texture }
  //   },
	// 	vertexShader: Particle.shader.vertexShader,
	// 	fragmentShader: Particle.shader.fragmentShader,
	// 	transparent: false
  // } );
  
  this.renderSource = function (renderer, scene, camera ) {


    // this.sourceMaterial.uniforms["texture"].value = this.field0.texture;

    renderer.setRenderTarget(this.field0);
    renderer.render(this.fieldScene, camera);


  };

  this.onBeforeRender = function (renderer, scene, camera ) {

    var delta = this.clock.getDelta();
    if (delta > 0.1) {

      delta = 0.1;

    }
    var dt = delta * (this.speed * 0.1);
    renderer.clear();
this.renderSource(renderer, scene, camera )
  };

}

Particle.prototype = Object.create(THREE.Mesh.prototype);
Particle.prototype.constructor = Particle;


Particle.shader = {
  vertexShader: [
    'void main()',
    '{',

    'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',// scale particles as objects in 3D space
    'gl_Position = projectionMatrix * mvPosition;',
    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D texture;',
    'void main()',
    '{',

    'vec4 rotatedTexture = texture2D( texture, 0.5 );',
    'gl_FragColor = gl_FragColor * rotatedTexture;', // sets an otherwise white particle texture to desired color
    '}'
  ].join('\n')
}


export default Particle