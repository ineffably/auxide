import { renderSurface } from './setupRenderSurface';
import { GameWorld, GameState } from './world';
import { renderer } from './worldRenderer';
import { load } from './assetLoader';
import { Spritesheet } from 'pixi.js';

const setupClientEvents = (state: GameState) => {
  // document.onwheel = (event) => {
  //   state.startY += event.deltaY;
  // };
  document.onkeydown = (event) => {
    state.keyDownEvent = event;
  };
}

const localState = {
  gameWorld: null as GameWorld,
  spritesheet: null as Spritesheet
}

async function init(): Promise<void> {
  const loader = await load();
  const { spritesheet } = loader.resources['topdown'];
  const gameWorld = new GameWorld({gravity: [0, -4]});
  localState.gameWorld = gameWorld;
  localState.spritesheet = spritesheet;
  gameWorld.create();
  setupClientEvents(gameWorld.state);
  requestAnimationFrame(gameloop);
}

function gameloop(timeMill) {
  const { gameWorld, spritesheet } = localState;
  const { state, world } = gameWorld;
  const { stage } = state;

  if(stage){
    renderer({world, spritesheet, stage});
    renderSurface.render(stage);
  }
  gameWorld.update(timeMill)
  requestAnimationFrame(gameloop);
}

export {
  init
}
