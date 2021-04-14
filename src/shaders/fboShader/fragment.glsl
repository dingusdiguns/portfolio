precision mediump float;
uniform float u_step;
uniform float time;

varying vec2 vUv;
uniform vec2 u_resolution;
uniform vec2 target_resolution;
uniform vec2 canvas_resolution;
uniform vec2 screen_resolution;
uniform vec2 mouse;
uniform float mouseVel;
uniform sampler2D dataTex;
uniform sampler2D word_target;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float permute(float x) { return mod289(((x*34.0)+1.0)*x); }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec2 permute(vec2 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec4 when_eq(vec4 x, vec4 y) {
  return 1.0 - abs(sign(x - y));
}

vec4 when_neq(vec4 x, vec4 y) {
  return abs(sign(x - y));
}

vec4 when_gt(vec4 x, vec4 y) {
  return max(sign(x - y), 0.0);
}

vec4 when_lt(vec4 x, vec4 y) {
  return max(sign(y - x), 0.0);
}

vec4 when_ge(vec4 x, vec4 y) {
  return 1.0 - when_lt(x, y);
}

vec4 when_le(vec4 x, vec4 y) {
  return 1.0 - when_gt(x, y);
}

vec4 and(vec4 a, vec4 b) {
  return a * b;
}

vec4 or(vec4 a, vec4 b) {
  return min(a + b, 1.0);
}

vec4 xor(vec4 a, vec4 b) {
  return mod((a + b), 2.0);
}

vec4 not(vec4 a) {
  return 1.0 - a;
}

float when_eq(float x, float y) {
  return 1.0 - abs(sign(x - y));
}

float when_neq(float x, float y) {
  return abs(sign(x - y));
}

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}

float when_ge(float x, float y) {
  return 1.0 - when_lt(x, y);
}

float when_le(float x, float y) {
  return 1.0 - when_gt(x, y);
}

float and(float a, float b) {
  return a * b;
}

float or(float a, float b) {
  return min(a + b, 1.0);
}

float xor(float a, float b) {
  return mod((a + b), 2.0);
}

float not(float a) {
  return 1.0 - a;
}

float round( float a ){
  return floor(a + 0.5);
}

vec4 EncodeFloatRGBA (float v) {
  vec4 enc = vec4(1.0, 255.0, 65025.0, 160581375.0) * v;
  enc = fract(enc);
  enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);
  return enc;
}

float DecodeFloatRGBA (vec4 rgba) {
  return dot( rgba, vec4(1.0, 1./255.0, 1./65025.0, 1./160581375.0) );
}

vec2 getPointDataTexCoord( float base, float offset, vec2 res ){
  float x = mod( base + offset, res.x);
  float y = floor((base + offset) / res.x);
  return vec2( x / res.x, y / res.y );
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main(){

  vec2 st = vUv.xy;
  vec2 unit = 1. / u_resolution;
  vec2 position = vUv * u_resolution;
  float index = floor( floor(position.x) + (floor(position.y ) * u_resolution.x)  );
  float _base = floor( index / u_step ) * u_step;
  float _mod = mod(round(index), u_step);

  float targ_x = (DecodeFloatRGBA(texture2D( word_target, getPointDataTexCoord( (_base / u_step) * 2., 0., target_resolution ) )) / 1.5) + .125;
  float targ_y = (DecodeFloatRGBA(texture2D( word_target, getPointDataTexCoord( (_base / u_step) * 2., 1., target_resolution ) )) / 1.5) + .125;


  float _x = DecodeFloatRGBA(texture2D( dataTex, getPointDataTexCoord( _base, 0., u_resolution ) ));
  float _y = DecodeFloatRGBA(texture2D( dataTex, getPointDataTexCoord( _base, 1., u_resolution ) ));
  float _velocity_x = (DecodeFloatRGBA(texture2D( dataTex, getPointDataTexCoord( _base, 2., u_resolution ) )) - .5) * 2.;
  float _velocity_y = (DecodeFloatRGBA(texture2D( dataTex, getPointDataTexCoord( _base, 3., u_resolution ) )) - .5) * 2.;


  vec2 _t_pos = .5 + (vec2( targ_x, targ_y ) * (((canvas_resolution * 4.) / 2.) / screen_resolution) - ( canvas_resolution * 1. / screen_resolution ));
  vec2 _pos = vec2( _x, _y );
  float shieldDist = .04 + (pow(mouseVel, 2.) / 2.);
  float mouseAngle =
  atan(
    _x - mouse.x,
    _y - mouse.y
  );

  float mouse_dist = distance( _pos, mouse );
  _t_pos -= _t_pos * (when_lt( mouse_dist,  shieldDist ));
  _t_pos +=
  vec2(
    mouse.x + ( shieldDist * sin(mouseAngle)),
    mouse.y + ( shieldDist * cos( mouseAngle )) )
  * when_lt( mouse_dist,  shieldDist );


  vec2 _vel = vec2( _velocity_x, _velocity_y );
  float max_vel = .02;
  float acc = .005;
  float max_dist = .05;
  vec4 _out = vec4(0.);


  vec2 dist = vec2( abs(_t_pos.x - _x), abs( _t_pos.y - _y ) );
  float dir_x = normalize(_t_pos.x - _x);
  float dir_y = normalize(_t_pos.y - _y);
  vec2 dir = vec2( dir_x, dir_y );

  float angle = atan( dir_x, dir_y );

  _velocity_x +=
  (dir_x * (abs(sin(angle)) * acc) * unit.x)
  * when_gt( abs(_t_pos.x - _x), .06 )
  + (snoise( vec2( _y * 8., time / 500.  ) ) * .0001 * unit.x);

  float _velocity_inside_x = map(
    abs(_t_pos.x - _x),
    0.,
    max_dist,
    0.,
    max_vel
  );

  _velocity_x -= _velocity_x * when_lt( abs(_t_pos.x - _x), max_dist );
  _velocity_x +=
    abs(_velocity_inside_x) * dir.x * unit.x * 30.
    * when_lt( abs(_t_pos.x - _x), max_dist )
    ;
  _velocity_x = clamp( _velocity_x, -max_vel, max_vel );
  _velocity_x -= _velocity_x * when_lt( abs( _x - _t_pos.x ), unit.x * .1 );
  _x -= (_x - _t_pos.x) * when_lt( abs( _x - _t_pos.x ), unit.x * .1 );

  _velocity_y +=
  (dir_y * (abs(cos(angle)) * acc) * unit.y)
  * when_gt(  abs(_t_pos.y - _y), max_dist )
  + (snoise( vec2( _x * 8., time / 500.  ) ) * .0001 * unit.y)
  ;

  float _velocity_inside_y = map(
    abs(_t_pos.y - _y),
    0.,
    max_dist,
    0.,
    max_vel
  );
  _velocity_y -= _velocity_y * when_lt( abs(_t_pos.y - _y), max_dist );
  _velocity_y += abs(_velocity_inside_y) * dir.y * unit.y * 30. * when_lt( abs(_t_pos.y - _y), max_dist );
  _velocity_y = clamp( _velocity_y, -max_vel, max_vel );
  _velocity_y -= _velocity_y * when_lt( abs( _y - _t_pos.y ), unit.y * .1 );
  _y -= (_y - _t_pos.y) * when_lt( abs( _y - _t_pos.y ), unit.y * .1 );
  // _x += (( -_x  ) + ( _t_pos.x )) * when_lt( abs(_velocity_x), .01 );
  // _velocity_y += _velocity_inside_x * when_lt( abs(_t_pos.y - _y), .02 );
  // _velocity_y -= (dir_y * .05) * when_lt( .2, abs(_t_pos.y - _y) );
  // _velocity_x = _velocity_x + dir_x;
  // _velocity_y = _velocity_y + dir_y;

  _x += _velocity_x;
  _y += _velocity_y;


  // if( time == 0. ){
  //   _out += EncodeFloatRGBA( _x ) * vec4( when_eq( _mod, 0. ) );
  //   _out += EncodeFloatRGBA( _y ) * vec4( when_eq( _mod, 1. ) );
  //   gl_FragColor = _out;
  // }else{
  //   gl_FragColor = texture2D( word_target, vUv ) + .01;
  // }

  _out += EncodeFloatRGBA( _x ) * vec4( when_eq( _mod, 0. ) );
  _out += EncodeFloatRGBA( _y ) * vec4( when_eq( _mod, 1. ) );
  _out += EncodeFloatRGBA((_velocity_x / 2.) + .5) * vec4( when_eq( _mod, 2. ) );
  _out += EncodeFloatRGBA((_velocity_y / 2.) + .5) * vec4( when_eq( _mod, 3. ) );
  gl_FragColor = _out;

  // _out += vec4(1.,0.,0.,1.) * vec4( when_eq( _mod, 3. ) );
  // _out += vec4(0.,0.,1.,1.) * vec4( when_eq( _mod, 2. ) );


  // gl_FragColor = vec4( vUv.x, vUv.y, index / (u_resolution.x * u_resolution.y), 1. );
  // gl_FragColor = texture2D( dataTex, st.xy );
  // gl_FragColor = texture2D( word_target, st.xy );

  // gl_FragColor = EncodeFloatRGBA(_x);

}
