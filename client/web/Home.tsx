import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  width: 350px;
  height: 250px;
`
const StyledInput = styled.input`
  width: 350px;
`

export interface HomeProps{
  socket: WebSocket;
  messages: string[];
  lastupdate: number;
}

export const Home: React.FunctionComponent<HomeProps> = ({ socket, messages, lastupdate }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    document.getElementById('game').style.display = 'none';
    document.getElementById('root').style.display = 'block';
  }, []);

  return(
    <div >
      <div>
        <Link to="/game">Game</Link>
      </div>
      <div>
        <StyledInput type="text" value={text} 
        onKeyUp={(ev) => {
          if(ev.keyCode === 13){
            const input = ev.target as HTMLInputElement;
            socket.send(input.value);
            setText('');
          }
        }}
        onChange={(ev) => {
          setText(ev.target.value);
        }}/>
      </div>
      <div >
        <StyledTextarea key={lastupdate} value={messages.join('\n')} readOnly />
      </div>
    </div>
  );
}