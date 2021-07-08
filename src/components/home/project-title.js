import React from "react";

class ProjectTitle extends React.Component{
  constructor( props ){
    super();
    this.state = {
      title: props.project.title,
      index: props.index,
      projectPage: props.projectPage,
      textColor: props.project.textColor,
      handle: props.project.handle,
      selectedIndex: props.selectedIndex,
      oldSelectedIndex: props.oldSelectedIndex,
      linkText: props.project.linkText,
      backgroundColor: props.project.backgroundColor_rgb
    }

    this.rands = [];
    for( var i = 0; i < props.project.title.length; i++ ){
      let rand = 4.5 + ((Math.random() )) * -3;
      this.rands.push( rand );
    }
  }

  componentWillReceiveProps( props ){
    if( props.project.title !== this.state.title ){
      console.log( props.scrollTop )
      this.setState({
        title: props.project.title,
        index: props.index,
        projectPage: props.projectPage,
        textColor: props.project.textColor,
        selectedIndex: props.selectedIndex,
        oldSelectedIndex: props.oldSelectedIndex,
        linkText: props.project.linkText,
        backgroundColor: props.project.backgroundColor_rgb,
        scrollTop: props.scrollTop
      })
    }else{
      console.log( props.scrollTop )
      this.setState({
        selectedIndex: props.selectedIndex,
        oldSelectedIndex: props.oldSelectedIndex,
        scrollTop: props.scrollTop
      })
    }
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
        let one = window.innerHeight / 100;
        let offsetY = 0;
        if( this.state.scrollTop ){
          offsetY = this.state.scrollTop / this.rands[index];
        }
        if( this.state.index === this.state.selectedIndex ){
          style = {
            transform: `translate( 0px, 0px ) rotate3d(1, 0, 0, 0deg)`,
            transitionDelay: ` ${ index / 10 }s`,
            transformOrigin: "top",
            opacity: 1,
          }
        }else if( this.state.index === this.state.oldSelectedIndex ){
          style = {
            transform: `translate( 0px, ${ one * 15 }px ) rotate3d(1, 0, 0, -90deg)`,
            transitionDelay: ` ${ index / 10 }s`,
            transformOrigin: "top",
            opacity: 0
          }
        }else{
          style = {
            transform: `translate( 0px, -${ one * 15 }px ) rotate3d(1, 0, 0, 90deg)`,
            transitionDelay: ` ${ index / 10 }s`,
            opacity: 0
          }
        }
        if( this.state.projectPage ){
          style.color = "rgb( 255, 255, 255 )"
        }
        return(<span style = { style } className = { `${this.state.handle}-${index}` }>
          <div style = {{ transform: `translate( 0px, ${ offsetY }px )`, transition: ".01s linear" }}>
            {char}
          </div>
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
      className = `project-title project-title--home project-title--home--${ this.state.handle }`
    }else{
      className = `project-title project-title--${this.state.handle}`
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
