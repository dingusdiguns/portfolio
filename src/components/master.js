import React from "react";
import Home from "./home/home.js"
import Header from "./header/header.js"

class Master extends React.Component{
  constructor(){
    super();
    this.state = {

    }
  }

  render(){
    return(
      <div>
        <Header
        />
        <Home
        />
      </div>
    )
  }
}

export default Master
