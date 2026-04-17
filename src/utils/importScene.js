import { normalizeSceneObject } from './sceneObjectFactory';

export function parseImportedScene(rawText) {
  const parsed = JSON.parse(rawText);

  return {
    sceneObjects: Array.isArray(parsed.sceneObjects)
      ? parsed.sceneObjects.map(normalizeSceneObject)
      : [],
    currentWeather: parsed.currentWeather ?? 'sunny',
    currentLighting: parsed.currentLighting ?? 'noon',
    currentView: parsed.currentView ?? 'perspective',
    showBlueprintOverlay: parsed.showBlueprintOverlay ?? false,
    blueprintMode: parsed.blueprintMode ?? 'plan',
    currentTemplate: parsed.currentTemplate ?? null,
    selectedObjectIds: Array.isArray(parsed.selectedObjectIds) ? parsed.selectedObjectIds : [],
    focusType: parsed.focusType ?? 'column',
    showSteps: parsed.showSteps ?? true,
  };
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(parseImportedScene(reader.result));
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'utf-8');
  });
}
