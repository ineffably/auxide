import p2 from 'p2';
import { GameBody } from '../types';
import { Sprite, Spritesheet, Container } from 'pixi.js';

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

export interface RenderArgs {
  world: p2.World;
  spritesheet: Spritesheet;
  stage: Container;
}

export const renderer = ({
  world,
  spritesheet,
  stage
}: RenderArgs): void => {
  const { sprites } = clientState;
  
  world.bodies.forEach((body: GameBody) => {
    const { extra, id } = body;
    if(!extra) return;
    const { sprite } = extra;
    const { textures } = spritesheet;
    
    if(sprite){
      let gameSprite = clientState.sprites[id];
      if(!gameSprite) {
        gameSprite = new Sprite(textures[sprite]);
        gameSprite.anchor.set(0.5);

        if(gameSprite){
          sprites[id] = gameSprite;
          stage.addChild(gameSprite);
        }
      }
      setSpritePosition(gameSprite, body);
    }
  })
}
