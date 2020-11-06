import { renderer } from './setupRendering';
import { load } from './assetLoader';
import { createWorld, updateWorld } from './world';

const state = {
  world: null,
  startY: 0
}

const clientEvents = () => {
  document.onwheel = (event) => {
    state.startY += event.deltaY;
  };
}

async function init(): Promise<void> {
  clientEvents();
  const loader = await load();
  state.world = createWorld(loader);
  requestAnimationFrame(gameloop);
}

let lastTime = Date.now();
function gameloop() {
  const now = Date.now();
  let deltaTime = now - lastTime;
  lastTime = now;
  if (deltaTime < 0) deltaTime = 0;
  if (deltaTime > 1000) deltaTime = 1000;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deltaFrame = (deltaTime * 60) / 1000;
  updateWorld(state);
  renderer.render(state.world.stage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestAnimationFrame(gameloop);
}

export {
  init
}
