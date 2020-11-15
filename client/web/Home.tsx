import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const Home: React.FunctionComponent = () => {
  useEffect(() => {
    document.getElementById('game').style.display = 'none';
    document.getElementById('root').style.display = 'block';
  });
  return(
  <div>
    <Link to="/game">Game</Link>
  </div>);
}