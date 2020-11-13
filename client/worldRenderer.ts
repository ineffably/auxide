import p2 from 'p2';
import { GameBody } from '../types';
import { Sprite, Spritesheet, Container, IResourceDictionary, utils, Rectangle, Extract } from 'pixi.js';
import { TerrainData } from './world';

function metersToPixels(m) { return m * 20; }
function pixelsToMeters(p) { return p * 0.05; }

const clientState = {
  sprites: {} as Record<string, Sprite>,
  camera: new Rectangle(0, 0, window.innerWidth, window.innerHeight)
};

export const getTexture = (name: string, spritesheets: Spritesheet[]): PIXI.Texture => {
  const sheets = spritesheets.filter(sheet => sheet && sheet.textures && sheet.textures[name]);
  return sheets[0] && sheets[0].textures[name];
}

export interface RenderArgs {
  world: p2.World;
  spritesheets: Spritesheet[];
  stage: Container;
  resources: IResourceDictionary;
  terrain: TerrainData[][];
}

const setSpritePosition = (sprite: Sprite, body: p2.Body, camera: PIXI.Rectangle) => {
  sprite.position.x = -metersToPixels(body.interpolatedPosition[0]) - camera.x;
  sprite.position.y = -metersToPixels(body.interpolatedPosition[1]) - camera.y;
  sprite.rotation = body.interpolatedAngle;
}

interface GetSpriteParams {
  state: typeof clientState;
  id: number;
  sprite: string;
  stage: Container;
  sprites: Record<string, Sprite>;
  zIndex: number;
}

const getSprite = ({ state, id, sprite, sprites, stage, zIndex }: GetSpriteParams) => {
  let returnSprite = state.sprites[id];
  if (!returnSprite) {
    const texture = utils.TextureCache[sprite];
    if(texture){
      returnSprite = new Sprite(texture);
      returnSprite.anchor.set(0.5);
      returnSprite.zIndex = zIndex;
    }
    sprites[id] = returnSprite;
    stage.addChild(returnSprite);    
  }
  return returnSprite;
}

const updateCamera = (body: GameBody, camera: Rectangle) => {
  const { innerHeight, innerWidth } = window;
  camera.x = -metersToPixels(body.interpolatedPosition[0]) - (innerWidth / 2);
  camera.y = -metersToPixels(body.interpolatedPosition[1]) - (innerHeight / 2);
  camera.width = innerWidth;
  camera.height = innerHeight;
  return camera;
}

export const renderer = ({
  world,
  spritesheets,
  stage,
  resources
}: RenderArgs): void => {
  const { sprites, camera } = clientState;
  if (!spritesheets) return;
  stage.sortableChildren = true;
  world.bodies.forEach((body: GameBody) => {
    const { extra, id } = body;
    if (!extra) return;
    const { sprite, type } = extra;
    if (sprite) {
      const zIndex = body.mass === 0 ? -100 : type === 'player' ? 100 : 0;
      const gameSprite = getSprite({ state: clientState, id, sprite, stage, sprites, zIndex });
      if(body.mass === 0){
        gameSprite.zIndex = -100;
      }
      if(type === 'player'){
        clientState.camera = updateCamera(body, camera);
      }
      setSpritePosition(gameSprite, body, camera);
    }
  })
}
