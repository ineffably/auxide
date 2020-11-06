import React, { useEffect } from 'react';
import { init } from './game';

export const ui = () => {
  useEffect(() => {
    init();
  })
  
  return(
    <div/>
  )
}