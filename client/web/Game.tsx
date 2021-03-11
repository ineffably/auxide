import React, { useEffect } from 'react';
import { init } from '../game/game';

export const Game: React.FunctionComponent = () => {
  useEffect(() => {
    init();
  })
  return(<div/>);
}