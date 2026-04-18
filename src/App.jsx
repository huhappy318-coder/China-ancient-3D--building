import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LeftRail from './components/layout/LeftRail';
import SidePanel from './components/layout/SidePanel';
import TopOverlay from './components/layout/TopOverlay';
import ViewControls from './components/layout/ViewControls';
import ReopenRailButton from './components/layout/ReopenRailButton';
import ComponentsPanel from './components/panels/ComponentsPanel';
import BlueprintPanel from './components/panels/BlueprintPanel';
import LightingPanel from './components/panels/LightingPanel';
import PropertiesPanel from './components/panels/PropertiesPanel';
import BuilderScene from './components/scene/BuilderScene';
import {
  createSceneObject,
  cloneSceneObject,
  getObjectLabel,
  updateObjectPosition,
  updateObjectRotation,
  updateObjectScale,
} from './utils/sceneObjectFactory';
import { loadBuilderState, saveBuilderState } from './utils/storage';
import { createHistorySnapshot, popHistoryEntry, pushHistoryEntry } from './utils/history';
import { createTemplateScene, getTemplateDefinitions } from './utils/templates';
import { evaluateScene } from './utils/evaluation';
import { createMirroredObject } from './utils/mirror';
import { createArrayCopies } from './utils/arrayCopy';
import { exportCanvasScreenshot, exportSceneJson } from './utils/exportScene';
import { readJsonFile } from './utils/importScene';

const DEFAULT_TEMPLATE_KEY = 'hall';

const VIEW_OPTIONS = [
  { key: 'top', label: '俯视' },
  { key: 'perspective', label: '透视' },
  { key: 'blueprint', label: '图纸叠加' },
  { key: 'roam', label: '漫游' },
];

const PANEL_META = {
  components: {
    title: '构件',
    description: '添加构件，或直接套用模板开始搭建。',
  },
  blueprint: {
    title: '图纸',
    description: '按中轴与步骤提示，安静地完成结构布局。',
  },
  lighting: {
    title: '光影',
    description: '切换天气与时段，让场景氛围更贴近展示状态。',
  },
  properties: {
    title: '属性',
    description: '对象编辑、更多操作与反馈都收在这里。',
  },
};

const DEFAULT_STATE = {
  activeNav: 'components',
  isRailHidden: false,
  isPanelOpen: false,
  currentWeather: 'dusk',
  currentLighting: 'sunset',
  currentView: 'perspective',
  showBlueprintOverlay: false,
  blueprintMode: 'plan',
  focusType: 'roof',
  selectedObjectIds: [],
  showSteps: false,
  currentTemplate: DEFAULT_TEMPLATE_KEY,
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
  const [sceneObjects, setSceneObjects] = useState(() => createTemplateScene(DEFAULT_TEMPLATE_KEY));
  const [showSteps, setShowSteps] = useState(DEFAULT_STATE.showSteps);
  const [currentTemplate, setCurrentTemplate] = useState(DEFAULT_STATE.currentTemplate);
  const [statusMessage, setStatusMessage] = useState('点击左侧展开功能');
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
    setSceneObjects(payload.sceneObjects ?? createTemplateScene(DEFAULT_TEMPLATE_KEY));
    setSelectedObjectIds(payload.selectedObjectIds ?? []);
    setShowSteps(payload.showSteps ?? DEFAULT_STATE.showSteps);
    setCurrentTemplate(payload.currentTemplate ?? DEFAULT_STATE.currentTemplate);
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
      setStatusMessage('点击左侧展开功能');
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
      setStatusMessage('已恢复上次场景');
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
    setTransientStatus(`已添加${item.label}`);
  }, [recordHistory, sceneObjects, setTransientStatus]);

  const handleApplyTemplate = useCallback((templateKey) => {
    const templateObjects = createTemplateScene(templateKey);

    recordHistory();
    setSceneObjects(templateObjects);
    setSelectedObjectIds([]);
    setCurrentTemplate(templateKey);
    setShowBlueprintOverlay(false);
    setBlueprintMode('plan');
    setFocusType('roof');
    setTransientStatus(`已套用${templateLabelMap[templateKey]}`);
  }, [recordHistory, setTransientStatus]);

  const handleClearScene = useCallback(() => {
    recordHistory();
    setSceneObjects([]);
    setSelectedObjectIds([]);
    setCurrentTemplate(null);
    setFocusType(DEFAULT_STATE.focusType);
    setTransientStatus('已清空场景');
  }, [recordHistory, setTransientStatus]);

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
    setTransientStatus('已复制对象');
  }, [recordHistory, sceneObjects, setTransientStatus]);

  const handleToggleVisibility = useCallback((objectIds = selectedObjectIds) => {
    if (!objectIds.length) {
      return;
    }

    const targetIds = new Set(objectIds);
    const shouldShow = sceneObjects.some((object) => targetIds.has(object.id) && !object.visible);

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
    setTransientStatus(objectIds.length > 1 ? '已删除选中对象' : '已删除对象');
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
    setTransientStatus('已沿中轴镜像复制');
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
    setTransientStatus('已生成阵列复制');
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
    setTransientStatus(saveSucceeded ? '已保存到本地' : '保存失败');
  }, [buildPersistedPayload, setTransientStatus]);

  const handleLoadScheme = useCallback(() => {
    const savedState = loadBuilderState();

    if (!savedState) {
      setTransientStatus('没有找到本地方案');
      return;
    }

    recordHistory();
    applyPersistedState(savedState);
    setTransientStatus('已读取本地方案');
  }, [applyPersistedState, recordHistory, setTransientStatus]);

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
      recordHistory();
      applyPersistedState({
        ...DEFAULT_STATE,
        ...importedScene,
      });
      setTransientStatus('已导入方案');
    } catch (error) {
      console.error(error);
      setTransientStatus('导入失败，请检查文件格式');
    } finally {
      event.target.value = '';
    }
  }, [applyPersistedState, recordHistory, setTransientStatus]);

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
            currentTemplate={currentTemplate}
            sceneObjectCount={sceneObjects.length}
            onAddComponent={handleAddComponent}
            onApplyTemplate={handleApplyTemplate}
            onClearScene={handleClearScene}
          />
        );
      case 'blueprint':
        return (
          <BlueprintPanel
            showSteps={showSteps}
            showBlueprintOverlay={showBlueprintOverlay}
            blueprintMode={blueprintMode}
            currentStep={currentStep}
            focusType={primarySelectedObject?.type ?? focusType}
            onToggleSteps={() => setShowSteps((previous) => !previous)}
            onToggleBlueprintOverlay={() => setShowBlueprintOverlay((previous) => !previous)}
            onChangeBlueprintMode={setBlueprintMode}
          />
        );
      case 'lighting':
        return (
          <LightingPanel
            currentWeather={currentWeather}
            currentLighting={currentLighting}
            onSelectWeather={setCurrentWeather}
            onSelectLighting={setCurrentLighting}
          />
        );
      case 'properties':
        return (
          <PropertiesPanel
            selectedObjects={selectedObjects}
            selectedObjectIds={selectedObjectIds}
            sceneObjects={sceneObjects}
            evaluationSummary={evaluationSummary}
            canUndo={historyStack.length > 0}
            canRedo={redoStack.length > 0}
            onSelectObject={handleSelectObject}
            onPositionChange={handlePositionChange}
            onRotationChange={handleRotationChange}
            onScaleChange={handleScaleChange}
            onDuplicateObject={handleDuplicateObject}
            onToggleVisibility={handleToggleVisibility}
            onDeleteObject={handleDeleteObject}
            onMirrorObject={handleMirrorObject}
            onArrayCopy={handleArrayCopy}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSaveScheme={handleSaveScheme}
            onLoadScheme={handleLoadScheme}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onExportScreenshot={handleExportScreenshot}
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
    evaluationSummary,
    focusType,
    handleAddComponent,
    handleApplyTemplate,
    handleArrayCopy,
    handleClearScene,
    handleDeleteObject,
    handleDuplicateObject,
    handleExportJson,
    handleExportScreenshot,
    handleImportJson,
    handleLoadScheme,
    handleMirrorObject,
    handlePositionChange,
    handleRedo,
    handleRotationChange,
    handleSaveScheme,
    handleScaleChange,
    handleSelectObject,
    handleToggleVisibility,
    handleUndo,
    historyStack.length,
    primarySelectedObject?.type,
    redoStack.length,
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,176,95,0.16),transparent_26%),linear-gradient(180deg,#241a16_0%,#120f0d_60%,#090706_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(247,211,157,0.08),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(102,66,33,0.14),transparent_34%)]" />

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
        <TopOverlay isRailHidden={isRailHidden} />

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
          <div className="pointer-events-auto absolute bottom-24 left-1/2 w-[min(320px,calc(100vw-2rem))] -translate-x-1/2 rounded-full border border-white/10 bg-black/25 px-5 py-3 text-center text-sm text-stone-300 backdrop-blur-xl">
            从左侧构件库添加建筑构件，或套用一个模板重新开始。
          </div>
        )}
      </div>
    </div>
  );
}
