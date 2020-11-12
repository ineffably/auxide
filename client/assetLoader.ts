import * as PIXI from 'pixi.js';
import { SpriteSheet } from '../types';
const loader = PIXI.Loader.shared;

export interface spriteSheetJSONParams {
  hCell: number;
  vCell?: number;
  rows: number;
  cols: number;
  width: number;
  height?: number;
}

export const generateSpritesheetJSON = ({ 
  hCell, 
  vCell, 
  rows, 
  cols, 
  width, 
  height
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
      spritesheetJSON.frames[`image-${x}-${y}`] = {
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

export const load = async (): Promise<PIXI.Loader> => {
  return new Promise(resolve => {
    loader
      .add('terrain', './assets/terrain_atlas.png')
      .add("topdown", "./assets/topdown.json", { crossOrigin: "anonymous" })
      .load(() => {
        const sheetParams = {
          hCell: 32, cols: 32, rows: 32, width: 1024, height: 1024
        }
        const { texture } = loader.resources['terrain'];
        const spritesheet = new PIXI.Spritesheet(
          texture, 
          generateSpritesheetJSON(sheetParams)
        );
    
        spritesheet.parse(() => {
          const all = Object.entries(spritesheet.textures) as [string, PIXI.Texture][];
          all.forEach(([name, texture]) => {
            if (!PIXI.utils.TextureCache[name]) {
              PIXI.Texture.addToCache(texture, name);
            }
          })
          resolve(loader)
        });
      });
  })
};


