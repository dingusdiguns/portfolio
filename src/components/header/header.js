import React from "react";
import { withRouter } from "react-router";


class Header extends React.Component{
  constructor( props ){
    super();

    let page;
    let pathname = props.location.pathname;
    if( pathname === "/" || pathname === "/home" ){
      page = "projects"
    }else if( pathname ==="/about" ){
      page = "about"
    }else if( pathname.indexOf("/project/") !== -1 ){
      page = "project"
    }

    this.state = {
      menuActive: false,
      page: page
    }
  }

  componentWillReceiveProps( props ){
    let page;
    let pathname = props.location.pathname;
    if( pathname === "/" || pathname === "/home" ){
      page = "projects"
      debugger
    }else if( pathname ==="/about" ){
      page = "about"
    }else if( pathname.indexOf("/project/") !== -1 ){
      page = "project"
    }
    this.setState({ page: page })
  }

  componentDidMount(){
    window.changeHeaderColor = this.changeHeaderColor.bind( this )
    window.removeHeaderColor = this.removeHeaderColor.bind( this )
  }

  changeHeaderColor( color ){
    this.setState({ color: color })
  }

  removeHeaderColor(){
    this.setState({ color: undefined })
  }

  toggleMenu(){
    this.setState({
      menuActive: !this.state.menuActive
    })
  }

  getMenuStyle(){
    if( this.state.menuActive ){
      return({
        height: "100vh",
        top: "0px"
      })
    }else{
      return({})
    }
  }

  clickProjects(){
    this.props.history.push( "/" );
  }

  clickAbout(){
    window.clickPage(
      () => {
        this.props.history.push( "/about" )
      }
    );
  }

  linkClass( name ){
    if( name === this.state.page ){
      return "header-link active"
    }else{
      return "header-link"
    }
  }

  getStyle(){
    if( this.state.page === "project" || this.state.page === "about" ){
      return({
        background: "rgb(15,15,15)"
      })
    }
  }

  
  getStyle(){
    let style = {
      opacity: 1,
      color: this.state.color,
      borderColor: this.state.color
    }
    if( this.state.page === "project" || this.state.page === "about" ){
      style.backgroundColor = "rgb(15, 15, 15)"
    }
    return style

  }


  render(){
    return(
      <div className = "header" style = { this.getStyle() }>
        <div className = "wrap">
          <ul>
            <li className = { this.linkClass( "projects" ) } style = { this.getStyle() }
              onClick = { this.clickProjects.bind( this ) }
            >
              Projects
            </li>
            <li className = { this.linkClass( "about" ) } style = { this.getStyle() } onClick = { this.clickAbout.bind( this ) }>
              About
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const HeaderWithRouter = withRouter(Header);
export default HeaderWithRouter
