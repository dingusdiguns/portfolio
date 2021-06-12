import React from "react";
import { withRouter } from "react-router";

let Projects = require( "../../data/projects" )

class Project extends React.Component{
  constructor( props ){
    super();
    this.state = {
      handle: props.match.params.project
    }
  }

  componentDidMount(){
    let projects = Object.values( Projects );
    let project;
    projects.forEach(( _project, index ) => {
      if( this.state.handle === _project.handle ){
        project = _project;
      }
    });
    window.setTimeout(
      () => {
        this.setState({
          project: project
        })
        window.changeHeaderColor( project.textColor )
      }, 10
    );
  }

  getStyle(){
    if( this.state.project ){
      return({
        backgroundColor: this.state.project.backgroundColor_rgb
      })
    }
  }

  render(){
    return(
      <div className = "projects" style = { this.getStyle() }>

      </div>
    )
  }
}

const ProjectWithRouter = withRouter(Project);
export default ProjectWithRouter;
