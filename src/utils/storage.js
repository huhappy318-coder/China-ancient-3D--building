import { normalizeSceneObject } from './sceneObjectFactory';

export const STORAGE_KEY = 'china-architecture-builder-v3';

export function saveBuilderState(payload) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('保存方案失败', error);
    return false;
  }
}

export function loadBuilderState() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);

    return {
      ...parsed,
      sceneObjects: Array.isArray(parsed.sceneObjects)
        ? parsed.sceneObjects.map(normalizeSceneObject)
        : [],
      selectedObjectIds: Array.isArray(parsed.selectedObjectIds) ? parsed.selectedObjectIds : [],
      blueprintMode: parsed.blueprintMode ?? 'plan',
      currentTemplate: parsed.currentTemplate ?? null,
      focusType: parsed.focusType ?? 'column',
    };
  } catch (error) {
    console.error('读取方案失败', error);
    return null;
  }
}

export function clearBuilderState() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
