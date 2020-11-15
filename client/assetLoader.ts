import * as PIXI from 'pixi.js';
import { SpriteSheet } from '../types';
import { GameState } from './GameWorld';
const loader = PIXI.Loader.shared;

export interface spriteSheetJSONParams {
  hCell: number;
  vCell?: number;
  rows: number;
  cols: number;
  width: number;
  height?: number;
  prefix?: string;
}

export interface CharacterAnimation {
  down: PIXI.AnimatedSprite;
  left: PIXI.AnimatedSprite;
  right: PIXI.AnimatedSprite;
  up: PIXI.AnimatedSprite;
}

export const generateSpritesheetJSON = ({
  hCell,
  vCell,
  rows,
  cols,
  width,
  height,
  prefix,
}: spriteSheetJSONParams): SpriteSheet => {
  if (!vCell) { vCell = hCell; }
  if (!height) { height = width; }

  const spritesheetJSON = {
    frames: {},
    meta: {
      "size": { "w": 1024, "h": 1024 }
    }
  } as SpriteSheet;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      spritesheetJSON.frames[`${prefix}-${x}-${y}`] = {
        frame: { "x": x * hCell, "y": y * vCell, "w": hCell, "h": vCell },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { "x": 0, "y": 0, "w": hCell, "h": vCell },
        sourceSize: { "w": hCell, "h": vCell }
      }
    }
  }

  return spritesheetJSON;
}

const cacheTexturesFromSpritesheet = async (spritesheet: PIXI.Spritesheet) => {
  return new Promise(resolve => {
    spritesheet.parse(() => {
      const all = Object.entries(spritesheet.textures) as [string, PIXI.Texture][];
      all.forEach(([name, texture]) => {
        if (!PIXI.utils.TextureCache[name]) {
          PIXI.Texture.addToCache(texture, name);
        }
      })
      resolve(all);
    });
  })
};


const createCharacterAnimations = (character: string): CharacterAnimation => {
  const getTexture = name => PIXI.utils.TextureCache[name] as PIXI.Texture;
  const getAnimatedSprite = (character: string, row: number, count = 4) => {
    const textures = [] as string[];
    let col = 0;
    while(col < count){
      textures.push(`${character}-${col}-${row}`)
      col++;
    }
    return new PIXI.AnimatedSprite(textures.map(getTexture));
  }
  const down = getAnimatedSprite(character, 0, 4);
  const left = getAnimatedSprite(character, 1, 4);
  const right = getAnimatedSprite(character, 2, 4);
  const up = getAnimatedSprite(character, 3, 4);
  return{
    down,
    left,
    right,
    up
  }
}

export const load = async (state: GameState): Promise<PIXI.Loader> => {
  return new Promise(resolve => {
  loader
    .add('terrain', './assets/terrain_atlas.png')
    .add('arabianboy', './assets/characters/arabianboy.png')
    .add('prince', './assets/characters/prince.png')
    .add('gothloli1', './assets/characters/gothloli1.png')
    .add('randomgirl', './assets/characters/randomgirl.png')
    .add("topdown", "./assets/topdown.json", { crossOrigin: "anonymous" })
    .load(async () => {
      const sheetParams = {
        hCell: 32, cols: 32, rows: 32, width: 1024, height: 1024, prefix: 'terrain'
      };
      const { texture } = loader.resources['terrain'];
      texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      const spritesheet = new PIXI.Spritesheet(
        texture,
        generateSpritesheetJSON(sheetParams)
      );
      await cacheTexturesFromSpritesheet(spritesheet);

      const characters = [
        'arabianboy',
        'prince',
        'randomgirl',
        'gothloli1'
      ]
      await Promise.all(characters.map(async (character) => {
        const params = {
          hCell: 32, vCell: 48, cols: 4, rows: 4, width: 128, height: 192, prefix: character
        }
        const { texture } = loader.resources[character];
        const spritesheet = new PIXI.Spritesheet(
          texture,
          generateSpritesheetJSON(params)
        );
        await cacheTexturesFromSpritesheet(spritesheet);
        state.animations[character] = createCharacterAnimations(character);
      }))
      resolve(loader);
    });
  });
};


