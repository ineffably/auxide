import * as PIXI from 'pixi.js';
import p2 from 'p2';
import { GameTime, GameBody } from '../../types';
import { generateTerrain } from './terrain';
import { CharacterAnimation } from './assetLoader';

// function metersToPixels(m) { return m * 20; }
function pixelsToMeters(p) { return p * 0.05; }

export interface TerrainData {
  pos: number[];
  tile: string;
}

export interface GameState {
  world: p2.World;
  stage: PIXI.Container;
  terrainLayer?: PIXI.Container;
  gameTime: GameTime;
  keyDownEvent?: KeyboardEvent;
  keyUpEvent?: KeyboardEvent;
  keydown?: Record<string, KeyboardEvent>;
  sprites: PIXI.Sprite[];
  loader: PIXI.Loader;
  terrainData: TerrainData[];
  animations?: Record<string, CharacterAnimation>
}

export interface CreateWorld {
  world: p2.World;
  sprites: PIXI.Sprite[];
}

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
let lastTimeMs = 0;
const rate = 1000;

interface Extra {
  sprite?: string;
  type?: string;
  character?: string;
}

interface addGameObjectParams {
  options: p2.BodyOptions;
  extra?: Extra;
  shape?: p2.Shape;
}

const terraNames = [
  'terrain-21-5',
  'terrain-22-5',
  'terrain-23-5'
]

export class GameWorld {
  public state: GameState;
  constructor(prevState: GameState, options: p2.WorldOptions = { gravity: [0, 0] }) {
    const width = 1000, height = 1000;
    this.state = prevState || GameWorld.CreateState(options);
    const place = { col: 0, row: 0 };
    this.state.terrainData = generateTerrain(width, height).data.map((value, index) => {
      const getTerrain = (n: number, i: number) => {
        if (i % 1000 === 0) {
          place.row++;
          place.col = 0;
        }

        return {
          pos: [place.col++, place.row],
          tile: terraNames[n]
        } as TerrainData;
      }

      return getTerrain(value, index);
    })
  }

  public static CreateState(options: p2.WorldOptions = { gravity: [0, 0] }): GameState {
    const state = {
      world: new p2.World(options),
      stage: new PIXI.Container(),
      terrainLayer: new PIXI.Container(),
      loader: null as PIXI.Loader,
      gameTime: {} as GameTime,
      keydown: {} as Record<string, KeyboardEvent>,
      keyDownEvent: null as KeyboardEvent,
      keyUpEvent: null as KeyboardEvent,
      terrainData: [] as TerrainData[],
      animations: {} as Record<string, CharacterAnimation>
    } as GameState;
    return state;
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
    const { world, terrainLayer, terrainData, stage } = this.state;
    const { innerWidth, innerHeight } = window;
    const o = {
      x: innerWidth + 1,
      y: innerHeight + 1
    };
    
    const r = new PIXI.Rectangle(0, 0, o.x, o.y);
    terrainData.forEach(({ tile, pos }) => {
      const [x, y] = pos;
      if (r.contains(x*32, y*32)) {
        const texture = PIXI.utils.TextureCache[tile] as PIXI.Texture;
        const sprite = PIXI.Sprite.from(texture);
        sprite.position.x = x * 32;
        sprite.position.y = y * 32;
        terrainLayer.addChild(sprite);
      }
    });

    stage.addChild(terrainLayer);

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 0], fixedRotation: true },
      extra: { type: 'player', character: 'prince' },
      shape: new p2.Box({ width: pixelsToMeters(32), height: pixelsToMeters(48) })
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 6] },
      extra: { sprite: 'tile_205.png' },
      shape: new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) })
    }));

    // world.addBody(this.addGameObject({
    //   options: { mass: 0, position: [3, 7], collisionResponse: false },
    //   extra: { sprite: 'terrain-21-5' },
    //   shape: new p2.Box({ width: pixelsToMeters(16), height: pixelsToMeters(16) })
    // }));

    world.addBody(this.addGameObject({
      options: { position: [0, -10] },
      shape: new p2.Plane()
    }))
  }

  public playerControls(player: p2.Body, keydown: Record<string, KeyboardEvent>): void {
    player.angularVelocity = 0;
    player.damping = 0.8
    const speed = 30;
    // const turnSpeed = 4;
    
    const keys = Object.keys(keydown);
    if (keys.includes('down')) {
      player.applyForceLocal([0, -speed]);
    }
    if (keys.includes('up')) {
      player.applyForceLocal([0, speed]);
    }
    if (keys.includes('right')) {
      player.applyForceLocal([-speed, 0]);
    }
    if (keys.includes('left')) {
      player.applyForceLocal([speed, 0]);
    }

    // if (keys.includes('right')) {
    //   player.angularVelocity = turnSpeed;
    // }
    // if (keys.includes('left')) {
    //   player.angularVelocity = -turnSpeed;
    // }
  }

  public update(timeMill: number): void {
    const { world, keydown } = this.state;
    const [player] = world.bodies.filter((body: GameBody) => body.extra && body.extra.type === 'player');
    if (player) {
      this.playerControls(player, keydown);
    }
    let timeSinceLast = 0;
    if (timeMill !== undefined && lastTimeMs !== undefined) {
      timeSinceLast = (timeMill - lastTimeMs) / rate;
    }
    world.step(fixedTimeStep, timeSinceLast, maxSubSteps);
    lastTimeMs = timeMill;
  }
}


