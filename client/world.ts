import * as PIXI from 'pixi.js';
import p2 from 'p2';
import { GameTime, GameBody } from '../types';

function metersToPixels(m) { return m * 20; }
function pixelsToMeters(p) { return p * 0.05; }

export interface GameState {
  world: p2.World;
  stage: PIXI.Container;
  gameTime: GameTime;
  keyDownEvent?: KeyboardEvent;
  keyUpEvent?: KeyboardEvent;
  keydown?: Record<string, KeyboardEvent>;
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

interface addGameObjectParams {
  options: p2.BodyOptions;
  extra?: any;
  shape?: p2.Shape;
}

export class GameWorld {
  state: GameState;
  constructor(options: p2.WorldOptions = { gravity: [0, 0] }) {
    this.state = {
      world: new p2.World(options),
      stage: new PIXI.Container(),
      loader: null as PIXI.Loader,
      gameTime: {} as GameTime,
      keydown: {} as Record<string, KeyboardEvent>,
      keyDownEvent: null as KeyboardEvent,
      keyUpEvent: null as KeyboardEvent
    } as GameState;
  }

  public addGameObject({ options, extra, shape }: addGameObjectParams): GameBody {
    const body = new p2.Body(options) as GameBody;
    if (extra) {
      body.extra = extra;
    }
    if (shape) {
      body.addShape(shape);
    }
    return body;
  }

  public create(): void {
    const { world } = this.state;

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 0] },
      extra: { sprite: 'survivor1_stand.png', type: 'player' },
      shape: new p2.Circle({ radius: pixelsToMeters(16) })
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 6] },
      extra: { sprite: 'tile_205.png' },
      shape: new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) })
    }));

    world.addBody(this.addGameObject({
      options: { mass: 0, position: [3, 7], collisionResponse: false },
      extra: { sprite: 'image-21-5' },
      shape: new p2.Box({ width: pixelsToMeters(16), height: pixelsToMeters(16) })
    }));

    world.addBody(this.addGameObject({
      options: { position: [0, -10] },
      shape: new p2.Plane()
    }))
  }

  public setupControls(player: p2.Body, keydown: Record<string, KeyboardEvent>): void {
    player.angularVelocity = 0;
    player.damping = 0.8
    const speed = 30;
    const turnSpeed = 4;
    const keys = Object.keys(keydown);
    if (keys.includes('down')) {
      player.applyForceLocal([speed, 0]);
    }
    if (keys.includes('up')) {
      player.applyForceLocal([-speed, 0]);
    }
    if (keys.includes('right')) {
      player.angularVelocity = turnSpeed;
    }
    if (keys.includes('left')) {
      player.angularVelocity = -turnSpeed;
    }
  }

  public update(timeMill: number): void {
    const { world, keydown } = this.state;
    const [player] = world.bodies.filter((body: GameBody) => body.extra && body.extra.type && body.extra.type === 'player');
    if (player) {
      this.setupControls(player, keydown);
    }
    let timeSinceLast = 0;
    if (timeMill !== undefined && lastTimeMs !== undefined) {
      timeSinceLast = (timeMill - lastTimeMs) / rate;
    }
    world.step(fixedTimeStep, timeSinceLast, maxSubSteps);
    lastTimeMs = timeMill;
  }
}


