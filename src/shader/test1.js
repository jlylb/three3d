const vertexShader = [
  'attribute float size;',
  'attribute vec3 position2;',
  'uniform float val;',
  'varying vec3 vPos;',
  'void main()',
  '{',
  'vPos.x = position.x * val + position2.x * (1.-val);',
  'vPos.y = position.y * val + position2.y * (1.-val);',
  'vPos.z = position.z * val + position2.z * (1.-val);',
  'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  'gl_PointSize = size * (300.0 / -mvPosition.z);',
  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n')

const fragmentShader = [
  'uniform vec3 color;',
  'uniform sampler2D texture;',
  'varying vec3 vPos;',
  'void main()',
  '{',
  'vec3 vColor = vec3( 1.0, 0.0, 0.0);',
  'vColor.r = vPos.z/50.;',
  'vColor.g = vPos.y/50.;',
  'vColor.b = vPos.x/50.;',
  'gl_FragColor = vec4( color * vColor, 1.0 );',
  'gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );',
  '}'
].join('\n')

export default {
  uniforms: {},
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}
