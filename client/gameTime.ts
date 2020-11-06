import { GameTime } from '../types';


// let fixedTimeStep = 1 / 60, maxSubSteps = 10, lastTimeMilliseconds;
// requestAnimationFrame(function animloop(timeMilliseconds){
//     requestAnimationFrame(animloop);
//     var timeSinceLastCall = 0;
//     if(timeMilliseconds !== undefined && lastTimeMilliseconds !== undefined){
//         timeSinceLastCall = (timeMilliseconds - lastTimeMilliseconds) / 1000;
//     }
//     // world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
//     // lastTimeMilliseconds = timeMilliseconds;
// }

let lastTime = Date.now();
export function getDeltaTime(): GameTime {
  const now = Date.now();
  let deltaTime = now - lastTime;
  lastTime = now;
  if (deltaTime < 0) deltaTime = 0;
  if (deltaTime > 1000) deltaTime = 1000;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deltaFrame = (deltaTime * 60) / 1000;
  
  return {
    deltaFrame, 
    deltaTime
  };
}