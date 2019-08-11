const particleVertexShader = [
  'attribute float size;',
  'uniform float speed;',
  'void main()',
  '{',
  'vec4 mvPosition = modelViewMatrix * vec4( position + vec3(0.0, speed, 0.0), 1.0 );',
  'gl_PointSize =  size * ( 300.0 / -mvPosition.z );',
  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n')

const particleFragmentShader = [
  'uniform sampler2D pointTexture;',
  'void main()',
  '{',
  'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
  'gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );',
  '}'
].join('\n')

export default {
  uniforms: {},
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader
}
