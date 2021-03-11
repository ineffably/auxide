import React, { useState, useEffect } from "react";
import { Game } from './Game';
import { HashRouter as Router, Route } from "react-router-dom";
// import { socket } from '../socketClient';
import { Tilesheet } from './Tilesheet';

export const UI: React.FunctionComponent = () => {
  // const [messages, setMessages] = useState([] as string[]);
  // const [lastupdate, setUpdate] = useState(Date.now() as number);
  // useEffect(() => {
  //   socket.addEventListener('message', (ev) => {
  //     messages.push(ev.data);
  //     setMessages(messages);
  //     setUpdate(Date.now())
  //   });
  // }, []);

  console.log('==> Render UI.tsx <==')

  return (
    <Router>
      <Route path="/tilesheet" exact>
        <Tilesheet />     
      </Route>
      <Route path="/" exact>
        <Game />
      </Route>
    </Router>
  )
}
