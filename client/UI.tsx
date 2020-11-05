import React, { useEffect } from 'react';
import { app } from './game';

export const ui = () => {
  useEffect(() => {
    console.log(app);
  })
  
  return(
    <div>User Interface</div>
  )
}