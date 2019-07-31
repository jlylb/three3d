const particleVertexShader = [
  'void main()',
  '{',
  'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',

  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n')

const particleFragmentShader = [
  'void main()',
  '{',
  'gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );',
  '}'
].join('\n')

export default {
  uniforms: {},
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader
}
