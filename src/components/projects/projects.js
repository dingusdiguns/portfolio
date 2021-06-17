import React from "react";
import { withRouter } from "react-router";
import ProjectTitle from "../home/project-title"

let Projects = require( "../../data/projects" )

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
      project: project
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
      return(
        <h3 dangerouslySetInnerHTML = {{ __html: this.state.project.shortDescription }}/>

      )
    }
  }

  description(){
    return(
      <div className = "project__description">
        <div className = "project__description-inner">
          <p dangerouslySetInnerHTML = {{ __html: this.state.project.description }}/>
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
    )
  }

  images(){
    return this.state.project.images.map(
      ( img, index ) => {
        return(
          <img src = {img} className = "project__image"></img>
        )
      }
    );
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
        <div className = "project__body">
          <div className = "grid">
            <img className = "project__main-image project__image" src = { this.state.project.firstImage ? this.state.project.firstImage : this.state.project.cover }/>
            {
              this.description()
            }
            {
              this.images()
            }
          </div>
        </div>
      </div>
    )
  }
}

const ProjectWithRouter = withRouter(Project);
export default ProjectWithRouter;
