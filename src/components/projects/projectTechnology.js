import React from "react";

class ProjectTechnology extends React.Component{
  constructor( props ){
    super();

    this.state = {
      technology: props.technology,
      scrollTop: props.scrollTop,
      project: props.project,
      index: props.index
    }
  }

  componentDidMount(){
  }

  componentWillReceiveProps( props ){
    this.setState({ scrollTop: props.scrollTop })
  }

  spans(){
    let arr = [];
    for( var i = 0; i < this.state.technology.length; i++ ){
      let letter = this.state.technology[i];
      arr.push( letter );
    }


    let handleize = function( str ){
      return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '');
    }

    return arr.map(
      ( char, index ) => {
        let style = {}
        if( this.refs.technology ){
          let rect = this.refs.technology.getBoundingClientRect();
          let perc = (rect.top - ( window.innerHeight / 2 )) / window.innerHeight;
          style = {
            transform: `translate( 0px, ${( Math.round( perc * 1000 ) )}px )`,
            position: "initial",
            width: "auto"
          }
        }
        return (
          <span  className = { `${ handleize( this.state.technology ) }-${index}` }>
            {char}
          </span>
        )
      }
    );
  }

  getTextStyle(){
    if( this.refs.technology ){
      let rect = this.refs.technology.getBoundingClientRect();
      let perc = (rect.top - ( window.innerHeight / 2 )) / window.innerHeight;
      if( this.state.index % 2 === 0 ){
        return({
          transform: `translate( ${-50 + ( Math.round( perc * 100 ) )}%, -50%)`,
          color: this.state.project.textColor
        })
      }else{
        return({
          transform: `translate( ${-50 - ( Math.round( perc * 100 ) )}%, -50%)`,
          color: this.state.project.textColor
        })
      }
    }
  }

  getOverlayStyle(){
    if( this.state.index % 2 !== 0 ){
      return({
        transform: "rotate(180deg)"
      })
    }
  }

  render(){
    return(
      <div ref = "technology" ref = "technology" className = {`project__technology project__technology--${this.state.technology.toLowerCase()}`}>
        <div className = "technology__inner-text" style = { this.getTextStyle() }>
          {
            this.spans()
          }
        </div>
        <div className = "technology__overlay" style = { this.getOverlayStyle() }></div>
      </div>
    )
  }
}

export default ProjectTechnology
