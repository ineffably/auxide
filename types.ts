import p2 from 'p2';

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

export interface GameBody extends p2.Body {
  extra?: any;
}

