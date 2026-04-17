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
    background: '#8a694c',
    fogColor: '#6f5745',
    fogNear: 18,
    fogFar: 42,
    groundColor: '#4f3d2d',
    accentColor: '#e7c58f',
  },
  rainMist: {
    background: '#51606b',
    fogColor: '#4f5b64',
    fogNear: 10,
    fogFar: 28,
    groundColor: '#303a41',
    accentColor: '#aeb7bf',
  },
  snow: {
    background: '#a5b2ba',
    fogColor: '#b2bdc6',
    fogNear: 14,
    fogFar: 34,
    groundColor: '#d5dde2',
    accentColor: '#f7fbff',
  },
  dusk: {
    background: '#5a3e32',
    fogColor: '#50352f',
    fogNear: 16,
    fogFar: 35,
    groundColor: '#432b22',
    accentColor: '#efb774',
  },
  night: {
    background: '#13202f',
    fogColor: '#101927',
    fogNear: 12,
    fogFar: 24,
    groundColor: '#17212b',
    accentColor: '#7fa4c8',
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
        gl={{ preserveDrawingBuffer: true }}
        onPointerMissed={(event) => {
          if (!event.nativeEvent.shiftKey) {
            onClearSelection();
          }
        }}
      >
        <PerspectiveCamera makeDefault position={[9, 6, 10]} fov={42} />
        <SceneAtmosphere weatherConfig={weatherConfig} />
        <CameraRig currentView={currentView} controlsRef={controlsRef} />
        <SceneLights currentWeather={currentWeather} currentLighting={currentLighting} />

        <group position={[0, -0.15, 0]}>
          <GroundPlane
            groundColor={weatherConfig.groundColor}
            accentColor={weatherConfig.accentColor}
          />
          <AxisGuide />
          {showBlueprintOverlay && (
            <>
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
          enablePan
          enableRotate={currentView !== 'top'}
          minDistance={6}
          maxDistance={28}
          maxPolarAngle={Math.PI / 2.05}
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
        position: new THREE.Vector3(0, 17, 0.01),
        target: new THREE.Vector3(0, 0.8, 0),
      };
    }

    if (currentView === 'roam') {
      return {
        position: new THREE.Vector3(12, 4.5, 12),
        target: new THREE.Vector3(0, 2.2, 0),
      };
    }

    return {
      position: new THREE.Vector3(9, 6, 10),
      target: new THREE.Vector3(0, 2.5, 0),
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

    camera.position.lerp(targetState.position, 0.1);
    controls.target.lerp(targetState.target, 0.1);
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
