uniform vec3 colorA;
uniform vec3 colorB;
varying vec3 vUv;
uniform sampler2D image;
varying float v_noise;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_velocity;
uniform float u_selection;

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

void main() {

  float noise_mag = abs(pow((v_noise ) / 20., 7.) * 1.) + 200.;

  float n = (nestedNoise(vUv.xy / 120.)) * u_selection;

  vec4 image_color = texture2D( image, (gl_FragCoord.xy + vec2( vUv.x, 0. ) + (n * noise_mag)) / u_resolution);



  gl_FragColor = image_color;
}
