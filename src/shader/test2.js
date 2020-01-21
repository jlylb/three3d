const particleVertexShader = [
  'varying vec3 vPos;',
  'uniform float time;',
  'attribute float randam;',
  'varying float vSprite;',
  'attribute float sprite;',
  'varying float vOpacity;',
  'uniform float size;',
  'uniform float heightOfNearPlane;',

  'float PI = 3.14;',
  'float quadraticIn( float t ) {',
  'float tt = t * t;',
  'return tt * tt;',
  '}',
  'void main()',
  '{',
  'vPos = normalize(vec3(position.xyz));',
  'float progress = fract( time + ( 2.0 * randam - 1.0 ) );',
  'float progressNeg = 1.0 - progress;',
  'float ease = quadraticIn( progress );',
  'float influence = sin( PI * ease );',
  'vec3 newPosition = position * vec3( 1.0, ease, 1.0 );',
  'gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );',
  // 'gl_PointSize = ( heightOfNearPlane * size ) / gl_Position.w;',
  'gl_PointSize = size * (90.0 * (abs(sin(time))/128.0+0.12));',
  'vOpacity = min( influence * 4.0, 1.0 ) * progressNeg;',
  // 'vOpacity = ((sin(time)+1.0)/2.0);',
  'vSprite = sprite;',
  '}'
].join('\n')

const particleFragmentShader = [
  'uniform sampler2D texture;',
  'varying float vSprite;',
  'varying float vOpacity;',
  'uniform vec3 color;',
  'varying vec3 vPos;',
  'void main()',
  '{',
  'vec2 texCoord = vec2(',
  'gl_PointCoord.x * ' + 1 / 4 + ' + vSprite,',
  'gl_PointCoord.y',
  ');',
  'vec4 color3 = vec4(0.0,1.0,0.0, 0.5);',
  'vec4 color4 = vec4(vPos.xyz, 1.0);',
  'vec3 color2 = vec3(0.0,1.0,0.3);',
  'gl_FragColor = vec4( texture2D( texture, vec2( texCoord ) ).xyz * color * vOpacity, 1.0 );',
  '}'
].join('\n')

export default {
  uniforms: {},
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader
}
