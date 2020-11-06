
import { Container, Loader, TilingSprite, Sprite }  from 'pixi.js';
import { SpriteEntry, GameTime } from '../types';
// import keycode from 'keycode';

export interface GameState {
  world: World;
  player: Sprite;
  startY?: number;
  gameTime?: GameTime;
  keyDownEvent?: KeyboardEvent;
}

export const state = {
  world: null as World,
  startY: 0,
  gameTime: {} as GameTime,
  player: new Sprite(),
  keyDownEvent: null as KeyboardEvent
} as GameState;

export const updateWorld = ({world, startY, player, keyDownEvent}: GameState): void => {
  if(keyDownEvent){
    // const key = keycode(keyDownEvent);
  }
}

export interface World {
  stage: Container;
  sprites: SpriteEntry[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createWorld = (loader: Loader): World => {
  const stage = new Container();
  const { spritesheet } = loader.resources["topdown"];
  const world = {
    sprites: [] as SpriteEntry[],
    stage
  };
  if (spritesheet) {
    const { textures } = spritesheet;
    const tilesprite = new TilingSprite(textures['tile_01.png'], 2048, 768 * 2);
    stage.addChild(tilesprite);
    const player = new Sprite(textures['survivor1_stand.png']);
    player.name = 'player';
    
    stage.addChild(player);

    //   const sprite = new PIXI.Sprite(textures[name]);
    //   const text = new PIXI.Text(name, { fill: 0xffffff, fontSize: 24 });
  }
  return world;
}

