import React, { useEffect } from 'react';
import { init } from '../game/spritesheetViewer';

export const Tilesheet: React.FunctionComponent = () => {
  useEffect(() => {
    init();
  }, [])
  return(
    <div id='tiles'></div>
  )
}