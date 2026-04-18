import { useCallback, useMemo, useState } from 'react';
import LeftRail from './components/layout/LeftRail';
import SidePanel from './components/layout/SidePanel';
import ReopenRailButton from './components/layout/ReopenRailButton';
import ComponentsPanel from './components/panels/ComponentsPanel';
import BlueprintPanel from './components/panels/BlueprintPanel';
import LightingPanel from './components/panels/LightingPanel';
import BuilderScene from './components/scene/BuilderScene';
import { createSceneObject } from './utils/sceneObjectFactory';
import { createTemplateScene } from './utils/templates';

const DEFAULT_TEMPLATE_KEY = 'hall';

const PANEL_META = {
  components: {
    title: '构件',
    description: '选择构件，直接把它加入场景中继续搭建。',
  },
  blueprint: {
    title: '教程',
    description: '按步骤搭建，并在需要时打开图纸参考。',
  },
  lighting: {
    title: '光影',
    description: '切换天气与时段，让建筑处在更合适的氛围里。',
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
};

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

  const primarySelectedObject = useMemo(() => {
    return selectedObjectIds
      .map((objectId) => sceneObjects.find((object) => object.id === objectId))
      .filter(Boolean)
      .at(-1) ?? null;
  }, [sceneObjects, selectedObjectIds]);

  const currentStep = useMemo(
    () => getCurrentStep(sceneObjects, primarySelectedObject?.type ?? focusType),
    [focusType, primarySelectedObject?.type, sceneObjects],
  );

  const handleSelectNav = useCallback((navKey) => {
    setIsRailHidden(false);
    setActiveNav(navKey);
    setIsPanelOpen((previousOpen) => (activeNav === navKey ? !previousOpen : true));
  }, [activeNav]);

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

    setSceneObjects((previousObjects) => [...previousObjects, nextObject]);
    setSelectedObjectIds([nextObject.id]);
    setFocusType(item.objectType);
  }, [sceneObjects]);

  const handleClearScene = useCallback(() => {
    setSceneObjects([]);
    setSelectedObjectIds([]);
  }, []);

  const panelContent = useMemo(() => {
    switch (activeNav) {
      case 'components':
        return (
          <ComponentsPanel
            focusedType={primarySelectedObject?.type ?? focusType}
            sceneObjectCount={sceneObjects.length}
            onAddComponent={handleAddComponent}
            onClearScene={handleClearScene}
          />
        );
      case 'blueprint':
        return (
          <BlueprintPanel
            currentView={currentView}
            currentStep={currentStep}
            focusType={primarySelectedObject?.type ?? focusType}
            showBlueprintOverlay={showBlueprintOverlay}
            blueprintMode={blueprintMode}
            onChangeView={setCurrentView}
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
      default:
        return null;
    }
  }, [
    activeNav,
    blueprintMode,
    currentLighting,
    currentStep,
    currentView,
    currentWeather,
    focusType,
    handleAddComponent,
    handleClearScene,
    primarySelectedObject?.type,
    sceneObjects.length,
    showBlueprintOverlay,
  ]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,176,95,0.14),transparent_24%),linear-gradient(180deg,#241a16_0%,#120f0d_58%,#090706_100%)]" />

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
      </div>
    </div>
  );
}
