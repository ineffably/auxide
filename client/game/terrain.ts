


export const generateTerrain = (width: 1000, height: 1000) => {
  const genLayer = (width, height, max) => {
    const results = [] as number[];
    for(let w = 0; w < width; w++){
      for(let h = 0; h < height; h++){
        const value = Math.floor(Math.random() * Math.floor(max));
        results.push(value)
      }
    }
    return results;
  }
  const layer = {
    height,
    width,
    x: 0,
    y: 0,
    data: genLayer(width, height, 3)
  } as Layer;
  
  return layer;
}

export interface Terrain {
  compressionlevel?: number;
  height?:           number;
  infinite?:         boolean;
  layers?:           Layer[];
  nextlayerid?:      number;
  nextobjectid?:     number;
  orientation?:      string;
  renderorder?:      string;
  tiledversion?:     string;
  tileheight?:       number;
  tilesets?:         Tileset[];
  tilewidth?:        number;
  type?:             string;
  version?:          number;
  width?:            number;
}

export interface Layer {
  data?:    number[];
  height?:  number;
  id?:      number;
  name?:    string;
  opacity?: number;
  type?:    string;
  visible?: boolean;
  width?:   number;
  x?:       number;
  y?:       number;
}

export interface Tileset {
  firstgid?: number;
  source?:   string;
}
