import React, { useState, useEffect } from "react";
import { Game } from './Game';
import { Home } from './Home';
import { HashRouter as Router, Route } from "react-router-dom";
import { socket } from '../socketClient';

export const UI: React.FunctionComponent = () => {
  const [messages, setMessages] = useState([] as string[]);
  const [lastupdate, setUpdate] = useState(Date.now() as number);
  useEffect(() => {
    socket.addEventListener('message', (ev) => {
      messages.push(ev.data);
      setMessages(messages);
      setUpdate(Date.now())
    });
  }, []);

  return (
    <Router>
      <Route path="/game">
        <Game />
      </Route>
      <Route exact path="/">
        <Home { ...{socket, messages, lastupdate} }/>
      </Route>
    </Router>
  )
}
