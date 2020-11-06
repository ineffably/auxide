import { Renderer } from 'pixi.js';

export const renderer = new Renderer({
  width: 1024,
  height: 768,
  backgroundColor: 0x1077bb
});

const renderingTarget = (renderer) => {
  const gameElement = document.getElementById('game');
  if (gameElement) {
    gameElement.appendChild(renderer.view);
  }
}
renderingTarget(renderer);
