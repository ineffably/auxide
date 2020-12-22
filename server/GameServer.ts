import p2 from 'p2';
import { GameBody, BodyExtra } from '../types';
import Nanotimer from 'nanotimer';
import { json } from 'express';

function pixelsToMeters(p) { return p * 0.05; }

export interface AddGameBodyParams {
  options: p2.BodyOptions;
  extra?: BodyExtra;
  shape?: p2.Shape;
}

const fixedTimeStep = 1 / 60;
const maxSubSteps = 10;
let lastTimeMs = 0;
const rate = 1000;
const netTickRate = 50;

export class GameServer {
  private world = new p2.World({ gravity: [0, 0] })
  private timer = window || new Nanotimer();
  private timeSinceLastTick = 0;
  sendUpdates: (netPackage: string) => void;

  constructor(sendUpdates: (netPackage: string) => void) {
    this.sendUpdates = sendUpdates;
  }

  public create(): void {
    const { world } = this;

    // world.addBody(this.addGameObject({
    //   options: { mass: 1, position: [-2, 0], fixedRotation: true },
    //   extra: { type: 'player', character: 'prince' },
    //   shape: new p2.Box({ width: pixelsToMeters(32), height: pixelsToMeters(48) })
    // }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 6] },
      extra: { sprite: 'tile_205.png' },
      shape: new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) })
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-2, 8] },
      extra: { sprite: 'tile_205.png' },
      shape: new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) })
    }));

    world.addBody(this.addGameObject({
      options: { mass: 1, position: [-4, 6] },
      extra: { sprite: 'tile_205.png' },
      shape: new p2.Box({ width: pixelsToMeters(64), height: pixelsToMeters(64) })
    }));

    // world.addBody(this.addGameObject({
    //   options: { position: [0, -10] },
    //   shape: new p2.Plane()
    // }))
  }

  public start(): void {
    this.update(Date.now());
  }

  public addGameObject({ options, extra, shape }: AddGameBodyParams): GameBody {
    const body = new p2.Body(options) as GameBody;
    if (extra) {
      body.extra = extra;
    }
    if (shape) {
      body.addShape(shape);
    }
    return body;
  }

  public update(timeMill: number): void {
    const { world } = this;
    let timeSinceLast = 0;
    if (timeMill !== undefined && lastTimeMs !== undefined) {
      timeSinceLast = (timeMill - lastTimeMs) / rate;
    }
    world.step(fixedTimeStep, timeSinceLast, maxSubSteps);
    lastTimeMs = timeMill;

    const timeToSend = this.timeSinceLastTick > netTickRate;
    if (timeToSend) {
      this.sendWorldDataToClients(world);
      this.timeSinceLastTick = 0;
    }
    this.timer.setTimeout(() => this.update(Date.now()));
  }

  sendWorldDataToClients(world: p2.World): void {
    const { bodies } = world;
    const networkPackage = JSON.stringify({ bodies });
    this.sendPackage(networkPackage);
  }

  sendPackage(packet: string): void {
    console.log(packet);
    this.sendUpdates(packet);
  }
}