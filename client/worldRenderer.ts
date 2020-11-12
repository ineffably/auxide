import p2 from 'p2';
import { GameBody } from '../types';
import { Sprite, Spritesheet, Container, IResourceDictionary, utils } from 'pixi.js';

function metersToPixels(m) { return m * 20; }
function pixelsToMeters(p) { return p * 0.05; }

const clientState = {
  sprites: {} as Record<string, Sprite>
};

const setSpritePosition = (sprite: Sprite, body: p2.Body) => {
  sprite.position.x = -metersToPixels(body.interpolatedPosition[0]) + 400;
  sprite.position.y = -metersToPixels(body.interpolatedPosition[1]) + 200;
  sprite.rotation = body.interpolatedAngle;
}

export const getTexture = (name: string, spritesheets: Spritesheet[]): PIXI.Texture => {
  const sheets = spritesheets.filter(sheet => sheet && sheet.textures && sheet.textures[name]);
  return sheets[0] && sheets[0].textures[name];
}

export interface RenderArgs {
  world: p2.World;
  spritesheets: Spritesheet[];
  stage: Container;
  resources: IResourceDictionary;
}

export const renderer = ({
  world,
  spritesheets,
  stage,
  resources
}: RenderArgs): void => {
  const { sprites } = clientState;
  if (!spritesheets) return;

  world.bodies.forEach((body: GameBody) => {
    const { extra, id } = body;
    if (!extra) return;
    const { sprite } = extra as { sprite: string; };

    if (sprite) {
      let gameSprite = clientState.sprites[id];
      if (!gameSprite) {
        gameSprite = new Sprite(utils.TextureCache[sprite]);
        gameSprite.anchor.set(0.5);
        if (gameSprite) {
          sprites[id] = gameSprite;
          stage.addChild(gameSprite);
        }
      }
      setSpritePosition(gameSprite, body);
    }
  })
}
