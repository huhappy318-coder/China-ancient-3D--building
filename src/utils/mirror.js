import { cloneSceneObject } from './sceneObjectFactory';
import { snapValue } from './snap';

export function createMirroredObject(sceneObject) {
  const mirroredObject = cloneSceneObject(sceneObject);
  const mirroredX = Math.abs(sceneObject.position[0]) < 0.5 ? 2 : -sceneObject.position[0];

  mirroredObject.position = [
    snapValue(mirroredX),
    sceneObject.position[1],
    sceneObject.position[2],
  ];
  mirroredObject.rotation = [
    sceneObject.rotation[0],
    snapValue(-sceneObject.rotation[1], 15),
    sceneObject.rotation[2],
  ];

  return mirroredObject;
}
