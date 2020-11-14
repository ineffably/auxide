import { GameTime } from '../types';

let lastTime = Date.now();
export function getDeltaTime(): GameTime {
  const now = Date.now();
  let deltaTime = (now - lastTime);
  lastTime = now;
  if (deltaTime < 0) deltaTime = 0;
  if (deltaTime > 1000) deltaTime = 1000;
  const deltaFrame = (deltaTime * 60) / 1000;
  return {
    deltaFrame, 
    deltaTime
  };
}