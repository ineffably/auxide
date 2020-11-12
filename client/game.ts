import { renderSurface } from './setupRenderSurface';
import { GameWorld, GameState } from './world';
import { renderer } from './worldRenderer';
import { load } from './assetLoader';
import { Spritesheet, Loader } from 'pixi.js';
import keycode from 'keycode';
  
const setupClientEvents = (state: GameState) => {
  // document.onwheel = (event) => {
  //   state.startY += event.deltaY;
  // };
  
  document.onkeydown = (event) => {
    const key = keycode(event);
    state.keyDownEvent = event;
    state.keyUpEvent = null;
    state.keydown[key] = event;
  };

  document.onkeyup = (event) => {
    const key = keycode(event);
    state.keyUpEvent = event;
    state.keyDownEvent = null;
    delete state.keydown[key];
  };
}

const localState = {
  gameWorld: null as GameWorld,
  spritesheets: [] as Spritesheet[],
  loader: null as Loader
}

async function init(): Promise<void> {
  localState.loader = await load();
  const gameWorld = new GameWorld();
  localState.gameWorld = gameWorld;
  gameWorld.create();
  setupClientEvents(gameWorld.state);
  requestAnimationFrame(gameloop);
}

function gameloop(timeMill) {
  const { gameWorld, spritesheets, loader } = localState;
  const { state } = gameWorld;
  const { stage, world } = state;
  const { resources } = loader;
  if(stage){
    renderer({world, spritesheets, stage, resources});
    renderSurface.render(stage);
  }
  gameWorld.update(timeMill)
  requestAnimationFrame(gameloop);
}

export {
  init
}
