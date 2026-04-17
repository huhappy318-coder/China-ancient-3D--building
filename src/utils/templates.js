import { normalizeSceneObject } from './sceneObjectFactory';

const TEMPLATE_DEFINITIONS = {
  gate: {
    key: 'gate',
    name: '对称门楼',
    subtitle: '中轴清晰、两侧均衡，适合快速起步。',
    tags: ['中轴', '对称', '门楼'],
    objects: [
      { type: 'platform', position: [0, 0.5, 0], scale: [1.6, 1, 1.1] },
      { type: 'stairs', position: [0, 0, 2.5] },
      { type: 'column', position: [-2, 1.5, 0] },
      { type: 'column', position: [2, 1.5, 0] },
      { type: 'column', position: [-2, 1.5, -1.8] },
      { type: 'column', position: [2, 1.5, -1.8] },
      { type: 'beam', position: [0, 3.1, 0], scale: [1.2, 1, 1] },
      { type: 'roof', position: [0, 4.6, -0.2], scale: [1.1, 1, 1] },
      { type: 'eaves', position: [0, 3.8, -0.2], scale: [1.05, 1, 1] },
    ],
  },
  pavilion: {
    key: 'pavilion',
    name: '四柱亭',
    subtitle: '轻量亭阁轮廓，适合演示亭式结构。',
    tags: ['亭', '四柱', '轻量'],
    objects: [
      { type: 'platform', position: [0, 0.4, 0], scale: [1.2, 0.9, 1.2] },
      { type: 'column', position: [-1.6, 1.5, -1.6] },
      { type: 'column', position: [1.6, 1.5, -1.6] },
      { type: 'column', position: [-1.6, 1.5, 1.6] },
      { type: 'column', position: [1.6, 1.5, 1.6] },
      { type: 'beam', position: [0, 3.05, -1.6], scale: [0.8, 1, 1] },
      { type: 'beam', position: [0, 3.05, 1.6], scale: [0.8, 1, 1] },
      { type: 'beam', position: [-1.6, 3.05, 0], rotation: [0, 90, 0], scale: [0.8, 1, 1] },
      { type: 'beam', position: [1.6, 3.05, 0], rotation: [0, 90, 0], scale: [0.8, 1, 1] },
      { type: 'roof', position: [0, 4.55, 0], scale: [1.05, 1, 1.05] },
      { type: 'eaves', position: [0, 3.8, 0], scale: [1.1, 1, 1.1] },
    ],
  },
  hall: {
    key: 'hall',
    name: '单檐殿阁',
    subtitle: '更完整的殿式结构，适合做成展示作品。',
    tags: ['殿阁', '单檐', '完整'],
    objects: [
      { type: 'platform', position: [0, 0.55, 0], scale: [1.8, 1.1, 1.5] },
      { type: 'stairs', position: [0, 0, 3.2], scale: [1.1, 1, 1] },
      { type: 'column', position: [-3, 1.6, -2.2] },
      { type: 'column', position: [0, 1.6, -2.2] },
      { type: 'column', position: [3, 1.6, -2.2] },
      { type: 'column', position: [-3, 1.6, 0] },
      { type: 'column', position: [0, 1.6, 0] },
      { type: 'column', position: [3, 1.6, 0] },
      { type: 'column', position: [-3, 1.6, 2.2] },
      { type: 'column', position: [0, 1.6, 2.2] },
      { type: 'column', position: [3, 1.6, 2.2] },
      { type: 'beam', position: [0, 3.2, -2.2], scale: [1.45, 1, 1] },
      { type: 'beam', position: [0, 3.2, 0], scale: [1.45, 1, 1] },
      { type: 'beam', position: [0, 3.2, 2.2], scale: [1.45, 1, 1] },
      { type: 'roof', position: [0, 4.95, 0], scale: [1.35, 1.1, 1.2] },
      { type: 'eaves', position: [0, 4.1, 0], scale: [1.45, 1, 1.35] },
    ],
  },
};

let templateObjectCounter = 0;

function createTemplateObjectId(type, templateKey) {
  templateObjectCounter += 1;
  return `${templateKey}-${type}-${templateObjectCounter.toString(36)}`;
}

function buildTemplateObjects(templateKey) {
  const definition = TEMPLATE_DEFINITIONS[templateKey];

  if (!definition) {
    return [];
  }

  return definition.objects.map((object) =>
    normalizeSceneObject({
      ...object,
      id: createTemplateObjectId(object.type, templateKey),
      visible: true,
    }),
  );
}

export function getTemplateDefinitions() {
  return Object.values(TEMPLATE_DEFINITIONS);
}

export function createTemplateScene(templateKey) {
  return buildTemplateObjects(templateKey);
}
