const vertexShader = [
  'uniform vec3  customColor;',
  'uniform float customOpacity;',
  'attribute float customSize;',
  'attribute float customAngle;',
  'attribute float timeOffset;',
  'varying vec4  vColor;',
  'varying float vAngle;',

  'uniform float timeLife;',
  'uniform float t;',
  'uniform float speed;',
  'highp float rand(vec2 co)',
  '{',
  'highp float a = 12.9898;',
  'highp float b = 78.233;',
  'highp float c = 43758.5453;',
  'highp float dt= dot(co.xy ,vec2(a,b));',
  'highp float sn= mod(dt,3.14);',
  'return fract(sin(sn) * c);',
  '}',
  'void main()',
  '{',
  'vAngle = customAngle;',
  'vec3 p = position;',
  'float r;',
  'float heightCorrection = timeLife*speed/7.5;',
  'float widthCorrection = timeLife*speed/25.0;',

  //Calcola la posizione al tempo t
  'if(t-timeOffset > 0.0){',
  'p.y += (mod(t-timeOffset,timeLife))*speed;',
  'r = 3.121378*exp(-pow((((p.y - position.y)/heightCorrection)- 2.890766),2.0)/(2.0*pow(1.363839,2.0)));', // calcolata con fitting su gaussiana
  'r = r*widthCorrection;',
  'r -= rand(vec2(t,vAngle))*0.9*r;',
  //vAngle += rand(vec2(t,r))*0.9*vAngle; // randomicità nell'angolo, l'effetto non si vede molto
  'p.x += cos(vAngle)*r;',
  'p.z += sin(vAngle)*r;',
  '}',

  // Cambia opacità in funzione dell'altezza
  'float frac_opacity = customOpacity / timeLife;',
  'float opacity = customOpacity - (mod(t-timeOffset,timeLife))*frac_opacity;',

  'vColor = vec4( customColor, opacity );',

  'vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );',
  'gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );',
  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n')

const fragmentShader = [
  'uniform sampler2D texture;',
  'varying vec4 vColor;',
  'varying float vAngle;',

  'void main()',
  '{',
  '	gl_FragColor = vColor;',
  'float c = cos(vAngle);',
  'float s = sin(vAngle);',
  'vec2 circCoord = 2.0 * gl_PointCoord - 1.0;',
  'if (dot(circCoord, circCoord) > 1.0) {',
  'discard;',
  '}',
  'vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,',
  'c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);',
  'vec4 rotatedTexture = texture2D( texture,  rotatedUV );',
  'if(rotatedTexture.a < 0.3){',
  'discard;',
  '}',
  'gl_FragColor = gl_FragColor * rotatedTexture;',
  '}'
].join('\n')

export default {
  uniforms: {},
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}
