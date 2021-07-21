import React from "react";
import { withRouter } from "react-router";
import ProjectTitle from "../home/project-title"
import NextProject from "../home/next-project"
import Projects from "../../data/projects";
import ProjectTechnology from "./projectTechnology"
// import Slider from "react-slick"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


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

  componentWillReceiveProps( props ){
    let projects = Object.values( Projects );
    let project;

    projects.forEach(( _project, index ) => {
      if( props.match.params.project === _project.handle ){
        project = _project;
      }
    });

    if( project !== this.state.project ){
      this.setState({
        handle: props.match.params.project,
        project: project,
        loaded: false
      }, this.__mounted.bind( this ))
    }

  }


  componentDidMount(){
    this.__mounted()

    // window.changeHeaderColor( this.state.project.textColor );
    // window.addEventListener( "scroll", this.scrollEvent );

  }

  __mounted(){
    window.scroll( 0, 0 );
    this.selectedTimeout = window.setTimeout(
      () => {
        this.setState({
          selectedIndex: 1
        })
      }, 10
    );

    this.loadTimeout = window.setTimeout(
      () => {
        this.setState({ loaded: true })
      },
      500
    )
    this.scrollEvent = throttle( this.scroll.bind( this ), 20 );
    window.addEventListener( "scroll", this.scrollEvent );
  }

  componentWillUnmount(){
    window.clearTimeout( this.loadTimeout );
    window.clearTimeout( this.selectedTimeout );
    window.removeEventListener( "scroll", this.scrollEvent );
  }

  scroll(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    this.setState({ scrollTop: scrollTop })
    if( scrollTop + 200 > document.body.offsetHeight  ){
      if( !this.navTimeout ){
        this.navTimeout = window.setTimeout( this.navigateNextProject.bind( this ), 400 )
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
          scrollTop = { this.state.scrollTop }
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
        <div className = "wrap wrap--projects">
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
        </div>
      )

    }
  }

  getGetImageType( img ){
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

  images(){
    return this.state.project.images.map(
      ( img, index ) => {
        if( img.video){
          let className = "project__video";
          if( this.state.fadeOut ){
            className = "project__video fade-out"
          }
          return(
            <div className = "wrap wrap--projects">
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
            </div>
          )
        }else if( img.grid ){
          return(
            <div className = "project__image-grid">
              {
                img.images.map(
                  ( src, index ) => {
                    return this.getGetImageType( src )
                  }
                )
              }
            </div>
          )
        }else if( img.fullscreen ){
          let className = "project__image";
          if( this.state.fadeOut ){
            className = "project__image fade-out"
          }
          if( img.src.video  ){
            return(
              <div className = "wrap wrap--projects-fullscreen">
                <div className = "project__video">
                  <video
                  loop = {true}
                  muted
                  playsInline
                  autoPlay = {true}
                  >
                  <source src = {img.src.src}
                  ></source>
                  </video>
                </div>
              </div>
            )
          }else{
            return(
              <div className = "wrap wrap--projects-fullscreen">
                <div className = {className}>
                  <img src = {img.src} ></img>
                </div>
              </div>
            )
          }
        }else if( img.carousel ){
          let className = "project__carousel";
          if( this.state.fadeOut ){
            className = "project__carousel fade-out"
          }
          const settings = {
            dots: false,
            centerMode: true,
            arrows: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            variableWidth: true
          };
          return(
            <div className = "slick-container">
              <Carousel
              dynamicHeight = {true}
              centerMode = {true}
              swipeable = {true}
              showArrows = {false}
              infiniteLoop = {true}
              centerSlidePercentage = {25}
              >
                {
                  img.images.map(
                    ( el, index ) => {
                      return(
                        <div className = "carousel-slide" key = {`slick-image-${index}`}>
                          <img src = { el.src } />
                          <p dangerouslySetInnerHTML = {{__html: el.caption }}/>
                        </div>
                      )
                    }
                  )
                }
              </Carousel>
            </div>
          )
        }else{
          return (
            <div className = "wrap wrap--projects">
              {this.getGetImageType( img )}
            </div>
          )

        }
      }
    );
  }

  body(){
    return(
      <div className = "project__body">
        <div className = "grid">
          <div className = "wrap wrap--projects">
            <img className = "project__main-image project__image" src = { this.state.project.firstImage ? this.state.project.firstImage : this.state.project.cover }/>
          </div>
          {
            this.description()
          }
          {
            this.mobileHero()
          }
          <div className = "project__images">
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
      <NextProject clickProject = { this.navigateNextProject.bind( this ) } project = {next} fadeOut = { this.state.fadeOut }></NextProject>
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

  technologies(){
    return (
      <div className = "project__technologies">
        <div className = "project__technology project__technology--title">
          <div className = "technology__inner-text technology__inner-text--title" style = {{  }}>
              Technology
          </div>
        </div>
          {
            this.state.project.technologies.map(
              ( el, index ) => {
                return(
                  <ProjectTechnology project = { this.state.project } technology = { el } index = { index } scrollTop = { this.state.scrollTop }/>
                )
              }
            )
          }
      </div>
    )
  }

  render(){
    return(
      <div className = "projects" style = { this.getStyle() }>
        <div className = "projects__inner">
          <div className = {`project__hero project__hero--${ this.state.project.handle }`}>
            {
              this.title()
            }
            {
              this.shortDescription()
            }
            <div className = "overlay"></div>
          </div>
          {
            this.body()
          }
          {
            this.technologies()
          }
          {
            this.nextProject()
          }
        </div>
      </div>
    )
  }
}

const ProjectWithRouter = withRouter(Project);
export default ProjectWithRouter;
