const vertexShader = [
  'uniform float u_t;',
  'attribute float customAngle;',
  'attribute float timeOffset;',
  'varying float vAngle;',
  'varying vec4 vColor;',
  'void main()',
  '{',
  'vAngle = customAngle;',
  'vec3 p = position;',
  'float r = 3.5;',
  'float customOpacity = 1.0;',
  'float timeLife = 2.7;',

  //'if(u_t-timeOffset > 0.2){',
  'p.y += (mod(u_t-timeOffset,timeLife))*25.0;',
  'p.x += cos(vAngle)*r;',
  'p.z += sin(vAngle)*r;',
  //'}',

  'float frac_opacity = customOpacity / timeLife;',
  'float opacity = customOpacity - (mod(u_t-timeOffset, timeLife))*frac_opacity;',

  'vColor = vec4( 1.0, 1.0, 0.0, opacity );',

  'vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );',
  'gl_PointSize = 20.0 * ( 300.0 / length( mvPosition.xyz ) );',
  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n')

const fragmentShader = [
  'uniform sampler2D texture;',
  'varying vec4 vColor;',
  'varying float vAngle;',
  'void main()',
  '{',
  'gl_FragColor = vColor;',
  'float c = cos(vAngle);',
  'float s = sin(vAngle);',
  'vec2 circCoord = 2.0 * gl_PointCoord - 1.0;',
  'if (dot(circCoord, circCoord) > 1.0) {',
  'discard;',
  '}',
  'vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,',
  'c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);',
  'vec4 rotatedTexture = texture2D( texture,  rotatedUV );',
  'if(rotatedTexture.r < 0.5){',
  'gl_FragColor = gl_FragColor * vec4(1.0,0.0,0.0,0.5);',
  '}else{',
  'gl_FragColor = gl_FragColor * rotatedTexture;',
  '}',
  '}'
].join('\n')

export default {
  uniforms: {},
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}
