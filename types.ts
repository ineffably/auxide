export interface SpriteEntry {
  sprite: PIXI.Sprite;
  name: string;
  text: PIXI.Text;
}

export interface GameTime {
  deltaTime: number;
  deltaFrame: number;
}

export interface GameObject {
  body: p2.Body;
  sprite: PIXI.Sprite;
}

