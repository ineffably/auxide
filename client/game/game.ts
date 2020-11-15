import { renderSurface } from './setupRenderSurface';
import { GameWorld, GameState } from './GameWorld';
import { renderer } from './worldRenderer';
import { load } from './assetLoader';
import { Spritesheet, Loader, AnimatedSprite } from 'pixi.js';
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
  loader: null as Loader,
  animatedSprites: {} as Record<string, AnimatedSprite>
}

async function init(): Promise<void> {
  const state = GameWorld.CreateState();
  localState.loader = await load(state);
  const gameWorld = new GameWorld(state);
  localState.gameWorld = gameWorld;
  gameWorld.create();
  setupClientEvents(gameWorld.state);
  requestAnimationFrame(gameloop);
}

function gameloop(timeMill) {
  const { gameWorld, spritesheets } = localState;
  const { state } = gameWorld;
  const { stage, world, terrainData: terrain } = state;
  if (stage) {
    renderer({ world, spritesheets, stage, terrain, state });
    renderSurface.render(stage);
  }
  gameWorld.update(timeMill);
  requestAnimationFrame(gameloop);
}

export {
  init
}
