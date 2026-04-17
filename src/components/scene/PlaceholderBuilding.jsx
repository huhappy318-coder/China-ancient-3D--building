import * as THREE from 'three';

export default function PlaceholderBuilding({
  selectedPartType,
  selectedObject,
  objectTransform,
  sceneOptions,
  onSelectObject,
}) {
  if (objectTransform.deleted || !objectTransform.visible) {
    return null;
  }

  const roofIsSelected = selectedObject?.id === 'roof';
  const buildingIsSelected = selectedObject?.id === 'building';
  const roofColor = sceneOptions.roofType === 'wudian' ? '#5c2d20' : '#4f2a1f';
  const highlight = roofIsSelected || buildingIsSelected ? '#f7cc7a' : '#000000';

  return (
    <group
      position={[0, objectTransform.height, 0]}
      rotation={[0, THREE.MathUtils.degToRad(objectTransform.rotation), 0]}
      scale={[objectTransform.scale, objectTransform.scale, objectTransform.scale]}
      onClick={(event) => {
        event.stopPropagation();
        onSelectObject({ id: 'building', label: '主体建筑' });
      }}
    >
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[7.4, 1, 5.8]} />
        <meshStandardMaterial
          color={buildingIsSelected ? '#8e6741' : '#6e5034'}
          emissive={highlight}
          emissiveIntensity={buildingIsSelected ? 0.12 : 0}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
        <boxGeometry args={[5.8, 1.5, 4.2]} />
        <meshStandardMaterial color="#5a4030" roughness={0.85} />
      </mesh>

      <Columns />
      <Beams />
      <Roof
        roofType={sceneOptions.roofType}
        showEaves={sceneOptions.showEaves}
        roofColor={roofColor}
        selected={roofIsSelected}
        onSelectObject={onSelectObject}
      />

      {sceneOptions.showStairs && <Stairs />}

      <mesh castShadow receiveShadow position={[0, 1.25, 2.16]}>
        <boxGeometry args={[1.6, 1.2, 0.12]} />
        <meshStandardMaterial color="#3f2b22" />
      </mesh>

      <mesh position={[0, 4.85, 0]} visible={selectedPartType === '斗拱'}>
        <torusGeometry args={[1.9, 0.08, 8, 24]} />
        <meshStandardMaterial color="#b98a52" emissive="#b98a52" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Columns() {
  const positions = [
    [-2.4, 1.8, -1.7],
    [0, 1.8, -1.7],
    [2.4, 1.8, -1.7],
    [-2.4, 1.8, 1.7],
    [0, 1.8, 1.7],
    [2.4, 1.8, 1.7],
  ];

  return (
    <>
      {positions.map((position, index) => (
        <mesh key={index} castShadow receiveShadow position={position}>
          <cylinderGeometry args={[0.18, 0.22, 2.6, 24]} />
          <meshStandardMaterial color="#9f6f3c" metalness={0.05} roughness={0.55} />
        </mesh>
      ))}
    </>
  );
}

function Beams() {
  return (
    <>
      <mesh castShadow receiveShadow position={[0, 3.1, 0]}>
        <boxGeometry args={[5.8, 0.28, 4.3]} />
        <meshStandardMaterial color="#704d31" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.45, 0]}>
        <boxGeometry args={[4.4, 0.18, 0.28]} />
        <meshStandardMaterial color="#7e5837" />
      </mesh>
    </>
  );
}

function Roof({ roofType, showEaves, roofColor, selected, onSelectObject }) {
  return (
    <group
      position={[0, 4.2, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelectObject({ id: 'roof', label: '屋顶' });
      }}
    >
      {roofType === 'wudian' ? (
        <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.7, 3.85, 1.7, 4]} />
          <meshStandardMaterial
            color={roofColor}
            emissive={selected ? '#f4c56e' : '#000000'}
            emissiveIntensity={selected ? 0.22 : 0}
            roughness={0.7}
          />
        </mesh>
      ) : (
        <>
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.95, 4.2, 1.25, 4]} />
            <meshStandardMaterial
              color={roofColor}
              emissive={selected ? '#f4c56e' : '#000000'}
              emissiveIntensity={selected ? 0.22 : 0}
              roughness={0.72}
            />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.62, 0]}>
            <boxGeometry args={[4.6, 0.14, 0.28]} />
            <meshStandardMaterial color="#84513d" />
          </mesh>
        </>
      )}

      {showEaves && (
        <>
          <mesh castShadow receiveShadow position={[0, -0.35, 0]}>
            <boxGeometry args={[7, 0.12, 5.4]} />
            <meshStandardMaterial color="#8e5f41" />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
            <boxGeometry args={[5.8, 0.08, 6.2]} />
            <meshStandardMaterial color="#7c5239" />
          </mesh>
        </>
      )}
    </group>
  );
}

function Stairs() {
  return (
    <group position={[0, 0, 3.22]}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          castShadow
          receiveShadow
          position={[0, 0.16 + index * 0.12, index * 0.4]}
        >
          <boxGeometry args={[2.4 - index * 0.3, 0.18, 0.5]} />
          <meshStandardMaterial color="#93816d" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
