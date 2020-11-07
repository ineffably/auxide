import * as PIXI from 'pixi.js';
import p2 from 'p2';
import { GameTime, GameBody } from '../types';
function metersToPixels(m) { return m * 20; }
function pixelsToMeters(p) { return p * 0.05; }

export interface GameState {
  gameWorld: GameWorld;
  stage: PIXI.Container;
  gameTime: GameTime;
  keyDownEvent?: KeyboardEvent;
  sprites: PIXI.Sprite[];
  loader: PIXI.Loader;
}

export interface CreateWorld {
  world: p2.World;
  sprites: PIXI.Sprite[];
}

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
let lastTimeMs = 0;
const rate = 1000;

export class GameWorld {
  world: p2.World;
  state: GameState;
  constructor(options: p2.WorldOptions = {gravity: [0, 0]}){
    this.world = new p2.World(options);
    this.state = {
      stage: new PIXI.Container(),
      loader: null as PIXI.Loader,
      gameTime: {} as GameTime,
      keyDownEvent: null as KeyboardEvent
    } as GameState;
    this.state.gameWorld = this;
  }

  public create(): void {
    const boxBody = new p2.Body({
      mass: 1,
      position: [-2, 10],
      angularVelocity: 2,
    }) as GameBody;
    boxBody.extra = { sprite: 'tile_205.png' }
    boxBody.addShape(new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) }));
    this.world.addBody(boxBody);

    const planeShape = new p2.Plane();
    const plane = new p2.Body({ position: [0, -10], }) as GameBody;
    plane.addShape(planeShape);
    this.world.addBody(plane);
  }

  public update(timeMill: number): void {
    let timeSinceLast = 0;
    if(timeMill !== undefined && lastTimeMs !== undefined){
        timeSinceLast = (timeMill - lastTimeMs) / rate;
    }
    this.world.step(fixedTimeStep, timeSinceLast, maxSubSteps);
    lastTimeMs = timeMill;    
  }
}

