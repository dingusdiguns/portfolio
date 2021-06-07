import React from "react";

class Header extends React.Component{
  constructor(){
    super();
    this.state = {
      menuActive: false
    }
  }

  toggleMenu(){
    this.setState({
      menuActive: !this.state.menuActive
    })
  }

  getMenuStyle(){
    if( this.state.menuActive ){
      debugger
      return({
        height: "100vh",
        top: "0px"
      })
    }else{

    }
  }



  render(){
    return(
      <div className = "header">
        <div className = "hamburger"  onClick = { this.toggleMenu.bind( this ) }>
          <div className = "bun"></div>
          <div className = "bun"></div>
          <div className = "bun"></div>
        </div>
        <div className = { this.state.menuActive ? "menu active": "menu" } style = { this.getMenuStyle() }>
          <ul>
            <li style = {{ transitionDelay: ".7s" }}><span>About</span></li>
            <li style = {{ transitionDelay: ".8s" }}><span>Projects</span></li>
            <li style = {{ transitionDelay: ".9s" }}><span style = {{ borderBottom: "0px" }}>Contact</span></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header
