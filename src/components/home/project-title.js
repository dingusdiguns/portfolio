import React from "react";

class ProjectTitle extends React.Component{
  constructor( props ){
    super();
    this.state = {
      title: props.project.title,
      index: props.index,
      projectPage: props.projectPage,
      textColor: props.project.textColor,
      selectedIndex: props.selectedIndex,
      oldSelectedIndex: props.oldSelectedIndex,
      linkText: props.project.linkText,
      backgroundColor: props.project.backgroundColor_rgb
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      selectedIndex: props.selectedIndex,
      oldSelectedIndex: props.oldSelectedIndex
    })
  }

  chars(){
    let arr = [];
    for( var i = 0; i < this.state.title.length; i++ ){
      let char = this.state.title[i];
      arr.push( char );
    }
    return arr.map(
      ( char, index ) => {
        let style = {};
        if( this.state.index === this.state.selectedIndex ){
          style = {
            transform: "translate( 0px, 0px ) rotate3d(1, 0, 0, 0deg)",
            transitionDelay: ` ${ index / 20 }s`,
            opacity: 1,
          }
        }else if( this.state.index === this.state.oldSelectedIndex ){
          style = {
            transform: "translate( 0px, 10vh ) rotate3d(1, 0, 0, -90deg)",
            transitionDelay: ` ${ index / 20 }s`,
            opacity: 0
          }
        }else{
          style = {
            transform: "translate( 0px, -10vh ) rotate3d(1, 0, 0, 90deg)",
            transitionDelay: ` ${ index / 20 }s`,
            opacity: 0
          }
        }
        if( this.state.projectPage ){
          style.color = "white"
        }
        return(<span style = { style }>
          {char}
        </span>)
      }
    );
  }

  link(){
    if( !this.state.projectPage ){
      let style = {};
      if( this.state.index === this.state.selectedIndex ){
        style = { pointerEvents: "painted",width: "auto", color: this.state.textColor, border: `4px solid ${ this.state.textColor }`, opacity: 1 }
      }else{
        style = { pointerEvents: "none",width: "auto", color: this.state.textColor, border: `4px solid ${ this.state.textColor }`, opacity: 0 }
      }
     
      return(
        <div className = "link-text" style = {style}>
          <button onClick = { () => { this.props.clickProject() } }> { this.state.linkText } </button>
        </div>
      )
    }
  }

  getClassName(){
    let className;
    if( this.state.projectPage ){
      className = "project-title project-title--home"
    }else{
      className = "project-title "
    }
    return className;
  }

  render(){
    return(
      <div>
        <div className = { this.getClassName() } style = {{ color: this.state.textColor }}>
        {
          this.chars()
        }
        </div>
        {
          this.link()
        }
      </div>
    )
  }
}

export default ProjectTitle
