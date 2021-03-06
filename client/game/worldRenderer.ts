import p2 from 'p2';
import { GameBody } from '../../types';
import { Sprite, Spritesheet, Container, IResourceDictionary, utils, Rectangle, AnimatedSprite, TilingSprite } from 'pixi.js';
import { TerrainData, GameState } from './GameWorld';
import { CharacterAnimation } from './assetLoader';

function metersToPixels(m) { return m * 20; }
// function pixelsToMeters(p) { return p * 0.05; }

interface ClientState {
  sprites: Record<string, Sprite>;
  camera: Rectangle;
  animatedSprites: Record<string, AnimatedSprite>;
}

const clientState = {
  sprites: {} as Record<string, Sprite>,
  camera: new Rectangle(0, 0, window.innerWidth, window.innerHeight),
  animatedSprites: {} as Record<string, AnimatedSprite>
} as ClientState;

export const getTexture = (name: string, spritesheets: Spritesheet[]): PIXI.Texture => {
  const sheets = spritesheets.filter(sheet => sheet && sheet.textures && sheet.textures[name]);
  return sheets[0] && sheets[0].textures[name];
}

const setSpritePosition = (sprite: Sprite | AnimatedSprite | TilingSprite, body: p2.Body, camera: PIXI.Rectangle, type?: string) => {
  sprite.position.x = -metersToPixels(body.interpolatedPosition[0]) - camera.x;
  sprite.position.y = -metersToPixels(body.interpolatedPosition[1]) - camera.y;
  sprite.rotation = body.interpolatedAngle;
}

interface GetSpriteParams {
  clientState: ClientState;
  id: number;
  sprite: string;
  stage: Container;
  sprites: Record<string, Sprite>;
  zIndex: number;
  isTiled: boolean;
}

const getSprite = ({ clientState: state, id, sprite, sprites, stage, zIndex, isTiled }: GetSpriteParams): Sprite => {
  let returnSprite = state.sprites[id];
  if (!returnSprite) {
    const texture = utils.TextureCache[sprite];
    if (texture) {
      if(isTiled) {
        returnSprite = new TilingSprite(texture);
        returnSprite.anchor.set(0);
      }
      else {
        returnSprite = new Sprite(texture);
        returnSprite.anchor.set(0.5);
      }
      returnSprite.zIndex = zIndex;
    }
    sprites[id] = returnSprite;
    stage.addChild(returnSprite);
  }
  return returnSprite;
}

const getAnimatedSprite = (
  stage: PIXI.Container, 
  clientState: ClientState, 
  character: string, 
  zIndex: number,
  direction: 'up' | 'down' | 'left' | 'right',
  animatedSpriteCashe: Record<string, CharacterAnimation>
  ): AnimatedSprite => {
    const spritekey = `${character}-${direction}`;
    let sprite = clientState.animatedSprites[spritekey];
  if (!sprite) {
    const animatedSprites = animatedSpriteCashe[character];
    Object.keys(animatedSprites).forEach(key => {
      const sprite = animatedSprites[key];
      sprite.visible = false;
      sprite.anchor.set(0.5)
      sprite.zIndex = zIndex;
      const charkey = `${character}-${key}`;
      clientState.animatedSprites[charkey] = sprite;
      stage.addChild(sprite);
    })
    sprite = clientState.animatedSprites[spritekey];
  }
  return sprite;
}

const updateCamera = (body: GameBody, camera: Rectangle) => {
  const { innerHeight, innerWidth } = window;
  camera.x = -metersToPixels(body.interpolatedPosition[0]) - (innerWidth / 2);
  camera.y = -metersToPixels(body.interpolatedPosition[1]) - (innerHeight / 2);
  camera.width = innerWidth;
  camera.height = innerHeight;
  return camera;
}

export interface RenderArgs {
  world: p2.World;
  spritesheets: Spritesheet[];
  stage: Container;
  terrain: TerrainData[];
  state: GameState;
  resources?: IResourceDictionary;
}

const getDirection = ([x, y]) => {
  const axis = [] as string[];
  axis[0] = x < 0 ? 'right' : 'left';
  axis[1] = y < 0 ? 'down' : 'up';
  return (Math.abs(x) > Math.abs(y) ? axis[0] : axis[1]) as 'up' | 'down' | 'left' | 'right';
}

export function renderer({
  world,
  spritesheets,
  stage,
  state
}: RenderArgs): void {
  if (!spritesheets) return;
  const { sprites, camera } = clientState;
  const { animations, terrainLayer } = state;
  stage.sortableChildren = true;

  world.bodies.forEach((body: GameBody) => {
    if(!body.extra) return;
    const { extra, id, velocity } = body;
    const { sprite, type, character } = extra;
    const [vx, vy] = velocity;

    if (sprite) {
      const zIndex = body.mass === 0 ? -100 : type === 'player' ? 100 : 0;
      const gameSprite = getSprite({ clientState, id, sprite, stage, sprites, zIndex, isTiled: type === 'plane' });
      if (body.mass === 0) {
        gameSprite.zIndex = -100;
      }
      if(type !== 'plane') {
        setSpritePosition(gameSprite, body, camera, type);
      }
      else {
        const tiledSprite = getSprite({ clientState, id, sprite, stage, sprites, zIndex, isTiled: true });
        tiledSprite.width = 20000;
        setSpritePosition(tiledSprite, body, camera, type);
        // tiledSprite.position.y = -camera.y - (innerHeight/2);
        console.log(body.interpolatedPosition[1], Math.floor(tiledSprite.position.y));
      }

    }

    if (character && animations) {
      const animatedSprite = getAnimatedSprite(stage, clientState, character, 100, getDirection(velocity), animations);
      ['up', 'down', 'left', 'right'].forEach(dir => {
        clientState.animatedSprites[`${character}-${dir}`].visible = false;
      })
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      animatedSprite.animationSpeed = Math.min(magnitude / 80, 0.5);
      animatedSprite.autoUpdate = true;
      animatedSprite.loop = true;
      animatedSprite.visible = true;
      animatedSprite.play();
      setSpritePosition(animatedSprite, body, camera);
    }

    if (type && type === 'player') {
      clientState.camera = updateCamera(body, camera);
    }

    terrainLayer.position.x = -camera.x - (innerWidth/2);
    terrainLayer.position.y = -camera.y - (innerHeight/2);

  })

}
