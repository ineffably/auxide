import { Renderer } from 'pixi.js';

export const renderSurface = new Renderer({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1077bb
});


const renderingTarget = (renderer) => {
  const gameElement = document.getElementById('game');
  if (gameElement) {
    gameElement.appendChild(renderer.view);
    window.addEventListener('resize', () => {
      gameElement.style.width = `${window.innerWidth}px`;
      gameElement.style.height = `${window.innerHeight}px`;
    })
  }
}
renderingTarget(renderSurface);
