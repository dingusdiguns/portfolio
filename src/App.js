import logo from './logo.svg';
import './App.css';
import React from "react";
import Home from "./components/home/home.js"
import Header from "./components/header/header.js"
import Project from "./components/projects/projects.js"
import About from "./components/about/about.js"
import Transition from "./components/projects/transition"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default function App() {
  return(
    <Router>
      <Header/>
      <Route exact path = "/" page = "home">
        <Home/>
      </Route>
      <Route path = "/home" page = "home">
        <Home/>
      </Route>
      <Route path = "/projects/:project" page = "projects">
        <Project/>
      </Route>
      <Route path = "/transition/:project" page = "transition">
        <Transition/>
      </Route>
      <Route path = "/about" page = "about">
        <About/>
      </Route>
    </Router>
  )
}
