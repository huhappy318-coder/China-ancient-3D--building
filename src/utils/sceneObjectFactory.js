import { GRID_STEP, snapPosition, snapRotation, snapScale, snapValue } from './snap';

const placementOffsets = [
  [0, 0, 0],
  [-2, 0, 0],
  [2, 0, 0],
  [0, 0, -2],
  [0, 0, 2],
  [-2, 0, -2],
  [2, 0, -2],
  [-2, 0, 2],
  [2, 0, 2],
];

export const OBJECT_TYPE_META = {
  platform: {
    label: '台基',
    category: 'base',
    categoryLabel: '基座类',
    defaultPosition: [0, 0.5, 0],
    defaultScale: [1.2, 1, 1.2],
    color: '#7b6041',
  },
  column: {
    label: '立柱',
    category: 'structure',
    categoryLabel: '结构类',
    defaultPosition: [0, 1.5, 0],
    defaultScale: [1, 1, 1],
    color: '#9f6f3c',
  },
  beam: {
    label: '横梁',
    category: 'structure',
    categoryLabel: '结构类',
    defaultPosition: [0, 3, 0],
    defaultScale: [1, 1, 1],
    color: '#765135',
  },
  roof: {
    label: '屋顶',
    category: 'roof',
    categoryLabel: '屋面类',
    defaultPosition: [0, 4.5, 0],
    defaultScale: [1, 1, 1],
    color: '#5a2f22',
  },
  eaves: {
    label: '飞檐',
    category: 'roof',
    categoryLabel: '屋面类',
    defaultPosition: [0, 3.5, 0],
    defaultScale: [1, 1, 1],
    color: '#8c5d3e',
  },
  stairs: {
    label: '石阶',
    category: 'base',
    categoryLabel: '基座类',
    defaultPosition: [0, 0, 2.5],
    defaultScale: [1, 1, 1],
    color: '#95816a',
  },
};

let objectCounter = 0;

function createId(type) {
  objectCounter += 1;
  return `${type}-${Date.now().toString(36)}-${objectCounter.toString(36)}`;
}

function getOffset(index) {
  const presetOffset = placementOffsets[index % placementOffsets.length];
  const ring = Math.floor(index / placementOffsets.length);
  const ringOffset = ring * GRID_STEP * 4;

  return [
    presetOffset[0] + (presetOffset[0] >= 0 ? ringOffset : -ringOffset),
    presetOffset[1],
    presetOffset[2] + (presetOffset[2] >= 0 ? ringOffset : -ringOffset),
  ];
}

export function createSceneObject(type, sceneObjects = []) {
  const meta = OBJECT_TYPE_META[type];

  if (!meta) {
    return null;
  }

  const offset = getOffset(sceneObjects.length);
  const position = snapPosition([
    meta.defaultPosition[0] + offset[0],
    meta.defaultPosition[1] + offset[1],
    meta.defaultPosition[2] + offset[2],
  ]);

  return normalizeSceneObject({
    id: createId(type),
    type,
    position,
    rotation: [0, 0, 0],
    scale: meta.defaultScale,
    visible: true,
    meta: {
      label: meta.label,
      category: meta.category,
      categoryLabel: meta.categoryLabel,
    },
  });
}

export function cloneSceneObject(sceneObject) {
  return normalizeSceneObject({
    ...sceneObject,
    id: createId(sceneObject.type),
    position: snapPosition([
      (sceneObject.position?.[0] ?? 0) + GRID_STEP * 2,
      sceneObject.position?.[1] ?? 0,
      (sceneObject.position?.[2] ?? 0) + GRID_STEP * 2,
    ]),
    meta: {
      ...sceneObject.meta,
    },
  });
}

export function normalizeSceneObject(sceneObject) {
  const meta = OBJECT_TYPE_META[sceneObject.type] ?? OBJECT_TYPE_META.column;
  const rotation = sceneObject.rotation ?? [0, 0, 0];
  const scale = sceneObject.scale ?? [1, 1, 1];

  return {
    id: sceneObject.id ?? createId(sceneObject.type ?? 'object'),
    type: sceneObject.type ?? 'column',
    position: snapPosition(sceneObject.position ?? meta.defaultPosition),
    rotation: [
      snapRotation(rotation[0] ?? 0),
      snapRotation(rotation[1] ?? 0),
      snapRotation(rotation[2] ?? 0),
    ],
    scale: [
      snapScale(scale[0] ?? 1),
      snapScale(scale[1] ?? 1),
      snapScale(scale[2] ?? 1),
    ],
    visible: sceneObject.visible ?? true,
    meta: {
      label: sceneObject.meta?.label ?? meta.label,
      category: sceneObject.meta?.category ?? meta.category,
      categoryLabel: sceneObject.meta?.categoryLabel ?? meta.categoryLabel,
    },
  };
}

export function getObjectLabel(type) {
  return OBJECT_TYPE_META[type]?.label ?? type;
}

export function getObjectCategoryLabel(type) {
  return OBJECT_TYPE_META[type]?.categoryLabel ?? '未分类';
}

export function updateObjectPosition(sceneObject, axis, value) {
  const nextPosition = [...sceneObject.position];
  nextPosition[axis] = snapValue(value);

  return {
    ...sceneObject,
    position: nextPosition,
  };
}

export function updateObjectRotation(sceneObject, value) {
  return {
    ...sceneObject,
    rotation: [0, snapRotation(value), 0],
  };
}

export function updateObjectScale(sceneObject, value) {
  const snappedScale = snapScale(value);

  return {
    ...sceneObject,
    scale: [snappedScale, snappedScale, snappedScale],
  };
}
