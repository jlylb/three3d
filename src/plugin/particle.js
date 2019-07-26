import * as THREE from 'three'

const Particle = function (geometry, options) {

  THREE.Points.call(this, geometry);

  this.type = 'Fire';

  this.clock = new THREE.Clock();

  options = options || {};

  this.speed = (options.speed === undefined) ? 500.0 : options.speed;


  var textureWidth = options.textureWidth || 100;
	var textureHeight = options.textureHeight || 100;

  var parameters = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: false,
    stencilBuffer: false
  };


  this.field0 = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters);

  this.field0.background = new THREE.Color(0xfF0000);

  this.fieldScene = new THREE.Scene();

  this.fieldScene.background = new THREE.Color(0xff0000);

  this.fieldGeometry = new THREE.PlaneBufferGeometry( textureWidth, textureHeight );


  this.sourceMesh = new THREE.Mesh( this.fieldGeometry, {color: 0xff0000} );
	this.fieldScene.add( this.sourceMesh );


  this.camera = new THREE.PerspectiveCamera(
    45,
    textureWidth / textureHeight,
    1,
    200
  );

	// var shader = Particle.shader;
	// this.sourceMaterial = new THREE.ShaderMaterial( {
	// 	uniforms: {
  //     texture: { type: 't', value: null }
  //   },
	// 	vertexShader: shader.vertexShader,
	// 	fragmentShader: shader.fragmentShader,
	// 	transparent: false
  // } );
  
  this.renderSource = function (renderer) {


    // this.sourceMaterial.uniforms["texture"].value = this.field0.texture;

    renderer.setRenderTarget(this.field0);
    renderer.render(this.fieldScene, this.camera);


  };

  this.onBeforeRender = function (renderer) {

    var delta = this.clock.getDelta();
    if (delta > 0.1) {

      delta = 0.1;

    }
    var dt = delta * (this.speed * 0.1);

this.renderSource(renderer)
  };

}

Particle.prototype = Object.create(THREE.Points.prototype);
Particle.prototype.constructor = Particle;


Particle.shader = {
  vertexShader: [
    'attribute vec3  customColor;',
    'attribute float customOpacity;',
    'attribute float customSize;',
    'attribute float customAngle;',
    'attribute float customVisible;', // float used as boolean (0 = false, 1 = true)
    'varying vec4  vColor;',
    'varying float vAngle;',
    'void main()',
    '{',
    'if ( customVisible > 0.5 )', // true
    'vColor = vec4( customColor, customOpacity );', //     set color associated to vertex; use later in fragment shader.
    'else', // false
    'vColor = vec4(0.0, 0.0, 0.0, 0.0);', //     make particle invisible.

    'vAngle = customAngle;',

    'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
    'gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );', // scale particles as objects in 3D space
    'gl_Position = projectionMatrix * mvPosition;',
    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D texture;',
    'varying vec4 vColor;',
    'varying float vAngle;',
    'void main()',
    '{',
    'gl_FragColor = vColor;',

    'float c = cos(vAngle);',
    'float s = sin(vAngle);',
    'vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,',
    'c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);', // rotate UV coordinates to rotate texture
    'vec4 rotatedTexture = texture2D( texture,  rotatedUV );',
    'gl_FragColor = gl_FragColor * rotatedTexture;', // sets an otherwise white particle texture to desired color
    '}'
  ].join('\n')
}


export default Particle