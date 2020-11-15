import React from "react";
import { Game } from './Game';
import { Home } from './Home';
import { HashRouter as Router, Route } from "react-router-dom";
// import './UI.css';

export const UI: React.FunctionComponent = () => {
  return (
    <Router>
      <Route exact path="/game">
        <Game />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Router>
  )
}
