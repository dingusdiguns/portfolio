import React from "react";
import { withRouter } from "react-router";


class Header extends React.Component{
  constructor(){
    super();
    this.state = {
      menuActive: false
    }
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

  getStyle(){
    if( this.state.color ){
      return {
        opacity: .8,
        color: this.state.color,
        borderColor: this.state.color
      }
    }
  }

  clickAbout(){
    debugger
  }

  clickProjects(){
    this.props.history.push( "/" );
  }

  render(){
    return(
      <div className = "header">
        <ul>
          <li className = "header-link" style = { this.getStyle() }>
            About
          </li>
          <li className = "header-link active" style = { this.getStyle() }
            onClick = { this.clickProjects.bind( this ) }
          >
            Projects
          </li>
        </ul>
      </div>
    )
  }
}

const HeaderWithRouter = withRouter(Header);
export default HeaderWithRouter
