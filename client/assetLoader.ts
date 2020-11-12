import * as PIXI from 'pixi.js';
import { SpriteSheet } from '../types';
const loader = PIXI.Loader.shared;

export const load = async (): Promise<PIXI.Loader> => {
  return new Promise(resolve => {
    loader
      .add('terrain', './assets/terrain_atlas.png')
      .add("topdown", "./assets/topdown.json", { crossOrigin: "anonymous" })
      .load();

    const spritesheetJSON = {
      frames: {}
    } as SpriteSheet;

    const hCells = 32;
    const rows = 32;
    const cols = 32;
    loader.onComplete.add(() => {
      console.log('loader.onComplete');
      for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
          spritesheetJSON.frames[`image-${x}-${y}`] = {
            frame: { "x": x * hCells, "y": y * hCells, "w": hCells, "h": hCells },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { "x": 0, "y": 0, "w": hCells, "h": hCells },
            sourceSize: { "w": hCells, "h": hCells }
          }
        }
      }

      spritesheetJSON.meta = {
        "size": {"w":1024,"h":1024}
      }
      const spritesheet = new PIXI.Spritesheet(loader.resources['terrain'].texture, spritesheetJSON);
      // PIXI.Texture.addToCache(spritesheet, 'land');
      spritesheet.parse(() => {
        const all = Object.entries(spritesheet.textures) as [string, PIXI.Texture][];
        all.forEach(([name, texture]) => {
          if(!PIXI.utils.TextureCache[name]){
            PIXI.Texture.addToCache(texture, name);
          }
        })
        resolve(loader)
      });
    })
  });
};


