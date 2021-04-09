uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 target_resolution;
uniform float u_step;
attribute float index;
uniform sampler2D target;
varying float v_index;
varying vec2 image_pos;

vec2 getPointDataTexCoord( float base, float offset, vec2 res ){
  float x = mod( base + offset, res.x);
  float y = floor((base + offset) / res.x);
  return vec2( x / res.x, y / res.y );
}

float DecodeFloatRGBA (vec4 rgba) {
  return dot( rgba, vec4(1.0, 1./255.0, 1./65025.0, 1./160581375.0) );
}

void main(){
    gl_PointSize = 5.;

    float base = index;

    vec2 _y_pos = getPointDataTexCoord( index * 4., 1., target_resolution );
    vec2 _x_pos = getPointDataTexCoord( index * 4., 0., target_resolution );

    v_index = index;

    float _x = (((DecodeFloatRGBA(texture2D( target, _x_pos )) - .5))) * (resolution.x );
    float _y = (DecodeFloatRGBA(texture2D( target, _y_pos )) - .5) * resolution.y;

    image_pos = vec2(
       (_x / resolution.x) + .5,
       (_y / resolution.y) + .5
     );
    // _x = 0.; _y = 0.;
    // vec2 pos = vec2( x, y );
    gl_Position = projectionMatrix * modelViewMatrix *
    vec4(
      vec3( _x, _y, position.z +
        0.
      ) *
      vec3( 1., -1., 1. ),
      1.
    );
    vec2 pos = gl_Position.xy / gl_Position.w;
}
