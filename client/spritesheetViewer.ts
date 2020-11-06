import * as PIXI from "pixi.js";
const { Renderer } = PIXI;
const loader = new PIXI.Loader();
const stage = new PIXI.Container();
const renderer = new Renderer({
  width: 1024,
  height: 768,
  backgroundColor: 0x1077bb
});
let starty = 0;

const gameElement = document.getElementById("game");
if (gameElement) {
  gameElement.appendChild(renderer.view);
  document.onwheel = (event) => {
    event.preventDefault();
    starty += event.deltaY;
  };
}
const container = new PIXI.Container();

interface SpriteEntry {
  sprite: PIXI.Sprite;
  name: string;
  text: PIXI.Text;
}

const world = {
  sprites: [] as SpriteEntry[]
};

const createWorld = () => {
  const { spritesheet } = loader.resources["topdown"];
  // let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
  if (spritesheet) {
    const { textures } = spritesheet;
    Object.keys(textures).forEach((name, i) => {
      const sprite = new PIXI.Sprite(textures[name]);
      const text = new PIXI.Text(name, { fill: 0xffffff, fontSize: 24 });
      text.position.x = 74;
      world.sprites.push({ sprite, name, text });
      stage.addChild(text);
      stage.addChild(sprite);
    });
  }
};

const updateWorld = () => {
  world.sprites.forEach(({ sprite, text }, i) => {
    sprite.position.y = 64 * i + starty;
    text.position.y = 64 * i + starty + 10;
  });
};

stage.addChild(container);

let lastTime = Date.now();
const gameloop = () => {
  const now = Date.now();
  let deltaTime = now - lastTime;
  lastTime = now;
  if (deltaTime < 0) deltaTime = 0;
  if (deltaTime > 1000) deltaTime = 1000;
  const deltaFrame = (deltaTime * 60) / 1000;
  updateWorld();
  renderer.render(stage);
  requestAnimationFrame(gameloop);
};

function start() {
  createWorld();
  requestAnimationFrame(gameloop);
}

loader
  .add("topdown", "/assets/topdown.json", { crossOrigin: "anonymous" })
  .load(start);

// would be so much usable in react, alas, games and canvas
export {
  stage,
  world
}