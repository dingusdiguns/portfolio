import React from "react";
import WordCanvas from "../../util/wordCanvas";
import ProjectObject from "../../util/projectObject"

const Projects = require( "../../data/projects" )
const THREE = require("three");
const GLUtil = require( "../../util/glUtil" )
const throttle = require( "../../util/throttle" )

class Home extends React.Component{
  constructor(){
    super();
    this.state = {
      mouse: {
        x: 0,
        y: 0
      }
    }
    this.time = 0;
    this.font = "GT America extended bold"
    this.size = 40;
    this.vel = 0;
    this.mouseVel = 0;
    this.maxVel = 36;
  }

  componentDidMount(){
    if( document.fonts.check( `${ this.size }vh ${this.font}` ) ){
      this.fontsLoaded();
    }
    document.fonts.ready.then(function () {
      this.fontsLoaded();
    }.bind( this ));
  }

  fontsLoaded(){
    let values = Object.values( Projects );
    let words = [];
    values.forEach(
      ( value, index ) => {
        let wordCanvas = new WordCanvas( value.title, this.size, this.font );
        words.push( wordCanvas );
      }
    );
    words[0].largestWidth( words );
    this.words = words
    this.generateScene()
    this.generatePointTextures();
    this.generatePoints();
    this.createRenderTarget();
    this.createSpheres();

    this.timelinePos = 0;

    document.body.onscroll = throttle(
      this.scroll.bind( this ),
      40
    )
  }

  scroll( e ){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    this.scrollStart = scrollTop;
    window.setTimeout(
      this.scrollInterval.bind( this ),
      100
    );
  }

  scrollInterval(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var diff = (scrollTop - this.scrollStart) / .5;
    if( Math.abs( this.vel ) < Math.abs( diff ) ){
      // this.vel -= diff;
      if( Math.abs(this.vel) > this.maxVel ){
      }
    }
  }

  createSpheres(){

    let mesh = new THREE.Mesh();

    Object.values( Projects ).forEach(
      ( project, index ) => {
        let po = new ProjectObject( project, index, mesh );
      }
    )
    this.scene.add( mesh )
    this.timeline = mesh;
    this.animate()
  }

  createRenderTarget(){
    let array = [];
    this.words[0].points.forEach(
      ( point, index ) => {
        array = array.concat(
          GLUtil.packFloatToVec4i( Math.random() ),
          GLUtil.packFloatToVec4i( Math.random() ),
          GLUtil.packFloatToVec4i( .5 + ( Math.random() * .003 - .0015 ) ),
          GLUtil.packFloatToVec4i( .5 + ( Math.random() * .003 - .0015 ) )
        );
      }
    )
    let w = GLUtil.getNearestSquare( array.length / 4 );
    while( array.length < (w * w * 4) ){
      array = array.concat([1,0,0,1])
    }
    var dataTex = new THREE.DataTexture(new Float32Array(array), w, w, THREE.RGBAFormat, THREE.FloatType );
    dataTex.minFilter = THREE.NearestFilter;
    dataTex.magFilter = THREE.NearestFilter;
    dataTex.needsUpdate = true;

    this.dataTex = dataTex;
    let fboVert = require("../../shaders/fboShader/vertex.glsl");
    let fboFrag = require("../../shaders/fboShader/fragment.glsl");


    var simMaterial = new THREE.RawShaderMaterial({
      uniforms: {
        dataTex: { type: 't', value: dataTex },
        u_resolution: { type: "vec2", value: [ w, w ] },
        u_step: { type: "f", value: 4 },
        time: { type: "f", value: 0 },
        word_target: { type: "t", value: this.words[0].positionTexture },
        target_resolution: { type: "vec2", value: [
          this.words[0].positionTexture.image.width * 1,
          this.words[0].positionTexture.image.height * 1
        ]},
        canvas_resolution: { type: "vec2", value: [
          this.words[0].canvas.width,
          this.words[0].canvas.height
        ]},
        mouse: {
          type: "v2",
          value: new THREE.Vector2(0,0)
        },
        mouseVel: {
          type: "f",
          value: 0
        },
        screen_resolution: { type: "vec2", value: [
          window.innerWidth,
          window.innerHeight
        ]},
      },
      vertexShader: fboVert.default,
      fragmentShader: fboFrag.default,
    });



    THREE.FBO = function(w, simMat) {
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-w/2, w/2, w/2, -w/2, -1, 1);
      this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(w, w), simMat));
    };

    var fbo = new THREE.FBO(w, simMaterial);
    this.simMaterial = simMaterial;
    delete this.dataTex;
    simMaterial.needsUpdate = true;
    var renderTargetA = new THREE.WebGLRenderTarget(w, w, {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
    });

    var renderTargetB = renderTargetA.clone();

    this.renderer.setRenderTarget( renderTargetA );
    this.renderer.render(fbo.scene, fbo.camera);
    this.renderer.setRenderTarget( renderTargetB );
    this.renderer.render(fbo.scene, fbo.camera);
    this.renderer.setRenderTarget( null );
    this.fbo = fbo;
    // this.renderer.render(fbo.scene, fbo.camera);
    this.renderTargetA = renderTargetA;
    this.renderTargetB = renderTargetB;

    this.points.material.uniforms.target = {
      type: "t",
      value: renderTargetA.texture
    };


    this.points.material.uniforms.target_resolution = {
      type: "vec2",
      value: [
        renderTargetA.texture.image.width,
        renderTargetA.texture.image.height
       ]
    }
    // this.renderTargetA.texture.needsUpdate = true;
  }

  generateScene(){
    this.renderer = new THREE.WebGLRenderer({ canvas: this.refs.canvas, antialias: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 3000 );
    this.scene = new THREE.Scene();
    this.renderer.setClearColor("white");
    this.renderer.render( this.scene, this.camera );
    let geo = new THREE.BoxGeometry( 100, 100, 100 );
    let mat = new THREE.MeshBasicMaterial({ color: "red" });
    let mesh = new THREE.Mesh( geo, mat );
    mesh.position.set( 0, 0, -1000 );
    // this.scene.add( mesh );
  }

  generatePointTextures(){
    let maxPix = 0;
    this.words.forEach(
      ( word, index ) => {
        let canvas = document.createElement( "canvas" );
        let ctx = canvas.getContext( "2d" );
        canvas.width = word.canvas.width;
        canvas.height = word.canvas.height;

        let pixNum = 0;
        let data = [];
        for( var x = 0; x < word.canvas.width; x++ ){
          for( var y = 0; y < word.canvas.height; y++ ){
            let pix = word.ctx.getImageData( x, y, 1, 1 ).data;
            let value = pix[3];
            if( value > .1 ){
              ctx.fillStyle = "black";
              ctx.fillRect( x, y, 1, 1 );
              pixNum++;
            }
          }
        }
        document.body.appendChild( canvas )
        maxPix = pixNum > maxPix ? pixNum : maxPix;
      }
    );

    this.words.forEach(
      ( word, index ) => {
        word.generatePoints( maxPix );
      }
    );
    let highestTextureLength = 0;
    this.words.forEach(
      ( word, index ) => {
        highestTextureLength = word.textureData.length > highestTextureLength ? word.textureData.length : highestTextureLength;
      }
    );
    this.words.forEach(
      ( word, index ) => {
        word.generateTexture( highestTextureLength / 4 );
      }
    );
  }

  generatePoints(){
    var geometry = new THREE.BufferGeometry();
    let word = this.words[0];
    let points = word.points;
    let positions = [];
    let indices = [];
    points.forEach(
      ( point, index ) => {
        positions.push( point.x, point.y, 0);
        indices.push( index );
      }
    );
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      'index',
      new THREE.Float32BufferAttribute(indices, 1)
    );

    let fragment = require( "../../shaders/point/fragment.glsl" ).default;
    let vertex = require( "../../shaders/point/vertex.glsl" ).default;

    var material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            time: { type: 'f', value: 0 },
            mouse: { type: "v2", value: new THREE.Vector2(0,0)  },
            u_step: { type: "f", value: 4 },
            target: { type: "t", value: null },
            target_image: { type: "t", value: null },
            target_positions: { type: "t", value: null },
            resolution: { type: "v2", value: new THREE.Vector2(
              this.refs.canvas.offsetWidth,
              this.refs.canvas.offsetHeight
            )}
        }
    })

    this.geometry = geometry;
    const p_m = new THREE.PointsMaterial( { color: "black" } );
    this.points = new THREE.Points( geometry, material );
    this.points.position.set( 0, 0, -800 );
    this.scene.add( this.points );

    // this.animate()

  }




  mouseMove( e ){
    let x = ((e.clientX / e.target.offsetWidth) - .5) * 2;
    let y = ((e.clientY / e.target.offsetHeight) - .5) * 2;
    let diff = Math.sqrt(
      Math.pow( x - this.state.mouse.x, 2. ) +
      Math.pow( y - this.state.mouse.y, 2. )
      ) * 4;
      diff = diff > this.mouseVel ? diff : this.mouseVel;
      this.mouseVel = diff
      this.setState({
        mouse: {
          x: x,
          y: y
        }
      })
  }
  animate(){
    this.time++;


    if( this.mouseVel > .001 ){
      this.mouseVel -= this.mouseVel / 300;
      console.log( this.mouseVel )
    }

    if( this.mouseVel < -.001 ){
      this.mouseVel += this.mouseVel / 300;
    }


    this.timelinePos += this.vel;

    if( this.vel > 2. ){
      this.vel -= 1.;
    }else if( this.vel > 0 ){
      this.vel = 0
    }

    if( this.vel < -2. ){
      this.vel += 1.;
    }else if( this.vel < 0 ){
      this.vel = 0
    }

    this.timeline.position.set( this.timelinePos, 0, 0 );



    var oldA = this.renderTargetA;
    this.renderTargetA = this.renderTargetB;
    this.renderTargetB = oldA;

    this.simMaterial.uniforms.dataTex.value = this.renderTargetA.texture

    this.simMaterial.needsUpdate = true;

    this.simMaterial.uniforms.time.value = this.time;
    this.points.material.uniforms.mouse.value = new THREE.Vector2(
      this.state.mouse.x,
      this.state.mouse.y
    );

    if(this.simMaterial){
      this.simMaterial.uniforms.mouse.value = new THREE.Vector2(
        (this.state.mouse.x + 1) / 2,
        (this.state.mouse.y + 1) / 2
      );

      console.log( this.mouseVel )
      this.mouseVel = this.mouseVel > .8 ? .8 : this.mouseVel;
      this.simMaterial.uniforms.mouseVel.value = this.mouseVel;



      let target = this.words[ 0 ].positionTexture;
      let texture = this.words[ 0 ].texture;
      if( target !== this.simMaterial.uniforms.word_target.value ){
        this.simMaterial.uniforms.word_target.value = target;
      }
      if( this.points.material.uniforms.target_positions.value !== target  ){
        this.points.material.uniforms.target_positions.value = target;
        this.points.material.uniforms.target_image.value = texture;
      }
      if( texture !== this.points.material.uniforms.target_image.value ){
        this.points.material.uniforms.target_image.value = texture;
      }
    }

    // var oldA = this.renderTargetA;
    // this.renderTargetA = this.renderTargetB;
    // this.renderTargetB = oldA;
    this.renderer.setRenderTarget( this.renderTargetB );
    this.renderer.render(this.fbo.scene, this.fbo.camera);
    this.renderer.setRenderTarget( null );
    this.renderer.render(this.fbo.scene, this.fbo.camera);
    // this.renderer.render(this.fbo.scene, this.fbo.camera);

    this.points.material.uniforms.target.value = this.renderTargetB.texture;
    this.renderer.render(
      this.scene,
      this.camera
    );



    this.points.material.uniforms.time.value = this.time
    this.points.material.uniforms.target.value = this.renderTargetA.texture;
    if( this.time < 800 ){
      window.requestAnimationFrame( this.animate.bind( this ) );
    }
  }


  render(){
    return(
      <div className = "homepage">
        <canvas ref = "canvas" onMouseMove = { throttle(this.mouseMove.bind( this ), 100) }/>
        <div className = "texts" >
        oiop
        </div>
      </div>
    )
  }
}

export default Home
