import * as PIXI from 'pixi.js';

export const app = new PIXI.Application();
document.getElementById('root').appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

app.stop(); 

app.loader
    .add('topdown', '/assets/topdown.json')
    .load(() => {
      console.log(app);
    });




// PIXI.Loader.shared.add("sprites/spritesheet.json")
//     .load(spriteSetup)
//     .load(startup);

// function spriteSetup(){
//     sheet = PIXI.Loader.shared.resources["sprites/spritesheet.json"].spritesheet;
// }
// function startup(){
//     bunny = new PIXI.Sprite(sheet.textures["bunny.png"]);
// }