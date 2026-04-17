function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportSceneJson(data, filename = 'china-architecture-builder-v3.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function exportCanvasScreenshot(filename = 'china-architecture-builder-v3.png') {
  const canvas = document.querySelector('canvas');

  if (!canvas) {
    return false;
  }

  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }

    downloadBlob(blob, filename);
  }, 'image/png');

  return true;
}
