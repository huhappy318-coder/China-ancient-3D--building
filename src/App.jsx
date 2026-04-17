import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LeftRail from './components/layout/LeftRail';
import SidePanel from './components/layout/SidePanel';
import TopOverlay from './components/layout/TopOverlay';
import FloatingStats from './components/layout/FloatingStats';
import ViewControls from './components/layout/ViewControls';
import ReopenRailButton from './components/layout/ReopenRailButton';
import ComponentsPanel from './components/panels/ComponentsPanel';
import TemplatesPanel from './components/panels/TemplatesPanel';
import BlueprintPanel from './components/panels/BlueprintPanel';
import WeatherPanel from './components/panels/WeatherPanel';
import LightingPanel from './components/panels/LightingPanel';
import PropertiesPanel from './components/panels/PropertiesPanel';
import BuilderScene from './components/scene/BuilderScene';
import EvaluationBadge from './components/scene/EvaluationBadge';
import { blueprintSteps } from './data/blueprintSteps';
import {
  createSceneObject,
  cloneSceneObject,
  getObjectLabel,
  updateObjectPosition,
  updateObjectRotation,
  updateObjectScale,
} from './utils/sceneObjectFactory';
import { loadBuilderState, saveBuilderState } from './utils/storage';
import { formatNumber } from './utils/snap';
import { createHistorySnapshot, popHistoryEntry, pushHistoryEntry } from './utils/history';
import { createTemplateScene, getTemplateDefinitions } from './utils/templates';
import { evaluateScene } from './utils/evaluation';
import { createMirroredObject } from './utils/mirror';
import { createArrayCopies } from './utils/arrayCopy';
import { exportCanvasScreenshot, exportSceneJson } from './utils/exportScene';
import { readJsonFile } from './utils/importScene';

const WEATHER_OPTIONS = {
  sunny: { label: '晴光' },
  rainMist: { label: '雨雾' },
  snow: { label: '雪景' },
  dusk: { label: '黄昏' },
  night: { label: '夜色' },
};

const LIGHTING_OPTIONS = {
  dawn: { label: '晨光' },
  noon: { label: '午照' },
  sunset: { label: '夕照' },
  lantern: { label: '夜灯' },
  soft: { label: '柔光' },
};

const VIEW_OPTIONS = [
  { key: 'top', label: '俯视' },
  { key: 'perspective', label: '透视' },
  { key: 'blueprint', label: '图纸叠加' },
  { key: 'roam', label: '自由漫游' },
];

const PANEL_META = {
  components: {
    title: '构件面板',
    description: '继续从构件库向场景中新增对象，并通过图纸参考更快搭出规整轮廓。',
  },
  templates: {
    title: '模板面板',
    description: '使用门楼、亭阁、殿阁模板快速起步，再在现有场景基础上继续微调。',
  },
  blueprint: {
    title: '图纸面板',
    description: '切换平面辅助 / 结构辅助模式，并按推荐步骤完成古建筑搭建。',
  },
  weather: {
    title: '天气面板',
    description: '通过背景、雾和环境明暗切换场景气氛，保持沉浸式网页感。',
  },
  lighting: {
    title: '光影面板',
    description: '切换不同时段光照，让结构体块与空间层次更加清楚。',
  },
  properties: {
    title: '属性与对象',
    description: '编辑当前对象或批量操作选中对象，并在对象列表中管理场景图层。',
  },
};

const DEFAULT_STATE = {
  activeNav: 'components',
  isRailHidden: false,
  isPanelOpen: true,
  currentWeather: 'sunny',
  currentLighting: 'noon',
  currentView: 'perspective',
  showBlueprintOverlay: false,
  blueprintMode: 'plan',
  focusType: 'column',
  selectedObjectIds: [],
  sceneObjects: [],
  showSteps: true,
  currentTemplate: null,
};

const templateDefinitions = getTemplateDefinitions();
const templateLabelMap = Object.fromEntries(
  templateDefinitions.map((template) => [template.key, template.name]),
);

function getCurrentStep(sceneObjects, focusType) {
  const visibleObjects = sceneObjects.filter((object) => object.visible);
  const objectTypes = new Set(visibleObjects.map((object) => object.type));

  const focusStepMap = {
    platform: 1,
    column: 2,
    beam: 2,
    eaves: 3,
    roof: 4,
    stairs: 5,
  };

  if (focusType && focusStepMap[focusType]) {
    return focusStepMap[focusType];
  }

  if (!objectTypes.has('platform')) {
    return 1;
  }

  if (!objectTypes.has('column') || !objectTypes.has('beam')) {
    return 2;
  }

  if (!objectTypes.has('eaves')) {
    return 3;
  }

  if (!objectTypes.has('roof')) {
    return 4;
  }

  return 5;
}

export default function App() {
  const [activeNav, setActiveNav] = useState(DEFAULT_STATE.activeNav);
  const [isRailHidden, setIsRailHidden] = useState(DEFAULT_STATE.isRailHidden);
  const [isPanelOpen, setIsPanelOpen] = useState(DEFAULT_STATE.isPanelOpen);
  const [currentWeather, setCurrentWeather] = useState(DEFAULT_STATE.currentWeather);
  const [currentLighting, setCurrentLighting] = useState(DEFAULT_STATE.currentLighting);
  const [currentView, setCurrentView] = useState(DEFAULT_STATE.currentView);
  const [showBlueprintOverlay, setShowBlueprintOverlay] = useState(DEFAULT_STATE.showBlueprintOverlay);
  const [blueprintMode, setBlueprintMode] = useState(DEFAULT_STATE.blueprintMode);
  const [focusType, setFocusType] = useState(DEFAULT_STATE.focusType);
  const [selectedObjectIds, setSelectedObjectIds] = useState(DEFAULT_STATE.selectedObjectIds);
  const [sceneObjects, setSceneObjects] = useState(DEFAULT_STATE.sceneObjects);
  const [showSteps, setShowSteps] = useState(DEFAULT_STATE.showSteps);
  const [currentTemplate, setCurrentTemplate] = useState(DEFAULT_STATE.currentTemplate);
  const [statusMessage, setStatusMessage] = useState('已就绪');
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const statusTimerRef = useRef(null);
  const importInputRef = useRef(null);

  const selectedObjects = useMemo(() => {
    return selectedObjectIds
      .map((objectId) => sceneObjects.find((object) => object.id === objectId))
      .filter(Boolean);
  }, [sceneObjects, selectedObjectIds]);

  const primarySelectedObject = selectedObjects[selectedObjects.length - 1] ?? null;
  const evaluationSummary = useMemo(() => evaluateScene(sceneObjects), [sceneObjects]);
  const currentStep = useMemo(
    () => getCurrentStep(sceneObjects, primarySelectedObject?.type ?? focusType),
    [focusType, primarySelectedObject?.type, sceneObjects],
  );

  const stats = useMemo(() => {
    return [
      { label: '结构完整度', value: `${evaluationSummary.completeness}%` },
      { label: '美观评分', value: evaluationSummary.beautyScore },
      { label: '匠心值', value: `+${evaluationSummary.craftsmanship}` },
    ];
  }, [evaluationSummary]);

  const currentFocusLabel = useMemo(() => {
    if (selectedObjectIds.length > 1) {
      return `多选 ${selectedObjectIds.length}`;
    }

    if (primarySelectedObject) {
      return primarySelectedObject.meta.label;
    }

    if (currentTemplate && templateLabelMap[currentTemplate]) {
      return templateLabelMap[currentTemplate];
    }

    return getObjectLabel(focusType);
  }, [currentTemplate, focusType, primarySelectedObject, selectedObjectIds.length]);

  const applyPersistedState = useCallback((payload) => {
    if (!payload) {
      return;
    }

    setCurrentWeather(payload.currentWeather ?? DEFAULT_STATE.currentWeather);
    setCurrentLighting(payload.currentLighting ?? DEFAULT_STATE.currentLighting);
    setCurrentView(payload.currentView ?? DEFAULT_STATE.currentView);
    setShowBlueprintOverlay(payload.showBlueprintOverlay ?? DEFAULT_STATE.showBlueprintOverlay);
    setBlueprintMode(payload.blueprintMode ?? DEFAULT_STATE.blueprintMode);
    setSceneObjects(payload.sceneObjects ?? DEFAULT_STATE.sceneObjects);
    setSelectedObjectIds(payload.selectedObjectIds ?? []);
    setShowSteps(payload.showSteps ?? DEFAULT_STATE.showSteps);
    setCurrentTemplate(payload.currentTemplate ?? null);
    setFocusType(payload.focusType ?? DEFAULT_STATE.focusType);
  }, []);

  const getCurrentSnapshot = useCallback(() => {
    return createHistorySnapshot({
      sceneObjects,
      selectedObjectIds,
      currentTemplate,
      blueprintMode,
      showBlueprintOverlay,
      focusType,
    });
  }, [
    blueprintMode,
    currentTemplate,
    focusType,
    sceneObjects,
    selectedObjectIds,
    showBlueprintOverlay,
  ]);

  const applySnapshot = useCallback((snapshot) => {
    if (!snapshot) {
      return;
    }

    setSceneObjects(snapshot.sceneObjects ?? []);
    setSelectedObjectIds(snapshot.selectedObjectIds ?? []);
    setCurrentTemplate(snapshot.currentTemplate ?? null);
    setBlueprintMode(snapshot.blueprintMode ?? DEFAULT_STATE.blueprintMode);
    setShowBlueprintOverlay(snapshot.showBlueprintOverlay ?? DEFAULT_STATE.showBlueprintOverlay);
    setFocusType(snapshot.focusType ?? DEFAULT_STATE.focusType);
  }, []);

  const setTransientStatus = useCallback((message) => {
    setStatusMessage(message);
    window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMessage('已就绪');
    }, 2200);
  }, []);

  const recordHistory = useCallback(() => {
    setHistoryStack((previousHistory) => pushHistoryEntry(previousHistory, getCurrentSnapshot()));
    setRedoStack([]);
  }, [getCurrentSnapshot]);

  useEffect(() => {
    const savedState = loadBuilderState();

    if (savedState) {
      applyPersistedState(savedState);
      setStatusMessage('已自动恢复上次方案');
    }

    return () => {
      window.clearTimeout(statusTimerRef.current);
    };
  }, [applyPersistedState]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tagName = event.target?.tagName?.toLowerCase();
      const isTypingField = tagName === 'input' || tagName === 'select' || tagName === 'textarea';

      if (isTypingField) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();

        if (event.shiftKey) {
          if (redoStack.length) {
            const currentSnapshot = getCurrentSnapshot();
            const { nextHistory, snapshot } = popHistoryEntry(redoStack);

            setRedoStack(nextHistory);
            setHistoryStack((previousHistory) => pushHistoryEntry(previousHistory, currentSnapshot));
            applySnapshot(snapshot);
            setTransientStatus('已重做');
          }

          return;
        }

        if (historyStack.length) {
          const currentSnapshot = getCurrentSnapshot();
          const { nextHistory, snapshot } = popHistoryEntry(historyStack);

          setHistoryStack(nextHistory);
          setRedoStack((previousRedo) => pushHistoryEntry(previousRedo, currentSnapshot));
          applySnapshot(snapshot);
          setTransientStatus('已撤销');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applySnapshot, getCurrentSnapshot, historyStack, redoStack, setTransientStatus]);

  const handleSelectNav = useCallback((navKey) => {
    setActiveNav(navKey);
    setIsPanelOpen(true);
    setIsRailHidden(false);
  }, []);

  const handleHideRail = useCallback(() => {
    setIsRailHidden(true);
    setIsPanelOpen(false);
  }, []);

  const handleReopenRail = useCallback(() => {
    setIsRailHidden(false);
    setIsPanelOpen(true);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedObjectIds([]);
  }, []);

  const handleSelectObject = useCallback((objectId, options = {}) => {
    if (!objectId) {
      setSelectedObjectIds([]);
      return;
    }

    setSelectedObjectIds((previousSelected) => {
      if (options.append) {
        return previousSelected.includes(objectId)
          ? previousSelected.filter((id) => id !== objectId)
          : [...previousSelected, objectId];
      }

      return [objectId];
    });

    const targetObject = sceneObjects.find((object) => object.id === objectId);

    if (targetObject) {
      setFocusType(targetObject.type);
    }
  }, [sceneObjects]);

  const handleAddComponent = useCallback((item) => {
    const nextObject = createSceneObject(item.objectType, sceneObjects);

    if (!nextObject) {
      return;
    }

    recordHistory();
    setSceneObjects((previousObjects) => [...previousObjects, nextObject]);
    setSelectedObjectIds([nextObject.id]);
    setFocusType(item.objectType);
    setTransientStatus(`已添加 ${item.label}`);
  }, [recordHistory, sceneObjects, setTransientStatus]);

  const handleApplyTemplate = useCallback((templateKey) => {
    const templateObjects = createTemplateScene(templateKey);

    recordHistory();
    setSceneObjects(templateObjects);
    setSelectedObjectIds([]);
    setCurrentTemplate(templateKey);
    setShowBlueprintOverlay(true);
    setBlueprintMode('plan');
    setFocusType('platform');
    setActiveNav('properties');
    setTransientStatus(`已套用模板：${templateLabelMap[templateKey]}`);
  }, [recordHistory, setTransientStatus]);

  const handleClearScene = useCallback(() => {
    if (!sceneObjects.length) {
      setTransientStatus('当前已经是空白场景');
      return;
    }

    recordHistory();
    setSceneObjects([]);
    setSelectedObjectIds([]);
    setCurrentTemplate(null);
    setFocusType(DEFAULT_STATE.focusType);
    setTransientStatus('已清空场景');
  }, [recordHistory, sceneObjects.length, setTransientStatus]);

  const handlePositionChange = useCallback((axis, value, isBatch = false) => {
    if (!selectedObjectIds.length) {
      return;
    }

    recordHistory();

    if (isBatch) {
      const currentAverage =
        selectedObjects.reduce((sum, object) => sum + object.position[axis], 0) / selectedObjects.length;
      const delta = value - currentAverage;
      const targetIds = new Set(selectedObjectIds);

      setSceneObjects((previousObjects) =>
        previousObjects.map((object) => {
          if (!targetIds.has(object.id)) {
            return object;
          }

          return updateObjectPosition(object, axis, object.position[axis] + delta);
        }),
      );

      return;
    }

    if (!primarySelectedObject) {
      return;
    }

    setSceneObjects((previousObjects) =>
      previousObjects.map((object) => {
        if (object.id !== primarySelectedObject.id) {
          return object;
        }

        return updateObjectPosition(object, axis, value);
      }),
    );
  }, [primarySelectedObject, recordHistory, selectedObjectIds, selectedObjects]);

  const handleRotationChange = useCallback((value) => {
    if (!primarySelectedObject) {
      return;
    }

    recordHistory();
    setSceneObjects((previousObjects) =>
      previousObjects.map((object) => {
        if (object.id !== primarySelectedObject.id) {
          return object;
        }

        return updateObjectRotation(object, value);
      }),
    );
  }, [primarySelectedObject, recordHistory]);

  const handleScaleChange = useCallback((value, isBatch = false) => {
    if (!selectedObjectIds.length) {
      return;
    }

    recordHistory();

    if (isBatch) {
      const targetIds = new Set(selectedObjectIds);

      setSceneObjects((previousObjects) =>
        previousObjects.map((object) => {
          if (!targetIds.has(object.id)) {
            return object;
          }

          return updateObjectScale(object, value);
        }),
      );

      return;
    }

    if (!primarySelectedObject) {
      return;
    }

    setSceneObjects((previousObjects) =>
      previousObjects.map((object) => {
        if (object.id !== primarySelectedObject.id) {
          return object;
        }

        return updateObjectScale(object, value);
      }),
    );
  }, [primarySelectedObject, recordHistory, selectedObjectIds]);

  const handleDuplicateObject = useCallback((objectId) => {
    const targetObject = sceneObjects.find((object) => object.id === objectId);

    if (!targetObject) {
      return;
    }

    const duplicatedObject = cloneSceneObject(targetObject);
    recordHistory();
    setSceneObjects((previousObjects) => [...previousObjects, duplicatedObject]);
    setSelectedObjectIds([duplicatedObject.id]);
    setFocusType(targetObject.type);
    setTransientStatus('已复制当前对象');
  }, [recordHistory, sceneObjects, setTransientStatus]);

  const handleToggleVisibility = useCallback((objectIds = selectedObjectIds) => {
    if (!objectIds.length) {
      return;
    }

    const targetIds = new Set(objectIds);
    const shouldShow = sceneObjects.some(
      (object) => targetIds.has(object.id) && !object.visible,
    );

    recordHistory();
    setSceneObjects((previousObjects) =>
      previousObjects.map((object) => {
        if (!targetIds.has(object.id)) {
          return object;
        }

        return {
          ...object,
          visible: shouldShow,
        };
      }),
    );
    setTransientStatus(shouldShow ? '对象已显示' : '对象已隐藏');
  }, [recordHistory, sceneObjects, selectedObjectIds, setTransientStatus]);

  const handleDeleteObject = useCallback((objectIds = selectedObjectIds) => {
    if (!objectIds.length) {
      return;
    }

    const targetIds = new Set(objectIds);
    recordHistory();
    setSceneObjects((previousObjects) =>
      previousObjects.filter((object) => !targetIds.has(object.id)),
    );
    setSelectedObjectIds((previousSelected) =>
      previousSelected.filter((objectId) => !targetIds.has(objectId)),
    );
    setTransientStatus(objectIds.length > 1 ? '已删除选中对象' : '对象已删除');
  }, [recordHistory, selectedObjectIds, setTransientStatus]);

  const handleMirrorObject = useCallback((objectId) => {
    const targetObject = sceneObjects.find((object) => object.id === objectId);

    if (!targetObject) {
      return;
    }

    const mirroredObject = createMirroredObject(targetObject);
    recordHistory();
    setSceneObjects((previousObjects) => [...previousObjects, mirroredObject]);
    setSelectedObjectIds([mirroredObject.id]);
    setFocusType(targetObject.type);
    setTransientStatus('已沿 X 轴镜像复制');
  }, [recordHistory, sceneObjects, setTransientStatus]);

  const handleArrayCopy = useCallback((objectId, count, spacing) => {
    const targetObject = sceneObjects.find((object) => object.id === objectId);

    if (!targetObject) {
      return;
    }

    const arrayObjects = createArrayCopies(targetObject, count, spacing);

    if (!arrayObjects.length) {
      return;
    }

    recordHistory();
    setSceneObjects((previousObjects) => [...previousObjects, ...arrayObjects]);
    setSelectedObjectIds(arrayObjects.map((object) => object.id));
    setFocusType(targetObject.type);
    setTransientStatus(`已生成 ${count} 列阵列`);
  }, [recordHistory, sceneObjects, setTransientStatus]);

  const handleUndo = useCallback(() => {
    if (!historyStack.length) {
      return;
    }

    const currentSnapshot = getCurrentSnapshot();
    const { nextHistory, snapshot } = popHistoryEntry(historyStack);

    setHistoryStack(nextHistory);
    setRedoStack((previousRedo) => pushHistoryEntry(previousRedo, currentSnapshot));
    applySnapshot(snapshot);
    setTransientStatus('已撤销');
  }, [applySnapshot, getCurrentSnapshot, historyStack, setTransientStatus]);

  const handleRedo = useCallback(() => {
    if (!redoStack.length) {
      return;
    }

    const currentSnapshot = getCurrentSnapshot();
    const { nextHistory, snapshot } = popHistoryEntry(redoStack);

    setRedoStack(nextHistory);
    setHistoryStack((previousHistory) => pushHistoryEntry(previousHistory, currentSnapshot));
    applySnapshot(snapshot);
    setTransientStatus('已重做');
  }, [applySnapshot, getCurrentSnapshot, redoStack, setTransientStatus]);

  const handleViewChange = useCallback((nextView) => {
    if (nextView === 'blueprint') {
      setShowBlueprintOverlay((previous) => !previous);
      return;
    }

    if (nextView === 'top' || nextView === 'perspective' || nextView === 'roam') {
      setCurrentView(nextView);
    }
  }, []);

  const buildPersistedPayload = useCallback(() => {
    return {
      currentWeather,
      currentLighting,
      currentView,
      showBlueprintOverlay,
      blueprintMode,
      focusType,
      selectedObjectIds,
      sceneObjects,
      showSteps,
      currentTemplate,
    };
  }, [
    blueprintMode,
    currentLighting,
    currentTemplate,
    currentView,
    currentWeather,
    focusType,
    sceneObjects,
    selectedObjectIds,
    showBlueprintOverlay,
    showSteps,
  ]);

  const handleSaveScheme = useCallback(() => {
    const saveSucceeded = saveBuilderState(buildPersistedPayload());
    setTransientStatus(saveSucceeded ? '方案已保存到本地' : '保存失败');
  }, [buildPersistedPayload, setTransientStatus]);

  const handleLoadScheme = useCallback(() => {
    const savedState = loadBuilderState();

    if (!savedState) {
      setTransientStatus('没有找到可读取的本地方案');
      return;
    }

    if (sceneObjects.length || selectedObjectIds.length) {
      recordHistory();
    }

    applyPersistedState(savedState);
    setTransientStatus('已读取本地方案');
  }, [
    applyPersistedState,
    recordHistory,
    sceneObjects.length,
    selectedObjectIds.length,
    setTransientStatus,
  ]);

  const handleExportJson = useCallback(() => {
    exportSceneJson(buildPersistedPayload());
    setTransientStatus('已导出 JSON');
  }, [buildPersistedPayload, setTransientStatus]);

  const handleImportJson = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleImportFileChange = useCallback(async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const importedScene = await readJsonFile(file);

      if (sceneObjects.length || selectedObjectIds.length) {
        recordHistory();
      }

      applyPersistedState({
        ...DEFAULT_STATE,
        ...importedScene,
      });
      setTransientStatus('已导入 JSON 方案');
    } catch (error) {
      console.error(error);
      setTransientStatus('导入失败，请检查 JSON 文件格式');
    } finally {
      event.target.value = '';
    }
  }, [
    applyPersistedState,
    recordHistory,
    sceneObjects.length,
    selectedObjectIds.length,
    setTransientStatus,
  ]);

  const handleExportScreenshot = useCallback(() => {
    const success = exportCanvasScreenshot();
    setTransientStatus(success ? '已导出场景截图' : '截图导出失败');
  }, [setTransientStatus]);

  const panelContent = useMemo(() => {
    switch (activeNav) {
      case 'components':
        return (
          <ComponentsPanel
            focusedType={focusType}
            sceneObjectCount={sceneObjects.length}
            onAddComponent={handleAddComponent}
            onOpenTemplates={() => setActiveNav('templates')}
          />
        );
      case 'templates':
        return (
          <TemplatesPanel
            currentTemplate={currentTemplate}
            onApplyTemplate={handleApplyTemplate}
            onClearScene={handleClearScene}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onExportScreenshot={handleExportScreenshot}
          />
        );
      case 'blueprint':
        return (
          <BlueprintPanel
            showSteps={showSteps}
            showBlueprintOverlay={showBlueprintOverlay}
            blueprintMode={blueprintMode}
            currentStep={currentStep}
            focusType={focusType}
            onToggleSteps={() => setShowSteps((previous) => !previous)}
            onToggleBlueprintOverlay={() => setShowBlueprintOverlay((previous) => !previous)}
            onChangeBlueprintMode={setBlueprintMode}
          />
        );
      case 'weather':
        return (
          <WeatherPanel
            currentWeather={currentWeather}
            onSelectWeather={setCurrentWeather}
          />
        );
      case 'lighting':
        return (
          <LightingPanel
            currentLighting={currentLighting}
            onSelectLighting={setCurrentLighting}
          />
        );
      case 'properties':
        return (
          <PropertiesPanel
            selectedObjects={selectedObjects}
            selectedObjectIds={selectedObjectIds}
            sceneObjects={sceneObjects}
            onSelectObject={handleSelectObject}
            onPositionChange={handlePositionChange}
            onRotationChange={handleRotationChange}
            onScaleChange={handleScaleChange}
            onDuplicateObject={handleDuplicateObject}
            onToggleVisibility={handleToggleVisibility}
            onDeleteObject={handleDeleteObject}
            onMirrorObject={handleMirrorObject}
            onArrayCopy={handleArrayCopy}
          />
        );
      default:
        return null;
    }
  }, [
    activeNav,
    blueprintMode,
    currentLighting,
    currentStep,
    currentTemplate,
    currentWeather,
    focusType,
    handleAddComponent,
    handleApplyTemplate,
    handleArrayCopy,
    handleDeleteObject,
    handleDuplicateObject,
    handleExportJson,
    handleExportScreenshot,
    handleImportJson,
    handleMirrorObject,
    handlePositionChange,
    handleRotationChange,
    handleScaleChange,
    handleSelectObject,
    handleToggleVisibility,
    sceneObjects,
    selectedObjectIds,
    selectedObjects,
    showBlueprintOverlay,
    showSteps,
  ]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink text-stone-100">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFileChange}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231,182,101,0.18),transparent_24%),linear-gradient(180deg,#2b211c_0%,#140f0d_58%,#090706_100%)]" />
      <div className="absolute inset-0 bg-scene-grid bg-[size:52px_52px] opacity-[0.14]" />
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-amber-200/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-orange-600/10 blur-3xl" />

      <BuilderScene
        currentWeather={currentWeather}
        currentLighting={currentLighting}
        currentView={currentView}
        showBlueprintOverlay={showBlueprintOverlay}
        blueprintMode={blueprintMode}
        focusType={primarySelectedObject?.type ?? focusType}
        sceneObjects={sceneObjects}
        selectedObjectIds={selectedObjectIds}
        onSelectObject={handleSelectObject}
        onClearSelection={handleClearSelection}
      />

      <div className="pointer-events-none absolute inset-0 z-20">
        <TopOverlay
          isRailHidden={isRailHidden}
          currentWeather={WEATHER_OPTIONS[currentWeather].label}
          currentLighting={LIGHTING_OPTIONS[currentLighting].label}
          currentFocus={currentFocusLabel}
          sceneObjectCount={sceneObjects.length}
          selectedCount={selectedObjectIds.length}
          statusMessage={statusMessage}
          canUndo={historyStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSaveScheme={handleSaveScheme}
          onLoadScheme={handleLoadScheme}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onExportScreenshot={handleExportScreenshot}
        />

        <FloatingStats stats={stats} isRailHidden={isRailHidden} />
        <EvaluationBadge
          isRailHidden={isRailHidden}
          evaluationSummary={evaluationSummary}
        />

        <div className="absolute inset-y-0 left-0 flex pointer-events-none">
          {!isRailHidden && (
            <>
              <div className="pointer-events-auto">
                <LeftRail
                  activeNav={activeNav}
                  onSelectNav={handleSelectNav}
                  onHideRail={handleHideRail}
                />
              </div>
              <div className="pointer-events-auto">
                <SidePanel
                  isOpen={isPanelOpen}
                  title={PANEL_META[activeNav].title}
                  description={PANEL_META[activeNav].description}
                  onClose={() => setIsPanelOpen(false)}
                >
                  {panelContent}
                </SidePanel>
              </div>
            </>
          )}
        </div>

        {isRailHidden && (
          <div className="pointer-events-auto">
            <ReopenRailButton onClick={handleReopenRail} />
          </div>
        )}

        <div className="pointer-events-auto">
          <ViewControls
            currentView={currentView}
            showBlueprintOverlay={showBlueprintOverlay}
            viewOptions={VIEW_OPTIONS}
            onChangeView={handleViewChange}
          />
        </div>

        {sceneObjects.length === 0 && (
          <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(460px,calc(100vw-3rem))] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-amber-300/20 bg-black/35 px-6 py-5 text-center shadow-glow backdrop-blur-xl">
            <p className="panel-heading">快速开始</p>
            <h2 className="mt-2 font-display text-2xl text-white">从构件库添加，或直接套用模板开始搭建</h2>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              当前场景为空。你可以从左侧添加单个构件，也可以一键生成四柱亭或单檐殿阁模板。
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveNav('components')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
              >
                打开构件库
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('pavilion')}
                className="rounded-2xl border border-amber-300/25 bg-amber-200/10 px-4 py-3 text-sm text-amber-100 transition hover:bg-amber-200/20"
              >
                生成四柱亭
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('hall')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
              >
                生成单檐殿阁
              </button>
            </div>
          </div>
        )}

        {showSteps && (
          <div className="pointer-events-auto absolute bottom-6 right-6 w-[min(360px,calc(100vw-2rem))] rounded-[28px] border border-white/10 bg-black/40 p-4 shadow-glow backdrop-blur-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="panel-heading">搭建步骤</p>
                <h2 className="mt-2 font-display text-xl text-white">右下角施工引导</h2>
                <p className="mt-1 text-sm text-stone-300">
                  当前建议先完成第 {currentStep} 步，按顺序搭建能更快形成规整轮廓。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSteps(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300 transition hover:bg-white/10"
              >
                隐藏
              </button>
            </div>

            <div className="space-y-2">
              {blueprintSteps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;

                return (
                  <div
                    key={step}
                    className={`flex gap-3 rounded-2xl border px-3 py-3 text-sm ${
                      isActive
                        ? 'border-amber-300/30 bg-amber-200/10 text-white'
                        : 'border-white/8 bg-white/5 text-stone-200'
                    }`}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-stone-950">
                      {stepNumber}
                    </div>
                    <p>{step}</p>
                  </div>
                );
              })}
            </div>

            {primarySelectedObject && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-stone-300">
                当前对象位置：x {formatNumber(primarySelectedObject.position[0])} / y {formatNumber(primarySelectedObject.position[1])} / z {formatNumber(primarySelectedObject.position[2])}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
