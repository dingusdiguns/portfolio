import React from "react";
import Timer from "../../util/timer"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import ProjectTitle from "./project-title.js"

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
    this.positionInterval = (window.innerWidth / 10) * 2.8;
    this.defaultColor = new THREE.Color("rgb( 15, 15, 15 )");
    this.backgroundColor = new THREE.Color("rgb( 15, 15, 15 )");
    this.mouse = new THREE.Vector2();
    this.mouseThree = new THREE.Vector3();
    this.zoomTimer = new Timer( { target: 1, duration: 1000,rate: .07 } );
    this.snapTimer = new Timer( { name: "snap", target: 1, duration: 800,rate: .025 } );
    this.selectionTimer = new Timer( {
      target: 1,
      duration: 1000,
      rate: .03,
      delay: 1.5,
      callback: () => {
        this.gotoProject = true;
      }
    });
    this.projectTimer = new Timer({ target: 1, duration: 1000,rate: .05 });
    this.scrollVel = 0;
    this.startTime = new Date().getTime();
    this.time = 0
    this.scrollFriction = 2;
    this.maxScrollVel = 80;
    this.selectedIndex = 0;
    this.meshs = [];
    this.words = [];



  }

  mouseDown( e ){
    if( this.timeline ){
      this.mouseDown = true;

      this.snapPosition = undefined;
      let x =  e.clientX;
      let y =  e.clientY;

      this._dragStart = { x: x, y: y, timelinePos: this.timeline.position.x }
      this.mouseDownStartValue = {x: x, y: y};
    }
  }

  mouseMove( e ){
    if( this.mouseDown && this.mouseDownStartValue ){
      let x =  e.clientX;
      let y =  e.clientY;
      if( Math.abs( x - this.mouseDownStartValue.x ) > 10 || Math.abs( y - this.mouseDownStartValue.y ) > 10 ){
        if( !this.dragging ){
          this.resetMeshTimers();
        }
        this.dragging = true;
        this.drag( e )
      }
    }

    this.mouse.x = ( e.clientX / window.innerWidth );
    this.mouse.y = - ( e.clientY / window.innerHeight );

    this.mouseThree.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouseThree.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.mouseThree.z = -1

  }

  mouseUp( e ){
    this.mouseDown = false;
    this._drag = undefined;

    if( this.dragging ){
      this.dragging = false;
    }else{
      this.click();
    }
  }

  resetMeshTimers(){
    this.meshs.forEach(
      ( mesh, index ) => {
        mesh.initialScale = mesh.mesh.scale.clone();
        mesh.initialPosition = mesh.mesh.position.clone();
        mesh.initialSaturation = mesh.mesh.material.uniforms.saturation.value;
        mesh.targetScale = new THREE.Vector3( 1, 1, 1 )
        mesh.targetSaturation = 0;
        mesh.targetPosition = mesh.mesh.position.clone();
        mesh.targetPosition.x = (index * this.positionInterval );
        window.removeHeaderColor();
        mesh.timer.reset();
      }
    )



    this.setState({  oldSelectedIndex: this.state.selectedIndex, selectedIndex: undefined }, () => {
      window.setTimeout(
        () => {
          this.setState({ oldSelectedIndex: undefined })
        }, 800
      );
    })
    this.three.initialBackgroundColor = this.three.currentBackgroundColor.clone();
    this.three.targetBackgroundColor = this.defaultColor.clone();
    this.three.backgroundTimer.reset();
  }

  setTitlesInactive(){
    // this.words.forEach(
    //   ( word, index ) => {
    //     if( word.classList.contains("active") ){
    //       word.classList.add( "inactive" );
    //       word.classList.remove( "active" );
    //     }
    //   }
    // );
  }

  click(){
    if( this.mouseOver ){
      this.scrolling = false;

      this.resetMeshTimers();
      this.setTitlesInactive()

      this.scrollVel = 0;
      let selected = this.mouseOver
      this.snapTarget = -(selected.parent_obj.index * this.positionInterval );
      this.snapTimer.reset();


      let _c = () => {
        let nearest = selected;
        this.selectedIndex = selected.parent_obj.index;
        this.setState({
          selectedIndex: this.selectedIndex
        })
        this.three.initialBackgroundColor = this.three.currentBackgroundColor.clone();
        this.three.targetBackgroundColor = selected.parent_obj.backgroundColor.clone();
        this.three.backgroundTimer.reset();
        window.changeHeaderColor( selected.parent_obj.project.textColor )
        this.meshs.forEach(
          ( mesh, index ) => {
            mesh.initialScale = mesh.mesh.scale.clone();
            mesh.initialPosition = mesh.mesh.position.clone();
            mesh.initialSaturation = mesh.mesh.material.uniforms.saturation.value;
            if( index === this.selectedIndex ){
              mesh.targetScale = new THREE.Vector3( 2, 2, 2 );
              mesh.targetPosition = mesh.mesh.position.clone();
              mesh.targetPosition.x = (index * this.positionInterval );
              mesh.targetSaturation = 1;
            }else{
              mesh.targetSaturation = 0;
              mesh.targetScale = new THREE.Vector3( 1, 1, 1 );;
            }

            if( index > this.selectedIndex ){
              mesh.targetPosition = mesh.mesh.position.clone();
              mesh.targetPosition.x = (index * this.positionInterval ) + (this.positionInterval * 2 / 3);
              mesh.targetScale = new THREE.Vector3( 1, 1, 1 );
            }

            if( index < this.selectedIndex ){
              mesh.targetPosition = mesh.mesh.position.clone();
              mesh.targetPosition.x = (index * this.positionInterval ) - (this.positionInterval * 2 / 3);
              mesh.targetScale = new THREE.Vector3( 1, 1, 1 );
            }

            mesh.timer.reset();
          }
        );
      }
      this.snapTimer.changeCallback( _c )
      this.snapPosition = this.timeline.position.x
    }
  }



  componentDidMount(){
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

    this.timeline = new THREE.Mesh();
    this.three.scene.add( this.timeline );

    // this.createTitles();

    window.addEventListener( "scroll", throttle( this.scrollStart.bind( this ), 80 ) );

    this.setupProjects()

    document.addEventListener( "mousedown", this.mouseDown.bind( this ) );
    document.addEventListener( "mouseup", this.mouseUp.bind( this ) );
    document.addEventListener( "mousemove", throttle(this.mouseMove.bind( this ), 40) );

  }

  createTitles(){
    let projects = Object.values( Projects );

    projects.forEach(
      ( project, index ) => {
        let div = document.createElement( "div" );
        div.className = "project-title hidden";
        div.style.color = project.textColor
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
  }

  scrollStart(){
    if( !this.locked ){
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      this.scrollStart = scrollTop;
      this.scrollStarted = true;
      this.snapPosition = undefined;
      this.snapTarget = undefined;
      this.selectedIndex = undefined;
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
      this.scrollStarted = false;
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
      let _c = () => {
        let nearest = this.getNearest();
        // this.selectedIndex = Math.abs(nearest / this.positionInterval);
        callback();
      }
      this.snapTimer.changeCallback( _c )
    }else{
      let _c = () => {
        let nearest = this.getNearest();
        // this.selectedIndex = Math.abs(nearest / this.positionInterval);
      }
      this.snapTimer.changeCallback( _c )
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
    if( this.snapPosition || this.snapPosition === 0 ){
      let snapDiff = this.snapTarget - this.snapPosition;
      let newPosition = this.snapPosition + (snapDiff * Easing.easeInOutQuart( this.snapTimer.getValue() ));
      this.timeline.position.set(
        newPosition,
        position.y,
        position.z
      );
    }else{
      let newPosition = position.x + this.scrollVel;
      if( newPosition < 0 && newPosition >  (Object.keys( Projects ).length - 1) * this.positionInterval * -1){
        this.timeline.position.set(
          position.x + this.scrollVel,
          position.y,
          position.z
        );
      }
    }
  }

  scrollEnd(){
    if( this.scrolling && !this.dragging ){
      this.scrolling = false;
      this.snap()
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

      if( Math.abs( this.scrollVel ) <= (this.scrollFriction * 1) ){
        this.scrollEnd()
        this.scrollVel = 0;
      }



  }

  setupProjects(){
    let values = Object.values(Projects);
    let imagesLoaded = 0;
    this.scales = [];
    values.forEach(
      ( _project, index ) => {
        let sphere = new THREE.SphereGeometry( window.innerWidth / 8, 32, 32 );

        let vert = require("../../shaders/projectMaterial/vertex.glsl").default;
        let frag = require("../../shaders/projectMaterial/fragment.glsl").default;


        let timer = new Timer({ target: 1, duration: 1200, rate: .075 })

        let uniforms = {
          u_time: { value: 0., type: "f" },
          u_velocity: { value: Math.abs(this.scrollVel), type: "f" },
          u_selection: { value: 1 },
          opacity: { value: .2 },
          saturation: { value: 0 },
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
          transparent: true,
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


        let obj ={
          mesh: mesh,
          timer: timer,
          targetPosition: mesh.position.clone(),
          initialPosition: mesh.position.clone(),
          targetScale: mesh.scale.clone(),
          initialScale: mesh.scale.clone(),
          initialSaturation: 0,
          backgroundColor: _project.backgroundColor,
          targetSaturation: 0,
          project: _project,
          index: index
        }
        mesh.parent_obj = obj
        this.meshs.push(obj);
        image.src = _project.cover;
        mesh.position.set( x, 0, -500 );
        this.timeline.add( mesh );
      }
    );
  }



  animate(){
    this.three.raycaster.setFromCamera( this.mouseThree, this.three.camera );
    const intersects = this.three.raycaster.intersectObjects( this.timeline.children );
    if( intersects.length > 0 ){
      if( this.mouseOver && this.mouseOver != intersects[0].object ){
        this.mouseOver.material.color = new THREE.Color(.47,.47,.47);
        this.mouseOver.material.opacity = .2
        this.mouseOver.material.uniforms.opacity.value = 0;
        // debugger;
      }
      this.mouseOver = intersects[0].object;
      intersects[0].object.material.color = new THREE.Color(1,1,1);
      this.mouseOver.material.opacity = 1
      this.mouseOver.material.uniforms.opacity.value = 1;
    }else{
      if( this.mouseOver ){
        this.mouseOver.material.color = new THREE.Color(.47,.47,.47);
        this.mouseOver.material.opacity = .2
        this.mouseOver.material.uniforms.opacity.value = 0;
        // debugger;
      }
      this.mouseOver = undefined
    }

    let _b_v = Easing.easeInOutQuint(this.three.backgroundTimer.getValue());
    let backgroundColor = this.three.initialBackgroundColor.clone().lerp( this.three.targetBackgroundColor, _b_v );

    this.three.currentBackgroundColor = backgroundColor;
    this.three.renderer.setClearColor( backgroundColor );

    this.mousePass.uniforms.u_mouse.value = [ Math.abs(this.mouse.x), 1 - Math.abs(this.mouse.y) ];
    this.mousePass.uniforms.u_time.value = this.time;
    this.mousePass.uniforms.u_selection.value = (1 - (this.selectionTimer.getValue() * .5));
    this.calculateTimelinePosition()
    this.calculateVelocity();


    if( this.selectedProject ){
      this.zoomTimer.countUp();
    }

    if( this.gotoProject ){
      this.projectTimer++;
    }

    if( this.snapPosition || this.snapPosition === 0 ){
      this.snapTimer.countUp();
    }

    if( this.selectedProject ){
      this.selectionTimer.countUp();
    }

    let values = Object.values(Projects);
    this.meshs.forEach(
      ( mesh, index ) => {
        if( mesh.initialScale ){
          let value = Easing.easeInOutQuint(mesh.timer.getValue());
          let diffPos = mesh.targetPosition.clone().sub( mesh.initialPosition.clone() ).multiplyScalar( value );
          let diffScale = mesh.targetScale.clone().sub( mesh.initialScale.clone() ).multiplyScalar( value );
          let saturation = mesh.initialSaturation + ((mesh.targetSaturation - mesh.initialSaturation) * value)
          if( diffPos.x !== 0 ){
            mesh.mesh.position.set( mesh.initialPosition.clone().add( diffPos ).x, mesh.initialPosition.y, mesh.initialPosition.z );
          }
          let scale = mesh.initialScale.clone().add( diffScale );
          mesh.mesh.scale.set( scale.x, scale.y, scale.z );
          mesh.mesh.material.uniforms.saturation.value = saturation;
          mesh.mesh.material.uniforms.u_time.value = this.time;
        }

      }
    )
    // this.words.forEach(
    //   ( word, index ) => {
    //     if( !this.selectedProject ){
    //       if( this.selectedIndex === index ){
    //         word.classList.remove("hidden");
    //         if( !word.classList.contains("active") ){
    //           word.classList.remove( "inactive" );
    //           word.classList.add("active")
    //         }
    //         if( word.classList.contains("inactive") ){
    //           word.classList.remove("inactive")
    //         }
    //       }else{
    //         if( word.classList.contains("active") ){
    //           word.classList.add( "inactive" );
    //           word.classList.remove("active");
    //         }
    //         if( !word.classList.contains("inactive")  ){
    //           word.classList.add("inactive")
    //           word.classList.remove("active")
    //         }
    //       }
    //     }else{
    //       word.classList.add("inactive")
    //     }
    //   }
    // )

    this.time = (this.startTime - (new Date().getTime()));
    this.three.composer.render()
    // this.three.renderer.render( this.three.scene, this.three.camera )
    window.requestAnimationFrame( this.animate.bind( this ) );
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


  drag( e ){
    this.scrolling = true;
    this.selectedIndex = undefined;
    this.clickedIndex = undefined;
    let rect = this.refs.interface.getBoundingClientRect();
    let clickPosX = e.clientX - rect.x;
    let clickPosY = e.clientY - rect.y;
    this.snapPosition = undefined;
    let x =  e.clientX;
    let y =  e.clientY;
    if( x!== 0 && y !==0 ){
      if( this._drag && this._drag.x ){
        this.scolling = true;
        let vel = x - this._drag.x;
        if( Math.abs( vel ) > Math.abs( this.scrollVel ) ){
          this.scrollVel += (vel/3);
        }
        this.scolling = false;
      }
      this._drag = {x: x, y: y};
      // this.timeline.position.set(
      //   this._dragStart.timelinePos + diffX,
      //   this.timeline.position.y,
      //   this.timeline.position.z
      // );
    }
  }

  dragEnd( e ){
    let rect = this.refs.interface.getBoundingClientRect();
    let clickPosX = e.clientX - rect.x;
    let clickPosY = e.clientY - rect.y;
    let x =  e.clientX;
    let y =  e.clientY;
    this._drag = undefined;
    // let diffX = (x - this._drag.x)
    // this.scrollVel = diffX;
  }

  titles(){
    let values = Object.values( Projects )
    return values.map(
      ( value, index ) => {
        return(
          <ProjectTitle
            project = { value }
            key = {`project-title-${index}`}
            index = { index }
            oldSelectedIndex = { this.state.oldSelectedIndex }
            selectedIndex = { this.state.selectedIndex }
          />
        )
      }
    );
  }

  links(){
    let values = Object.values( Projects )
    return values.map(
      ( value, index ) => {
        return(
          <div className = "link-text" style = {{ color: value.textColor }}>{ value.linkText }</div>
        )
      }
    );
  }

  render(){
    return(
      <div className = "homepage"

      ref = "interface"
      >
        {
          this.about()
        }
        <div className = "projects" ref = "projects" className = {
          this.getProjectsClassName()
        }>
          <div className = "project-window">
            <canvas ref = "canvas"
            className = {this.getCanvasClassName()}
            >
            </canvas>
            <div ref = "project-titles" className = "project-titles">
              {
                this.titles()
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
