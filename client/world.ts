
import p2, { Solver } from 'p2';

export const world = () => {
  const world = new p2.World({
    gravity: [0, -10]
  });

  world.solver = new Solver({ tolerance: 0.01 })
  const boxBody = new p2.Body({
    mass: 1,
    position: [-1, 2],
    fixedRotation: true
  });
  boxBody.addShape(new p2.Box({ width: 1, height: 1 }));
  world.addBody(boxBody);

  const boxBody2 = new p2.Body({
    mass: 1,
    position: [-0.3, 0],
    fixedRotation: true
  });
  boxBody2.addShape(new p2.Box({ width: 1, height: 1 }));
  world.addBody(boxBody2);

  // Create ground
  const planeShape = new p2.Plane();
  const plane = new p2.Body({ position: [0, -1], });
  plane.addShape(planeShape);
  world.addBody(plane);
}


