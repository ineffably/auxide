import React, { useEffect } from 'react';
import { init } from '../game/game';

export const Game: React.FunctionComponent = () => {
  useEffect(() => {
    document.getElementById('root').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    init();
  })
  console.log('== Game Page Render ==')
  return(<div/>);
}