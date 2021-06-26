import React from "react";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Timer from "../../util/timer"


const THREE = require("three");

class About extends React.Component{
  constructor(){
    super();
    this.state = {
      className: "about-text"
    }
    this.backgroundColor = new THREE.Color("rgb( 15, 15, 15 )");
    this.defaultColor = new THREE.Color("rgb( 15, 15, 15 )");
    this.mouse = new THREE.Vector2();
    this.mouseThree = new THREE.Vector3();
    this.font = "GT America Extended Regular";
    this.aboutText = `Oscar Robert is a creative technologist with a degree in Graphic Design from the Rhode Island School of Design. He enjoys exploring motion on the web as well as experimenting with and blending new technologies. He does not enjoy writing in the third person but completely understands why it is aboslutely and entirely necessary. His mom would describe him as medium.`
    this.startTime = new Date().getTime();
  }

  componentDidMount(){
    // this.setupTHREE()
    this.setupText()

    window.scrollTo( 0, 0 );

  }

  setupText(){
    let splitted = this.aboutText.split( " " );
    for( var i = 0; i < splitted.length; i++ ){
      let word = splitted[i];
      let span = document.createElement( "span" );
      span.innerText = word + " ";
      span.style.transitionDelay = i * .01 + "s";
      this.refs.text.appendChild(span);
    }

    window.setTimeout(
      () => {
        this.setState({ className: "about-text active" })
      },
      100
    );
  }

  setupTHREE(){
    let renderer = new THREE.WebGLRenderer({ canvas: this.refs.canvas, antialias: true });
    const composer = new EffectComposer( renderer );
    renderer.setClearColor( this.backgroundColor );
    // renderer.setPixelRatio( window.devicePixelRatio )
    // composer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, this.refs.canvas.offsetHeight );
    composer.setSize(window.innerWidth, this.refs.canvas.offsetHeight);
    this.three = {
      scene: new THREE.Scene(),
      camera: new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2 ),
      renderer: renderer,
      composer: composer,
      raycaster: new THREE.Raycaster(),
      targetBackgroundColor: this.backgroundColor.clone(),
      initialBackgroundColor: this.backgroundColor.clone(),
      initialBackgroundColor: this.backgroundColor.clone(),
      backgroundTimer: new Timer({ target: 1, duration: 1000, rate: .075 })
    };

    const renderPass = new RenderPass( this.three.scene, this.three.camera );
    composer.addPass( renderPass );
    let vert = require("../../shaders/mouseShader/vertex.glsl").default;
    let frag = require("../../shaders/mouseShader/fragment.glsl").default;
    let mouseShader = {
      uniforms: {
        'tDiffuse': { value: null },
        'opacity': { value: 1.0 },
        "u_mouse": { value: [.5,.5] },
        "u_time": { value: 0 },
        "u_selection": { value: 1 }
      },
      fragmentShader: frag,
      vertexShader: vert
    }

    this.mouseShader = mouseShader;
    const mousePass = new ShaderPass( mouseShader );
    this.mousePass = mousePass
    mousePass.renderToScreen = true;
    composer.addPass( mousePass );

    this.loadFont()
  }

  loadFont(){
    // FontDetect.onFontLoaded(
    // this.font,
    // this.setupAbout.bind( this ),
    // () => {},
    // {
    //   msTimeout: 3000
    // });
    // this.setupAbout();
  }

  setupAbout(){
    // var about = document.createElement( "div" );
    // about.innerHTML = this.aboutText;
    // about.className = "about-text"
    // document.body.appendChild( about );

    // let image = htmlToImage.toCanvas( about ).then(
    //   ( c ) => {
    //     let plane = new THREE.PlaneGeometry(c.width, c.height, 40, 40);
    //     let texture = new THREE.Texture( c );
    //     texture.magFilter = THREE.NearestFilter;
    //     texture.minFilter = THREE.LinearMipMapLinearFilter;
    //     texture.needsUpdate = true;
    //     let material = new THREE.MeshBasicMaterial({ color: "white", map: texture });
    //     let mesh = new THREE.Mesh( plane, material );
    //     this.three.scene.add( mesh );
    //     mesh.rotation.set( -Math.PI, 0, 0 );
    //     mesh.scale.set( .4, .4, .4 );
    //     mesh.position.set( 0, 0, -500 );
    //     about.remove()
    //     // document.body.appendChild( c )
    //   }
    // );
    // this.animate();
  }

  animate(){

    this.time = (this.startTime - (new Date().getTime()));

    this.three.composer.render();

    this.mousePass.uniforms.u_mouse.value = [ Math.abs(this.mouse.x), 1 - Math.abs(this.mouse.y) ];
    this.mousePass.uniforms.u_time.value = this.time;

    // this.three.renderer.setClearColor( "white" );
    window.requestAnimationFrame( this.animate.bind( this ) );
  }

  mouseMove( e ){
    this.mouse.x = ( e.clientX / window.innerWidth );
    this.mouse.y = - ( e.clientY / window.innerHeight );

    this.mouseThree.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouseThree.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.mouseThree.z = -1
  }

  render(){
    return(
      <div className = "about" onMouseMove = { this.mouseMove.bind( this ) }>
        <div className = "wrap">
          <div className = { this.state.className }>
            <h3  ref = "text"></h3>
            <div className = "contact">
              <h4>
                <a href = "mailto:oscarhenrirobert@gmail.com">oscarhenrirobert@gmail.com</a>
              </h4>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default About;
