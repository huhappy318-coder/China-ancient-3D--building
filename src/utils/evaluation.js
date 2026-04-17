function hasType(sceneObjects, type) {
  return sceneObjects.some((object) => object.type === type && object.visible);
}

function countType(sceneObjects, type) {
  return sceneObjects.filter((object) => object.type === type && object.visible).length;
}

function computeSymmetryRatio(sceneObjects) {
  const visibleObjects = sceneObjects.filter((object) => object.visible);
  const positiveSide = visibleObjects.filter((object) => object.position[0] > 0.4);

  if (!positiveSide.length) {
    return visibleObjects.length > 0 ? 0.6 : 0;
  }

  let matchedCount = 0;

  positiveSide.forEach((object) => {
    const mirrored = visibleObjects.find((candidate) => {
      if (candidate.id === object.id || candidate.type !== object.type || !candidate.visible) {
        return false;
      }

      const mirroredX = Math.abs(candidate.position[0] + object.position[0]) < 0.6;
      const sameZ = Math.abs(candidate.position[2] - object.position[2]) < 0.6;
      const sameY = Math.abs(candidate.position[1] - object.position[1]) < 0.6;

      return mirroredX && sameZ && sameY;
    });

    if (mirrored) {
      matchedCount += 1;
    }
  });

  return matchedCount / positiveSide.length;
}

function beautyGrade(score) {
  if (score >= 92) {
    return 'A+';
  }

  if (score >= 84) {
    return 'A';
  }

  if (score >= 74) {
    return 'A-';
  }

  if (score >= 64) {
    return 'B+';
  }

  return 'B';
}

export function evaluateScene(sceneObjects) {
  const visibleObjects = sceneObjects.filter((object) => object.visible);
  const symmetryRatio = computeSymmetryRatio(sceneObjects);
  const platform = hasType(sceneObjects, 'platform');
  const roof = hasType(sceneObjects, 'roof');
  const stairs = hasType(sceneObjects, 'stairs');
  const eaves = hasType(sceneObjects, 'eaves');
  const columnCount = countType(sceneObjects, 'column');
  const beamCount = countType(sceneObjects, 'beam');

  const completeness =
    18 +
    (platform ? 18 : 0) +
    (roof ? 20 : 0) +
    (stairs ? 10 : 0) +
    (eaves ? 8 : 0) +
    Math.min(columnCount * 6, 24) +
    Math.min(beamCount * 5, 14) +
    Math.round(symmetryRatio * 8);

  const craftsmanship =
    90 +
    visibleObjects.length * 11 +
    (platform ? 10 : 0) +
    (roof ? 14 : 0) +
    Math.round(symmetryRatio * 20);

  const beautyScore = beautyGrade(
    50 +
      (roof ? 12 : 0) +
      (eaves ? 6 : 0) +
      (stairs ? 4 : 0) +
      Math.min(columnCount * 3, 12) +
      Math.round(symmetryRatio * 18),
  );

  const suggestions = [];

  if (!platform) {
    suggestions.push('当前缺少台基，建议先建立基础承托。');
  }

  if (!roof) {
    suggestions.push('当前缺少屋面构件，建议补充屋顶强化轮廓。');
  }

  if (columnCount < 2) {
    suggestions.push('建议补充两侧对称立柱，增强中轴秩序感。');
  }

  if (!stairs && platform) {
    suggestions.push('可在前侧补充石阶，让入口更完整。');
  }

  if (symmetryRatio >= 0.7) {
    suggestions.push('左右布局较均衡，美观度正在提升。');
  }

  if (platform && roof && columnCount >= 4) {
    suggestions.push('已具备基础亭阁结构，可以继续细化檐口与梁架。');
  }

  if (!suggestions.length) {
    suggestions.push('当前结构已经比较完整，可以继续细化对称细节与装饰层次。');
  }

  return {
    completeness: Math.min(completeness, 100),
    beautyScore,
    craftsmanship,
    symmetryRatio,
    suggestions: suggestions.slice(0, 3),
  };
}
