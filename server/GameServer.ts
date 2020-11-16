import p2 from 'p2';
import { GameBody, BodyExtra } from '../types';

function pixelsToMeters(p) { return p * 0.05; }

export interface AddGameBodyParams {
  options: p2.BodyOptions;
  extra?: BodyExtra;
  shape?: p2.Shape;
}

export class GameServer {
  private world = new p2.World({ gravity: [0, 0] })

  public create(): void {
    const { world } = this;

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
  
    world.addBody(this.addGameObject({
      options: { position: [0, -10] },
      shape: new p2.Plane()
    }))
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

}