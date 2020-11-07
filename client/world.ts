
import * as PIXI from 'pixi.js';
import p2, { World } from 'p2';
import { GameTime } from '../types';
// const { World, Body, Box, Plane } = p2;
const bodies = {} as Record<string, p2.Body>;
function metersToPixels(m) { return m * 20; }
function pixelsToMeters(p) { return p * 0.05; }

export interface GameState {
  world: World;
  stage: PIXI.Container;
  gameTime: GameTime;
  keyDownEvent?: KeyboardEvent;
  sprites: PIXI.Sprite[];
}

export interface CreateWorld {
  world: p2.World;
  sprites: PIXI.Sprite[];
}

const state = {
  world: null as p2.World,
  stage: new PIXI.Container(),
  gameTime: {} as GameTime,
  keyDownEvent: null as KeyboardEvent
} as GameState;

const stage = new PIXI.Container();
const createWorld = (loader: PIXI.Loader): CreateWorld => {
  const sprites = [] as PIXI.Sprite[];
  
  const { spritesheet } = loader.resources["topdown"];
  if (spritesheet) {
    const { textures } = spritesheet;
    const addSprite = (name, tile) => {
      const sprite = new PIXI.Sprite(textures[tile]);
      sprite.anchor.set(0.5);
      if(sprite){
        sprite.name = name;
      }
      stage.addChild(sprite);
      sprites.push(sprite);
      return sprite;
    }
    addSprite('box1', 'tile_205.png');
    addSprite('box2', 'tile_205.png');
    addSprite('box3', 'tile_205.png');
  }
  const world = new p2.World({
    gravity: [0, -10]
  });
  // world.solver = new Solver({ tolerance: 0.01 });
  
  const boxBody = new p2.Body({
    mass: 1,
    position: [-2, 10]
  });
  boxBody.sprite = sprites[0];
  boxBody.addShape(new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) }));
  world.addBody(boxBody);
  
  const boxBody2 = new p2.Body({
    mass: 1,
    position: [1, 6]
  });
  boxBody2.sprite = sprites[1];
  boxBody2.addShape(new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) }));
  world.addBody(boxBody2);
  

  // Create ground
  const planeShape = new p2.Plane();
  const plane = new p2.Body({ position: [0, -10], });
  plane.addShape(planeShape);
  world.addBody(plane);

  // const box3 = new p2.Body({ mass:1, position:[0, 12], angularVelocity:1 });
  // box3.addShape(new p2.Box({ width: 2, height: 1 }))
  // world.addBody(box3);

  bodies['box1'] = boxBody;
  bodies['box2'] = boxBody2;
  // bodies['box3'] = box3;

  console.log(world);
  return {
    world,
    sprites
  };
}

const updateWorld = (state: GameState): void => {
  const setSpritePosition = (sprite: PIXI.Sprite, body: p2.Body) => {
    // sprite.position.x = body.interpolatedPosition[0];
    // sprite.position.y = body.interpolatedPosition[1];
    // console.log('position', sprite.position);
    sprite.position.x = -metersToPixels(body.interpolatedPosition[0]) + 400;
    sprite.position.y = -metersToPixels(body.interpolatedPosition[1]) + 200;
    sprite.rotation = body.interpolatedAngle;
  }
  const box1 = state.sprites.find(sprite => sprite.name === 'box1');
  const box2 = state.sprites.find(sprite => sprite.name === 'box2');
  // const box3 = state.sprites.find(sprite => sprite.name === 'box3');
  setSpritePosition(box1, bodies['box1']);
  setSpritePosition(box2, bodies['box2']);
  // setSpritePosition(box3, bodies['box3']);
}

console.log(-metersToPixels(400));

export { 
  createWorld,
  updateWorld,
  stage,
  state
}


// // These values can be anything you want, it doesn't matter as long as you use
// // the same ones throughout your app
// function metersToPixels(m) { return m * 20; }
// function pixelsToMeters(p) { return p * 0.05; }

// // When you add something to the physics world, just create a body and store the sprite for later
// function addPhysicsBody(sprite)
// {
//     const body = new p2.Body({
//         x: -pixelsToMeters(sprite.position.x),
//         y: -pixelsToMeters(sprite.position.y),
//         width: pixelsToMeters(sprite.width),
//         height: pixelsToMeters(sprite.height),
//     });
//     body.sprite = sprite;
//     physicsWorld.addBody(body);
// }

// // When you update physics, go through each body and update the rendering
// function updatePhysics(dt)
// {
//     physicsWorld.step(dt);
//     foreach(body in physicsWorld.bodies)
//     {
//         body.sprite.position.x = -metersToPixels(body.x);
//         body.sprite.position.y = -metersToPixels(body.y);
//     }
// }

