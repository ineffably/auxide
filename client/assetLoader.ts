import * as PIXI from 'pixi.js';
const loader = new PIXI.Loader();

export const load = async (): Promise<PIXI.Loader> => {
  return new Promise(resolve => {
    loader
      .add("topdown", "./assets/topdown.json", { crossOrigin: "anonymous" })
      .load(() => resolve(loader));
  });
};
