const HISTORY_LIMIT = 30;

function cloneSnapshot(snapshot) {
  return JSON.parse(JSON.stringify(snapshot));
}

export function createHistorySnapshot({
  sceneObjects,
  selectedObjectIds,
  currentTemplate,
  blueprintMode,
  showBlueprintOverlay,
  focusType,
}) {
  return cloneSnapshot({
    sceneObjects,
    selectedObjectIds,
    currentTemplate,
    blueprintMode,
    showBlueprintOverlay,
    focusType,
  });
}

export function pushHistoryEntry(historyStack, snapshot) {
  const nextHistory = [...historyStack, cloneSnapshot(snapshot)];

  if (nextHistory.length > HISTORY_LIMIT) {
    return nextHistory.slice(nextHistory.length - HISTORY_LIMIT);
  }

  return nextHistory;
}

export function popHistoryEntry(historyStack) {
  if (!historyStack.length) {
    return {
      nextHistory: historyStack,
      snapshot: null,
    };
  }

  return {
    nextHistory: historyStack.slice(0, -1),
    snapshot: cloneSnapshot(historyStack[historyStack.length - 1]),
  };
}
