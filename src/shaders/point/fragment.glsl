uniform vec2 mouse;
uniform float time;
uniform vec2 resolution;
uniform vec2 target_resolution;
uniform float u_step;
uniform sampler2D target;
uniform sampler2D target_image;
uniform sampler2D target_positions;
varying float v_index;
varying vec2 image_pos;
uniform float word_target;

vec2 getPointDataTexCoord( float base, float offset, vec2 resolution ){
  float x = mod( base + offset, resolution.x);
  float y = floor((base + offset) / resolution.x);
  return vec2( x / resolution.x, y / resolution.y );
}

float DecodeFloatRGBA (vec4 rgba) {
  return dot( rgba, vec4(1.0, 1./255.0, 1./65025.0, 1./160581375.0) );
}

void main() {

  float targ_x = DecodeFloatRGBA(texture2D( target_positions, getPointDataTexCoord( (v_index) * 2., 0., target_resolution ) ));
  float targ_y = DecodeFloatRGBA(texture2D( target_positions, getPointDataTexCoord( (v_index) * 2., 1., target_resolution ) ));

  vec4 color = texture2D( target_image, vec2( targ_x, targ_y ) );
  // gl_FragColor = color;
  gl_FragColor = color;
}
