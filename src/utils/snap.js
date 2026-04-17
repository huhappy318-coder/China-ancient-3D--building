export const GRID_STEP = 0.5;

export function snapValue(value, step = GRID_STEP) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value / step) * step;
}

export function snapPosition(position, step = GRID_STEP) {
  return [
    snapValue(position[0] ?? 0, step),
    snapValue(position[1] ?? 0, step),
    snapValue(position[2] ?? 0, step),
  ];
}

export function snapRotation(value, step = 15) {
  return snapValue(value, step);
}

export function snapScale(value, step = 0.1) {
  return Number(snapValue(value, step).toFixed(2));
}

export function formatNumber(value) {
  const snapped = Math.abs(value) < 0.001 ? 0 : value;
  const fixed = Number.isInteger(snapped) ? 0 : 1;

  return snapped.toFixed(fixed);
}
