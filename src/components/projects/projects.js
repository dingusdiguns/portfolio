import React from "react";
import { withRouter } from "react-router";
import ProjectTitle from "../home/project-title"
import NextProject from "../home/next-project"
import Projects from "../../data/projects";

const throttle = require( "../../util/throttle" );

class Project extends React.Component{
  constructor( props ){
    super();

    let projects = Object.values( Projects );
    let project;

    projects.forEach(( _project, index ) => {
      if( props.match.params.project === _project.handle ){
        project = _project;
      }
    });
    

    this.state = {
      handle: props.match.params.project,
      project: project,
      loaded: false
    }
  }

  componentDidMount(){
    window.scroll( 0, 0 );
    window.setTimeout(
      () => {
        this.setState({
          selectedIndex: 1
        })
      }, 10
    );

    window.setTimeout(
      () => {
        this.setState({ loaded: true })
      },
      500
    )
    this.scrollEvent = throttle( this.scroll.bind( this ), 80 );
    // window.addEventListener( "scroll", this.scrollEvent );
  }

  componentWillUnmount(){
    window.removeEventListener( "scroll", this.scrollEvent );
  }

  scroll(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if( scrollTop + window.innerHeight > document.body.offsetHeight  ){
      if( !this.navTimeout ){

        this.navTimeout = window.setTimeout( this.navigateNextProject.bind( this ), 2000 )
      }
    }else if( this.navTimeout ){
      window.clearTimeout( this.navTimeout )
      this.navTimeout = undefined;
    }
  }

  navigateNextProject(){
    this.setState({ fadeOut: true })
  }

  getStyle(){
    if( this.state.project ){
      return({
      })
    }
  }

  title(){
    if( this.state.project ){
      return(
        <ProjectTitle
          project = { this.state.project }
          index = {1}
          oldSelectedIndex = {undefined}
          selectedIndex = {this.state.selectedIndex}
          projectPage = { true }
          clickProject = { () => {} }
        />
      )
    }
  }

  shortDescription(){
    if( this.state.project ){
      // return(
      //   <h3 dangerouslySetInnerHTML = {{ __html: this.state.project.shortDescription }}/>

      // )
    }
  }

  description(){
    if(
      this.state.loaded
    ){
      return(
        <div className = "project__description">
          <div className = "project__description-inner">
            <p dangerouslySetInnerHTML = {{ __html: this.state.project.description }}/>
            <div className = "project-details">
              <div className = "technologies">
              <label>Technologies</label>
              <ul>
              {
                this.state.project.technologies.map(
                  ( tech ) => {
                    return(
                      <li>
                      {tech}
                      </li>
                    )
                  }
                )
              }
              </ul>
              </div>
              <div className = "roles">
              <label>Roles</label>
              <ul>
              {
                this.state.project.roles.map(
                  ( role ) => {
                    return(
                      <li>
                      {role}
                      </li>
                    )
                  }
                )
              }
              </ul>
              </div>
            </div>
          </div>
        </div>
      )

    }
  }

  images(){
    return this.state.project.images.map(
      ( img, index ) => {
        if( img.video){
          let className = "project__video";
          if( this.state.fadeOut ){
            className = "project__video fade-out"
          }
          return(
            <div className = {className}>
              <video
              loop = {true} 
              muted
              playsInline
              autoPlay = {true}
              >
                <source src = {img.src} 
                  ></source>
              </video>
            </div>
          )
        }else{
          let className = "project__image";
          if( this.state.fadeOut ){
            className = "project__image fade-out"
          }
          return(
            <div className = {className}>
              <img src = {img} ></img>
            </div>
          )
        }
      }
    );
  }

  body(){
    return(
      <div className = "project__body">
        <div className = "wrap">
          <div className = "grid">
            <img className = "project__main-image project__image" src = { this.state.project.firstImage ? this.state.project.firstImage : this.state.project.cover }/>
            {
              this.description()
            }
            {
              this.mobileHero()
            }
            {
              this.images()
            }
          </div>
        </div>
      </div>
    )
  }

  getNextProject(){
    let values = Object.values( Projects );
    let currentIdx;

    values.forEach(
      ( value, index ) => {
        if( value === this.state.project ){
          currentIdx = index;
        }
      }
    );
    
    if(
      values[currentIdx + 1] 
    ){
      return values[ currentIdx + 1 ]      
    }else{
      return values[0]
    }
  }
  
  nextProject(){
    let next = this.getNextProject()
    return(
      <NextProject project = {next} fadeOut = { this.state.fadeOut }></NextProject>
    )
  }

  mobileHero(){
    return(
      <div className = "project__hero--mobile">
        <h2>{ this.state.project.title }</h2>
        <p dangerouslySetInnerHTML = {{ __html: this.state.project.description }} ></p>
      </div>
    )
  }

  render(){
    return(
      <div className = "projects" style = { this.getStyle() }>
        <div className = "project__hero">
          {
            this.title()
          }
          {
            this.shortDescription()
          }
        </div>
        {
          this.body()
        }
        {
          this.nextProject()
        }
      </div>
    )
  }
}

const ProjectWithRouter = withRouter(Project);
export default ProjectWithRouter;
