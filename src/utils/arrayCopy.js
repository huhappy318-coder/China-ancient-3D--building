import { cloneSceneObject } from './sceneObjectFactory';
import { snapValue } from './snap';

export function createArrayCopies(sceneObject, count, spacing) {
  const safeCount = Math.max(1, count);
  const centerIndex = Math.floor(safeCount / 2);
  const nextObjects = [];

  for (let index = 0; index < safeCount; index += 1) {
    if (index === centerIndex) {
      continue;
    }

    const cloned = cloneSceneObject(sceneObject);
    cloned.position = [
      snapValue(sceneObject.position[0] + (index - centerIndex) * spacing),
      sceneObject.position[1],
      sceneObject.position[2],
    ];
    nextObjects.push(cloned);
  }

  return nextObjects;
}
