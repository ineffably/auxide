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
  extra?: BodyExtra;
  createOptions?: {options?: any, shapeProps?: any};
}

export interface BodyExtra {
  sprite?: string; 
  type?: string;
  character?: string;
}

export interface AddGameObjectParams {
  options: p2.BodyOptions;
  extraprops?: BodyExtra;
  shape?: p2.Shape;
}

export interface SpriteSheet {
  frames?:     Record<string, FrameValue>;
  animations?: Animations;
  meta?:       Meta;
}

export interface Animations {
  tile?: string[];
}

export interface FrameValue {
  frame?:            SpriteDimensions;
  rotated?:          boolean;
  trimmed?:          boolean;
  spriteSourceSize?: SpriteDimensions;
  sourceSize?:       Size;
}

export interface SpriteDimensions {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface Size {
  w?: number;
  h?: number;
}

export interface Meta {
  app?:         string;
  version?:     string;
  image?:       string;
  format?:      string;
  size?:        Size;
  scale?:       string;
  smartupdate?: string;
}

