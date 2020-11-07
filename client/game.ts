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
  const loader = await load();
  const { world, sprites } = createWorld(loader);
  state.world = world;
  state.sprites = sprites;
  requestAnimationFrame(gameloop);
}

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
let lastTimeMs = 0;
const rate = 1000;
function gameloop(timeMill) {
  let timeSinceLast = 0;
  if(timeMill !== undefined && lastTimeMs !== undefined){
      timeSinceLast = (timeMill - lastTimeMs) / rate;
  }
  state.world.step(fixedTimeStep, timeSinceLast, maxSubSteps);
  lastTimeMs = timeMill;

  updateWorld(state);
  if(stage){
    renderer.render(stage);
  }
  requestAnimationFrame(gameloop);
}

export {
  init
}
