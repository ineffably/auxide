import { renderer } from './setupRendering';
import { load } from './assetLoader';
import { createWorld, updateWorld, state, stage } from './world';

const clientEvents = () => {
  // document.onwheel = (event) => {
  //   state.startY += event.deltaY;
  // };
  document.onkeydown = (event) => {
    state.keyDownEvent = event;
  };
}

async function init(): Promise<void> {
  clientEvents();
  console.log('loader-start');
  const loader = await load();
  console.log('loader-end');
  const { world, sprites } = createWorld(loader);
  state.world = world;
  state.sprites = sprites;
  requestAnimationFrame(gameloop);
}

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
let lastTimeMilliseconds = 0;
function gameloop(timeMilliseconds) {
  let timeSinceLastCall = 0;
  if(timeMilliseconds !== undefined && lastTimeMilliseconds !== undefined){
      timeSinceLastCall = (timeMilliseconds - lastTimeMilliseconds) / 1000;
  }
  state.world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
  lastTimeMilliseconds = timeMilliseconds;

  updateWorld(state);
  if(stage){
    renderer.render(stage);
  }
  requestAnimationFrame(gameloop);
}

export {
  init
}
