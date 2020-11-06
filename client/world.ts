
import * as PIXI from 'pixi.js';
import { SpriteEntry } from '../types';

export interface World {
  stage: PIXI.Container;
  sprites: SpriteEntry[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createWorld = (loader: PIXI.Loader): World => {
  const stage = new PIXI.Container();
  const { spritesheet } = loader.resources["topdown"];
  const world = {
    sprites: [] as SpriteEntry[],
    stage
  };
  if (spritesheet) {
    const { textures } = spritesheet;
    Object.keys(textures).forEach((name, i) => {
      const sprite = new PIXI.Sprite(textures[name]);
      const text = new PIXI.Text(name, { fill: 0xffffff, fontSize: 24 });
      text.position.x = 74;
      world.sprites.push({ sprite, name, text });
      stage.addChild(text);
      stage.addChild(sprite);
    });
  }
  return world;
}

export const updateWorld = ({world, startY}:{world: World, startY: number}): void => {
  const { sprites } = world;
  sprites.forEach(({ sprite, text }, i) => {
    sprite.position.y = 64 * i + startY;
    text.position.y = 64 * i + startY + 10;
  });
}

