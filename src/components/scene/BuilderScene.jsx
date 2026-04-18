import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import GroundPlane from './GroundPlane';
import SceneLights from './SceneLights';
import SceneObjectRenderer from './SceneObjectRenderer';
import BlueprintOverlay from './BlueprintOverlay';
import AxisGuide from './AxisGuide';
import PlacementGuides from './PlacementGuides';

const WEATHER_SCENES = {
  sunny: {
    background: '#7b5b45',
    fogColor: '#684d3d',
    fogNear: 20,
    fogFar: 46,
    groundColor: '#443227',
    accentColor: '#ddbe88',
  },
  dusk: {
    background: '#4f392e',
    fogColor: '#3f2c24',
    fogNear: 16,
    fogFar: 36,
    groundColor: '#37271f',
    accentColor: '#e4b575',
  },
  night: {
    background: '#121a24',
    fogColor: '#10161f',
    fogNear: 12,
    fogFar: 26,
    groundColor: '#161d25',
    accentColor: '#7f95aa',
  },
};

export default function BuilderScene({
  currentWeather,
  currentLighting,
  currentView,
  showBlueprintOverlay,
  blueprintMode,
  focusType,
  sceneObjects,
  selectedObjectIds,
  onSelectObject,
  onClearSelection,
}) {
  const weatherConfig = WEATHER_SCENES[currentWeather];
  const controlsRef = useRef(null);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onPointerMissed={(event) => {
          if (!event.nativeEvent.shiftKey) {
            onClearSelection();
          }
        }}
      >
        <PerspectiveCamera makeDefault position={[13.2, 5.2, 10.9]} fov={30} />
        <SceneAtmosphere weatherConfig={weatherConfig} />
        <CameraRig currentView={currentView} controlsRef={controlsRef} />
        <SceneLights currentWeather={currentWeather} currentLighting={currentLighting} />

        <group position={[0, -0.18, 0]}>
          <GroundPlane
            groundColor={weatherConfig.groundColor}
            accentColor={weatherConfig.accentColor}
          />
          {showBlueprintOverlay && (
            <>
              <AxisGuide />
              <BlueprintOverlay blueprintMode={blueprintMode} />
              <PlacementGuides blueprintMode={blueprintMode} focusType={focusType} />
            </>
          )}
          {sceneObjects.map((sceneObject) => (
            <SceneObjectRenderer
              key={sceneObject.id}
              object={sceneObject}
              isSelected={selectedObjectIds.includes(sceneObject.id)}
              onSelectObject={onSelectObject}
            />
          ))}
        </group>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={currentView === 'roam'}
          enableRotate={currentView !== 'top'}
          minDistance={7}
          maxDistance={26}
          maxPolarAngle={Math.PI / 2.08}
        />
      </Canvas>
    </div>
  );
}

function SceneAtmosphere({ weatherConfig }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(weatherConfig.background);
    scene.fog = new THREE.Fog(
      weatherConfig.fogColor,
      weatherConfig.fogNear,
      weatherConfig.fogFar,
    );

    return () => {
      scene.fog = null;
    };
  }, [scene, weatherConfig]);

  return null;
}

function CameraRig({ currentView, controlsRef }) {
  const { camera } = useThree();
  const isAnimatingRef = useRef(true);
  const targetState = useMemo(() => {
    if (currentView === 'top') {
      return {
        position: new THREE.Vector3(0, 18, 0.01),
        target: new THREE.Vector3(0, 1, 0),
      };
    }

    if (currentView === 'roam') {
      return {
        position: new THREE.Vector3(14.2, 6.1, 15.8),
        target: new THREE.Vector3(0, 2.8, 0),
      };
    }

    return {
      position: new THREE.Vector3(13.2, 5.2, 10.9),
      target: new THREE.Vector3(0, 2.45, 0),
    };
  }, [currentView]);

  useEffect(() => {
    isAnimatingRef.current = true;
  }, [currentView]);

  useFrame(() => {
    const controls = controlsRef.current;

    if (!controls || !isAnimatingRef.current) {
      return;
    }

    camera.position.lerp(targetState.position, 0.08);
    controls.target.lerp(targetState.target, 0.08);
    controls.update();

    if (
      camera.position.distanceTo(targetState.position) < 0.05 &&
      controls.target.distanceTo(targetState.target) < 0.05
    ) {
      isAnimatingRef.current = false;
    }
  });

  return null;
}
