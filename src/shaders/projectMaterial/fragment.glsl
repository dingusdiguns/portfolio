uniform vec3 colorA;
uniform vec3 colorB;
varying vec3 vUv;
uniform sampler2D image;
varying float v_noise;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_velocity;
uniform float u_selection;
uniform float opacity;
uniform float hover_sat;
uniform float saturation;

float random(float x) {

    return fract(sin(x) * 10000.);

}

float noise(vec2 p) {

return random(p.x + p.y * 10000.);

}

vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }

float smoothNoise(vec2 p) {

vec2 interp = smoothstep(0., 1., fract(p));
float s = mix(noise(sw(p)), noise(se(p)), interp.x);
float n = mix(noise(nw(p)), noise(ne(p)), interp.x);
return mix(s, n, interp.y);

}

float fractalNoise(vec2 p) {

float x = 0.;
x += smoothNoise(p      );
x += smoothNoise(p * 2. ) / 2.;
x += smoothNoise(p * 4. ) / 4.;
x += smoothNoise(p * 8. ) / 8.;
x /= 1. + 1./2. + 1./4. + 1./8.;
return x;

}

float movingNoise(vec2 p) {

float x = fractalNoise(p + (u_time / 4000.));
float y = fractalNoise(p - (u_time / 4000.));
return fractalNoise(p + vec2(x, y));

}

// call this for water noise function
float nestedNoise(vec2 p) {

float x = movingNoise(p);
float y = movingNoise(p + 100.);
return movingNoise(p + vec2(x, y));

}

vec3 rgb2hsv(vec3 rgb) {
  float Cmax = max(rgb.r, max(rgb.g, rgb.b));
  float Cmin = min(rgb.r, min(rgb.g, rgb.b));
  float delta = Cmax - Cmin;

  vec3 hsv = vec3(0., 0., Cmax);

  if (Cmax > Cmin) {
    hsv.y = delta / Cmax;

    if (rgb.r == Cmax)
      hsv.x = (rgb.g - rgb.b) / delta;
    else {
      if (rgb.g == Cmax)
        hsv.x = 2. + (rgb.b - rgb.r) / delta;
      else
        hsv.x = 4. + (rgb.r - rgb.g) / delta;
    }
    hsv.x = fract(hsv.x / 6.);
  }
  return hsv;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {

  float noise_mag = abs(pow((v_noise ) / 20., 7.) * 1.) + 200.;

  float n = (nestedNoise(vUv.xy / 120.)) * u_selection;

  vec4 image_color = texture2D( image, (gl_FragCoord.xy + vec2( vUv.x, 0. ) + (n * noise_mag)) / u_resolution);
  vec3 image_hsv = rgb2hsv( image_color.xyz );
  vec3 desaturated = hsv2rgb( vec3( image_hsv[0], image_hsv[1] * 0., image_hsv[2] * .2 ) );
  float _sat = clamp( ((hover_sat) * .6) + saturation, 0., 1. );
  desaturated = mix( desaturated, image_color.rgb, _sat );

  gl_FragColor = vec4( desaturated.xyz, image_color[3] * opacity );
}
