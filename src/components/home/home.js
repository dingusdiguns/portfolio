import React from "react";
import Timer from "../../util/timer"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import Word from "../../models/word"

const Projects = require( "../../data/projects" )
const Easing = require( "../../util/easing" );
const throttle = require( "../../util/throttle" );

const THREE = require("three");



class Home extends React.Component{
  constructor(){
    super();
    this.state = {
      canvasPos: "top"
    };
    this.positionInterval = (window.innerWidth / 10) * 5;
    this.backgroundColor = "rgb( 235, 235, 230 )"
    this.mouse = new THREE.Vector2();
    this.zoomTimer = new Timer( { target: 1, rate: .07 } );
    this.snapTimer = new Timer( { target: 1, rate: .025 } );
    this.selectionTimer = new Timer( {
      target: 1,
      rate: .03,
      delay: 1.5,
      callback: () => {
        this.gotoProject = true;
      }
    });
    this.projectTimer = new Timer({ target: 1, rate: .05 });
    this.scrollVel = 0;
    this.startTime = new Date().getTime();
    this.time = 0
    this.scrollFriction = 4;
    this.maxScrollVel = 80;
    this.selectedIndex = 0;
    this.meshs = [];
    this.words = [];
  }

  componentDidMount(){
    let renderer = new THREE.WebGLRenderer({ canvas: this.refs.canvas, antialias: true });
    const composer = new EffectComposer( renderer );
    renderer.setClearColor( this.backgroundColor )
    // renderer.setPixelRatio( window.devicePixelRatio )
    // composer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, this.refs.canvas.offsetHeight );
    composer.setSize(window.innerWidth, this.refs.canvas.offsetHeight);
    this.three = {
      scene: new THREE.Scene(),
      camera: new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2 ),
      renderer: renderer,
      composer: composer,
      raycaster: new THREE.Raycaster()
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

    this.timeline = new THREE.Mesh();
    this.three.scene.add( this.timeline );

    let projects = Object.values( Projects );
    projects.forEach(
      ( project, index ) => {
        let div = document.createElement( "div" );
        div.className = "project-title hidden";
        for( var i = 0; i < project.title.length; i++ ){
          let char = project.title[i];
          let span = document.createElement( "span" );
          span.style = `transition-delay: ${i / 20}s`;
          span.style = `animation-delay: ${i / 20}s`;
          div.appendChild( span );
          span.innerText = char;
        }
        this.words.push( div )
        this.refs["project-titles"].appendChild(div);
      }
    );

    window.addEventListener( "scroll", throttle( this.scrollStart.bind( this ), 80 ) );

    this.setupProjects()

  }

  scrollStart(){
    if( !this.locked ){
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      this.scrollStart = scrollTop;
      this.snapPosition = undefined;
      this.snapTarget = undefined;
      if( this.snapTimeout ){
        window.clearTimeout( this.snapTimeout );
      }
      window.setTimeout(
        this.scroll.bind( this ),
        20
      );
    }
  }

  scroll(){
    if( !this.locked ){
      this.scrolling = true;
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      var scrollDiff = this.scrollStart - scrollTop;
      var vel = (scrollDiff / .2)
      if( this.snapTimeout ){
        window.clearTimeout( this.snapTimeout );
      }
      if( scrollTop > this.refs.projects.offsetTop ){
        if( Math.abs( vel ) > Math.abs( this.scrollVel ) ){
          this.scrollVel = vel;
        }
        if( this.state.canvasPos === "top" || this.state.canvasPos === "bottom" ){
          this.setState({ canvasPos: "middle" })
        }
      }
      this.locked = true;
      if( this.selectedIndex !== 0 && this.selectedIndex !== Object.keys( Projects ).length -  1 ){
        if( this.state.canvasPos === "top" || this.state.canvasPos === "bottom" ){
          this.setState({ canvasPos: "middle" })
        }
        window.scrollTo( 0, this.refs.projects.offsetHeight / 2 )
      }else if( this.selectedIndex === 0 ){
        if( this.state.canvasPos !== "top" ){
          this.setState({ canvasPos: "top" })
          // window.scrollTo( 0, this.refs.projects.offsetTop )
          window.scrollTo( 0, this.refs.projects.offsetHeight / 2 )
        }
      }else if( this.state.selectedIndex === Object.keys( Projects ).length -  1 ){
        if( this.state.canvasPos !== "bottom" ){
          this.setState({ canvasPos: "bottom" })
          // window.scrollTo( 0, (this.refs.projects.offsetTop + this.refs.projects.offsetHeight) - window.innerHeight )
          window.scrollTo( 0, this.refs.projects.offsetHeight / 2 )
        }
      }
      this.locked = false;
    }




  }

  snap( callback ){
    this.scrollVel = 0;
    this.snapTarget = this.getNearest();
    this.snapTimer.reset();
    if( callback ){
      this.snapTimer.changeCallback( callback )
    }
    this.snapPosition = this.timeline.position.x
  }

  getNearest(){
    let position = this.timeline.position.x;
    let remainder = Math.round((position % this.positionInterval) / this.positionInterval);
    let base = Math.ceil(position / this.positionInterval) * this.positionInterval;
    return(
      base +
      (remainder * this.positionInterval)
    )
  }

  calculateTimelinePosition(){
    let position = this.timeline.position;
    if( !this.snapPosition ){
      let newPosition = position.x + this.scrollVel;
      if( newPosition < 0 && newPosition >  (Object.keys( Projects ).length - 1) * this.positionInterval * -1){
        this.timeline.position.set(
          position.x + this.scrollVel,
          position.y,
          position.z
        );
      }
    }else{
      let snapDiff = this.snapTarget - this.snapPosition;
      let newPosition = this.snapPosition + (snapDiff * Easing.easeInOutQuart( this.snapTimer.getValue() ));
      this.timeline.position.set(
        newPosition,
        position.y,
        position.z
      );
    }
  }

  scrollEnd(){
    if( this.scrolling ){
      this.scrolling = false;
      this.snapTimeout = window.setTimeout( this.snap.bind( this ), 200 );
    }
  }

  calculateVelocity(){
    if( this.scrollVel > 0 ){
      this.scrollVel -= this.scrollFriction;
    }else if( this.scrollVel < 0 ){
      this.scrollVel += this.scrollFriction;
    }

    if( Math.abs( this.scrollVel ) > this.maxScrollVel ){
      this.scrollVel = Math.sign( this.scrollVel ) * this.maxScrollVel;
    }


    if( Math.abs( this.scrollVel ) < this.scrollFriction ){
      this.scrollEnd()
    }


  }

  setupProjects(){
    let values = Object.values(Projects);
    let imagesLoaded = 0;
    this.scales = [];
    values.forEach(
      ( _project, index ) => {
        let sphere = new THREE.SphereGeometry( 200, 32, 32 );

        let vert = require("../../shaders/projectMaterial/vertex.glsl").default;
        let frag = require("../../shaders/projectMaterial/fragment.glsl").default;

        this.scales.push(
          new Timer( { target: 1, rate: .075 } )
        );

        let uniforms = {
          u_time: { value: 0., type: "f" },
          u_velocity: { value: Math.abs(this.scrollVel), type: "f" },
          u_selection: { value: 1 },
          u_resolution: { value: [
            this.refs.canvas.width,
            this.refs.canvas.height
          ]},
          image: {
            value: new THREE.TextureLoader().load( _project.cover )
          }
        };

        let material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vert,
          fragmentShader: frag
        });

        let mesh = new THREE.Mesh( sphere, material );
        let x = (index * this.positionInterval );
        let offset = ( ((values.length - 1) / 2) * this.positionInterval );
        // x-=offset;
        let image = new Image;
        image.onload = () => {
          imagesLoaded++;
          if( imagesLoaded === values.length ){
            this.animate();
          }
        }




        image.src = _project.cover;
        this.meshs.push( mesh );
        mesh.position.set( x, 0, -500 );
        this.timeline.add( mesh );
      }
    );
  }

  click(){
    this.snapTimer.changeRate( .1 );
    this.snap( () => {
      let projects = Object.values( Projects );
      this.selectedProject = projects[ this.selectedIndex ];
      this.locked = true;
    });
  }

  animate(){
    this.three.raycaster.setFromCamera( this.mouse, this.three.camera );
    const intersects = this.three.raycaster.intersectObjects( this.timeline.children );
    if( intersects.length > 0 ){
      if( this.mouseOver && this.mouseOver != intersects[0].object ){
        this.mouseOver.material.color = new THREE.Color(.47,.47,.47);
      }
      this.mouseOver = intersects[0].object;
      intersects[0].object.material.color = new THREE.Color(1,1,1);
    }else{
      if( this.mouseOver ){
        this.mouseOver.material.color = new THREE.Color(.47,.47,.47);
      }
      this.mouseOver = undefined
    }

    this.mousePass.uniforms.u_mouse.value = [ Math.abs(this.mouse.x), 1 - Math.abs(this.mouse.y) ];
    this.mousePass.uniforms.u_time.value = this.time;
    this.mousePass.uniforms.u_selection.value = (1 - (this.selectionTimer.getValue() * .5));
    this.calculateVelocity()
    this.calculateTimelinePosition()


    if( this.selectedProject ){
      this.zoomTimer.countUp();
    }

    if( this.gotoProject ){
      this.projectTimer++;
    }

    if( this.snapPosition ){
      this.snapTimer.countUp()
    }

    if( this.selectedProject ){
      this.selectionTimer.countUp();
    }

    let values = Object.values(Projects);
    this.meshs.forEach(
      ( mesh, index ) => {
        let x = (index * this.positionInterval );
        let offset = ( ((values.length - 1) / 2) * this.positionInterval );
        x-=offset;
        if( mesh === this.selectedProject ){
          let z = (Easing.easeInOutQuart( this.zoomTimer.getValue() ) * 1) - 200;
        }else{
          let z = (Easing.easeInOutQuart( this.zoomTimer.getValue() ) * 1) - 200;
        }
        let timer = this.scales[ index ];
        let nearest = this.getNearest();
        this.selectedIndex = Math.abs(nearest / this.positionInterval);
        let _v = 1. + (timer.getValue() * 1);
        if( this.selectedIndex === index ){
          _v += Easing.easeInOutQuint(this.selectionTimer.getValue()) * 2.5;
          timer.countUp();
        }else{
          _v -= (this.selectionTimer.getValue() * _v);
          timer.countDown();
        }
        mesh.scale.set( _v, _v, _v );
        mesh.material.uniforms.u_time.value = this.time;
        mesh.material.uniforms.u_selection.value = (1 - this.selectionTimer.getValue());
        mesh.material.uniforms.u_velocity.value = Math.abs(this.scrollVel)
        this.timeline.add( mesh );
      }
    )
    this.words.forEach(
      ( word, index ) => {

        if( !this.selectedProject ){
          if( this.selectedIndex === index ){
            word.classList.remove("hidden");
            if( !word.classList.contains("active") ){
              word.classList.remove( "inactive" );
              word.classList.add("active")
            }
            if( word.classList.contains("inactive") ){
              word.classList.remove("inactive")
            }
          }else{
            if( word.classList.contains("active") ){
              word.classList.add( "inactive" );
              word.classList.remove("active");
            }
            if( !word.classList.contains("inactive")  ){
              word.classList.add("inactive")
              word.classList.remove("active")
            }
          }
        }else{
          word.classList.add("inactive")
        }
      }
    )

    this.time = (this.startTime - (new Date().getTime()));
    this.three.composer.render()
    // this.three.renderer.render( this.three.scene, this.three.camera )
    window.requestAnimationFrame( this.animate.bind( this ) );
  }

  mouseMove( event ){
    this.mouse.x = ( event.clientX / window.innerWidth );
	  this.mouse.y = - ( event.clientY / window.innerHeight );
  }

  getCanvasClassName(){
    return this.state.canvasPos
  }

  getProjectsClassName(){
    let className = `projects ${ this.state.canvasPos }`;
    return className;
  }

  about(){
    // return(
    //   <div className = "about">
    //     <div className = "about-inner">
    //       Oscar is a creative technologist with a degree in Graphic Design from RISD. He hates writing in the third person, but completely understands why&nbsp;it is an absolutely necessity. His&nbsp;mom would describe him as&nbsp;medium.
    //     </div>
    //   </div>
    // )
  }

  render(){
    return(
      <div className = "homepage">
        {
          this.about()
        }
        <div className = "projects" ref = "projects" className = {
          this.getProjectsClassName()
        }>
          <div className = "project-window">
            <canvas ref = "canvas" onClick = { this.click.bind( this ) } onMouseMove = { this.mouseMove.bind( this ) }
            className = {this.getCanvasClassName()}
            >
            </canvas>
            <div ref = "project-titles" className = "project-titles">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
