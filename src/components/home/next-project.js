import React from "react";
import Timer from "../../util/timer"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { withRouter } from "react-router";

const THREE = require("three");
const Easing = require( "../../util/easing" );
const throttle = require( "../../util/throttle" );


class NextProject extends React.Component{
    constructor( props ){
        super();
        this.state = {
            project: props.project
        }

        this.defaultColor = new THREE.Color("rgb( 15, 15, 15 )");
        this.backgroundColor = new THREE.Color("rgb( 15, 15, 15 )");
        this.startTime = new Date().getTime();
        this.time = 0
        this.wordFadeTimer = new Timer( { target: 1, duration: 800,rate: .07 } );
        this.materialFadeTimer = new Timer( { target: 1, duration: 800,rate: .07, delay: .1 } );
    }

    componentWillReceiveProps( props ){
        this.setState({ fadeOut: props.fadeOut })
        if( props.fadeOut ){
            this.wordFadeTimer.reset();
            this.materialFadeTimer.reset();
            this.materialFadeTimer.changeCallback(
                function(){
                    this.props.history.push( `/transition/${ this.state.project.handle }` )
                }.bind( this )
            );
        }
    }

    componentDidMount(){
        let renderer = new THREE.WebGLRenderer({ canvas: this.refs.canvas, antialias: true });
        const composer = new EffectComposer( renderer );
        renderer.setClearColor( "red" );
        renderer.setClearColor( this.backgroundColor );
        renderer.sortObjects = false;
        // renderer.setPixelRatio( window.devicePixelRatio )
        // composer.setPixelRatio( window.devicePixelRatio )
        let h = this.refs.canvas.offsetHeight * ( 8 / 10 );
        renderer.setSize( window.innerWidth, h );
        composer.setSize(window.innerWidth, h);
        this.three = {
          scene: new THREE.Scene(),
          camera: new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, h / -2, h / 2 ),
          renderer: renderer,
          composer: composer,
          raycaster: new THREE.Raycaster(),
          targetBackgroundColor: this.backgroundColor.clone(),
          initialBackgroundColor: this.backgroundColor.clone(),
          initialBackgroundColor: this.backgroundColor.clone(),
          backgroundTimer: new Timer({ target: 1, duration: 1000, rate: .075 })
        };

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

        window.setTimeout(
            this.setupProject.bind(this),
            1000
        );

        const color = 0xFFFFFF;  // white
        const near = 1200;
        const far = 0;
        this.three.scene.fog = new THREE.Fog(color, near, far);
    }

    setupProject(){
        let vert = require("../../shaders/projectMaterial/vertex.glsl").default;
        let frag = require("../../shaders/projectMaterial/fragment.glsl").default;
        let uniforms = {
            u_time: { value: 0., type: "f" },
            u_velocity: { value: 0, type: "f" },
            u_selection: { value: 1 },
            opacity: { value: 1 },
            hover_sat: { value: 1 },
            saturation: { value: 1 },
            u_resolution: { value: [
              this.refs.canvas.width,
              this.refs.canvas.height
            ]},
            image: {
              value: new THREE.TextureLoader().load( this.state.project.cover )
            }
        };

        let sphere = new THREE.SphereGeometry( window.innerHeight / 6, 32, 32 );


        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vert,
            transparent: true,
            fragmentShader: frag
        });

        // let material = new THREE.MeshBasicMaterial({ color: "red" })

        let mesh = new THREE.Mesh( sphere, material );
        this.three.scene.add( mesh );
        this.mesh = mesh;
        mesh.position.set( 0, 0, -500 );
        mesh.scale.set( 2, 2, 2 );
        this.createTexture()
    }

    createTexture(){
        let canvas = document.createElement( "canvas" );
        let ctx = canvas.getContext("2d");
        let height = 600;

        let word = `${this.state.project.title.toUpperCase()} `;
        while( word.length < 24 ){
            word = word + `${this.state.project.title.toUpperCase()} `;
        }
        ctx.font = `${Math.ceil(height * .6)}px GT America Expanded Black`;
        ctx.fillStyle = "black"
        let measurement = ctx.measureText( (`${word}`), 0, 0 );
        canvas.width = measurement.width;
        canvas.height = height * .6
        ctx.textBaseline = "top"
        ctx.font = `${Math.ceil(height * .6)}px GT America Expanded Black`;
        ctx.fillStyle = "white";
        ctx.fillText( `${word}`, 0, 0 );
        this.texture = new THREE.Texture( canvas );
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.LinearMipMapLinearFilter;
        window.texture = this.texture
        this.texture.needsUpdate = true;
        this.creatWord();
      }

    creatWord(){
        let circumference = window.innerWidth * 1.2;
        let aspect = (this.texture.image.width / this.texture.image.height);
        let height = (window.innerWidth * 1.2 * ( 1 / aspect ));
        let radius = ((circumference / Math.PI) / 2);

        var frontSideGeometry = new THREE.CylinderGeometry( radius, radius, height, 200, 2, true );
        var backSideGeometry = new THREE.CylinderGeometry( radius, radius, height, 200, 2, true );
    
        let frontSideMaterial = new THREE.MeshStandardMaterial({
            color: "white",
            map: this.texture,
            side: THREE.BackSide,
            transparent: true
          });
      
          let backSideMaterial = new THREE.MeshStandardMaterial({
            color: "white",
            map: this.texture,
            side: THREE.FrontSide,
            transparent: true
          });
      
        let frontSideCylinder = new THREE.Mesh( frontSideGeometry, frontSideMaterial ); 
        let backSideCylinder = new THREE.Mesh( backSideGeometry, backSideMaterial );
        this.frontSideCylinder = frontSideCylinder;
        this.backSideCylinder = backSideCylinder;

        this.mesh.add(
            backSideCylinder
        );
        this.mesh.add(
            frontSideCylinder
        );

        this.frontSideCylinder.scale.set( 1, -1, 1 );
        this.backSideCylinder.scale.set( 1, -1, 1 );
        this.frontSideCylinder.position.set( 0, 0, -20 );
        this.backSideCylinder.position.set( 0, 0, -20 );

        this.animate();
    }

    animate(){
        // this.three.composer.render()
        this.mesh.material.uniforms.u_time.value = this.time;
        this.frontSideCylinder.rotation.set(-.025, this.time / 3200, 0);
        this.backSideCylinder.rotation.set(-.025, this.time / 3200, 0);
        this.time = (this.startTime - (new Date().getTime()));
        this.three.renderer.render(this.three.scene, this.three.camera);
        window.requestAnimationFrame( this.animate.bind( this ) );
        if( this.state.fadeOut ){
            let clickValue = Easing.easeOutQuint( this.wordFadeTimer.getValue());
            let y = 0 + ( 250 * clickValue );
            this.frontSideCylinder.position.setY( y );
            this.backSideCylinder.position.setY( y );

            let opacity = this.materialFadeTimer.getValue();
            this.mesh.material.uniforms.opacity.value = 1 - opacity;
            let mesh_y = 0 + ( 650 * Easing.easeOutCubic(opacity) );
            this.mesh.position.setY( mesh_y );

        }
    }

    getTitleStyle(){
        let style = {};
        if( this.state.fadeOut ){
            style["opacity"] = 0;
        }
        return style;
    }

    render(){
        return(
            <div className = "next-project" >
                <div className = "next-project__title" style = { this.getTitleStyle() }>
                    Next Project
                </div>
                <canvas ref = "canvas">
                </canvas>
            </div>
        )
    }
}

const nextProjectWithRouter = withRouter(NextProject);

export default nextProjectWithRouter