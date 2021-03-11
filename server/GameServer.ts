import p2 from 'p2';
import { GameBody, BodyExtra } from '../types';
import Nanotimer from 'nanotimer';
// import { Game } from '../client/web/Game';

function pixelsToMeters(p) { return p * 0.05; }

interface ShapeProps {
  type: 'box' | 'plane' | 'circle';
  options?: any;
}

export interface AddGameBodyParams {
  options: p2.BodyOptions;
  extra?: BodyExtra;
  shapeProps: ShapeProps;
}

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
const rate = 1000;
const serverProps = {
  frame: 0,
  netTickRate: 60 / 1000,
  timer: window || new Nanotimer(),
  lastTimeMs: 0,
};

export class GameServer {
  private world = new p2.World({ gravity: [0, -10] })
  private timeSinceLastSend = 0;
  sendUpdates: (netPackage: string) => void;

  constructor(sendUpdates: (netPackage: string) => void) {
    this.sendUpdates = sendUpdates;
  }

  createShapeFromProps(props: ShapeProps): p2.Shape | undefined {
    const { type, options } = props;
    if(type === 'box') {
      return options ? new p2.Box(options) : new p2.Box();
    }
    if(type === 'plane') {
      return options ? new p2.Plane(options) : new p2.Plane();
    }
  }

  public create(): void {
    const { world } = this;

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 0], fixedRotation: true },
      extra: { type: 'player', character: 'prince' },
      shapeProps: { type: 'box', options: { width: pixelsToMeters(32), height: pixelsToMeters(48) } }
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-10, -1] },
      extra: { sprite: 'tile_205.png', type: 'rect' },
      shapeProps: { type: 'box', options: { width: pixelsToMeters(64), height: pixelsToMeters(64) } }
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-10, -10] },
      extra: { sprite: 'tile_205.png', type: 'rect' },
      shapeProps: { type: 'box', options: { width: pixelsToMeters(64), height: pixelsToMeters(64) } }
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-10, -15] },
      extra: { sprite: 'tile_205.png', type: 'rect'},
      shapeProps: { type: 'box', options: { width: pixelsToMeters(64), height: pixelsToMeters(64) } }
    }));

    world.addBody(this.addGameObject({
      options: { position: [100, -50] },
      extra: { type: 'plane', sprite: 'tile_331.png' },
      shapeProps: { type: 'plane' }
    }));
  }

  public start(): void {
    console.log('== start');
    this.update(Date.now());
  }

  public addGameObject({ options, extra, shapeProps }: AddGameBodyParams): GameBody {
    const body = new p2.Body(options) as GameBody;
    if (extra) {
      body.extra = extra;
    }
    if (shapeProps) {
      const shape = this.createShapeFromProps(shapeProps);
      if(shape) {
        body.addShape(shape);
      }
    }
    body.createOptions = {
      shapeProps,
      options
    }
    return body;
  }

  public update(timeMill: number): void {
    const { world } = this;
    const { lastTimeMs, netTickRate, timer } = serverProps;
    let deltaTime = 0;
    if (timeMill !== undefined && lastTimeMs !== undefined) {
      deltaTime = (timeMill - lastTimeMs) / rate;
    }
    // world.step(fixedTimeStep, deltaTime, maxSubSteps);
    world.step(fixedTimeStep);
    serverProps.lastTimeMs = timeMill;

    const timeToSend = this.timeSinceLastSend > netTickRate;
    // console.log(timeToSend);
    if (timeToSend) {
      this.sendWorldDataToClients(world);
      this.timeSinceLastSend = 0;
    }
    else {
      this.timeSinceLastSend += deltaTime;
    }
    serverProps.frame++;
    timer.setTimeout(() => this.update(Date.now()), 0);
  }

  sendWorldDataToClients(world: p2.World): void {
    const { bodies } = world;
    const removeFields = { 
      world: null, 
      bodies: null,
      aabb: null,
      previousAngle: null,
      previousPosition: null,
      inertia: null,
      vlamda: null,
      wlamda: null,
    };
    const bodiesToSend = bodies.map(body => {
      const result = Object.assign({}, body, removeFields);
      result.shapes = result.shapes.map(shape => {
        shape.body = null;
        return shape;
      })
      // console.log(result);
      return result;
    })
    // console.log(bodiesToSend[0], JSON.stringify(bodiesToSend[0]).length);
    const pack = JSON.stringify(bodiesToSend);
    this.sendPackage(pack);
  }

  sendPackage(packet: string): void {
    // console.log(packet.length);
    // console.log(packet);
    this.sendUpdates(packet);
  }
}