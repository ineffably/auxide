import * as PIXI from 'pixi.js';
import p2, { Body } from 'p2';
import { GameTime, GameBody, AddGameObjectParams } from '../../types';
import { generateTerrain } from './terrain';
import { CharacterAnimation } from './assetLoader';
import { GameServer } from '../../server/GameServer'
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
  terrainData?: TerrainData[];
  animations?: Record<string, CharacterAnimation>;
  localServer?: GameServer;
  idMap?: Record<number, number>;
}

export interface CreateWorld {
  world: p2.World;
  sprites: PIXI.Sprite[];
}

export interface WorldOptions extends p2.WorldOptions {
  localServer?: GameServer;
}

const terraNames = [
  'terrain-21-5',
  'terrain-22-5',
  'terrain-23-5'
];

const generateTerrainData = () => {
  const place = { col: 0, row: 0 };
  const width = 1000, height = 1000;

  return generateTerrain(width, height).data.map((value, index) => {
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

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
let lastTimeMs = 0;
const rate = 1000;

export class GameWorld {
  static updateWorld: any;

  public updateWorld(worldData: string): void {
    // console.log(worldData);
  }

  public state: GameState;
  constructor(prevState: GameState, options: WorldOptions = { gravity: [0, -10] }) {
    console.log('-- GameWorld Instantiated');
    this.state = prevState || GameWorld.CreateState(options);
    this.state.localServer = new GameServer((packet: string) => {
      this.incomingUpdate(packet);
    }); // local server with an updater hook
  }

  public static CreateState(options: WorldOptions = { gravity: [0, -10] }): GameState {
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

  public addGameObject({ options, extraprops, shape }: AddGameObjectParams): GameBody {
    const body = new p2.Body(options) as GameBody;
    if (extraprops) {
      body.extra = extraprops;
    }
    if (shape) {
      body.addShape(shape);
    }
    return body;
  }

  public create(): void {
    console.log('-- create');
    const { terrainLayer, terrainData, stage, localServer } = this.state;
    const { innerWidth, innerHeight } = window;
    const o = {
      x: innerWidth + 1,
      y: innerHeight + 1
    };

    if (terrainData) {
      const r = new PIXI.Rectangle(0, 0, o.x, o.y);
      terrainData.forEach(({ tile, pos }) => {
        const [x, y] = pos;
        if (r.contains(x * 32, y * 32)) {
          const texture = PIXI.utils.TextureCache[tile] as PIXI.Texture;
          const sprite = PIXI.Sprite.from(texture);
          sprite.position.x = x * 32;
          sprite.position.y = y * 32;
          terrainLayer.addChild(sprite);
        }
      });
      stage.addChild(terrainLayer);
    }

    localServer.create();
    localServer.start();
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

  public incomingUpdate(packet: string): void {
    try {
      const bodies = JSON.parse(packet);
      if (bodies) {
        this.consumeIncomingUpdates(bodies as GameBody[])
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  public createBody(incomingBody: GameBody): GameBody {
    // console.log('velocity', body.velocity);
    const { extra } = incomingBody;
    const { options, shapeProps } = incomingBody.createOptions;
    options.id = incomingBody.id;
    console.log('=== createBody', incomingBody.shapes[0]);
    const body = new p2.Body(options) as GameBody;
    if (extra) {
      body.extra = extra;
    }
    if (shapeProps) {
      const shapeOptions = shapeProps.options;
      if(shapeProps.type === 'box') {
        const bodyShape = shapeOptions ? new p2.Box(shapeOptions) : new p2.Box();
        body.addShape(bodyShape);
      }
      if(shapeProps.type === 'plane') {
        const bodyShape = shapeOptions ? new p2.Plane(shapeOptions) : new p2.Plane();
        body.addShape(bodyShape);
      }
    }
    return body;
  }

  public updateBody(targetBody: GameBody, body: GameBody): GameBody {
    // console.log('updatebody');
    const { velocity, position } = body;
    targetBody.velocity = [velocity[0], velocity[1]];
    targetBody.position = [position[0], position[1]];
    targetBody.angle = body.angle;
    targetBody.angularVelocity = body.angularVelocity;
    targetBody.angularDamping = body.angularDamping;
    targetBody.angularForce = body.angularForce;
    targetBody.damping = body.damping;
    // targetBody.type = body.type;
    // targetBody.extra = body.extra;
    return targetBody;
  }

  public consumeIncomingUpdates(bodies: GameBody[]): void  {
    const { world } = this.state;
    const findBody = (gameBody: GameBody) => {
      const result = world.bodies.filter(body => {
        return body.id === gameBody.id;
      });
      return result.length > 0 ? result[0] : null;
    }

    bodies.forEach(body => {
      const clientBody = findBody(body);
      if(clientBody) {
        this.updateBody(clientBody, body);
      }
      else {
        const incomingBody = this.createBody(body);
        world.addBody(incomingBody);
        console.log('incomingBody', incomingBody.id);
      }
    });
  }
}


