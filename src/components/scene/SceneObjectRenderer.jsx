import * as THREE from 'three';

function materialProps(color, isSelected, roughness = 0.7, metalness = 0.05) {
  const nextColor = new THREE.Color(color);

  if (isSelected) {
    nextColor.offsetHSL(0, 0.03, 0.12);
  }

  return {
    color: nextColor,
    roughness,
    metalness,
    emissive: isSelected ? '#f3c979' : '#000000',
    emissiveIntensity: isSelected ? 0.28 : 0,
  };
}

export default function SceneObjectRenderer({ object, isSelected, onSelectObject }) {
  if (!object.visible) {
    return null;
  }

  return (
    <group
      position={object.position}
      rotation={object.rotation.map((value) => THREE.MathUtils.degToRad(value))}
      scale={object.scale}
      onClick={(event) => {
        event.stopPropagation();
        onSelectObject(object.id, { append: event.nativeEvent.shiftKey });
      }}
    >
      {renderObjectGeometry(object, isSelected)}
    </group>
  );
}

function renderObjectGeometry(object, isSelected) {
  switch (object.type) {
    case 'platform':
      return (
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 0.7, 3.8]} />
          <meshStandardMaterial {...materialProps('#776049', isSelected, 0.9)} />
        </mesh>
      );
    case 'column':
      return (
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.27, 3, 24]} />
          <meshStandardMaterial {...materialProps('#9e6c3b', isSelected, 0.55)} />
        </mesh>
      );
    case 'beam':
      return (
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 0.32, 0.42]} />
          <meshStandardMaterial {...materialProps('#734f34', isSelected, 0.68)} />
        </mesh>
      );
    case 'roof':
      return (
        <group>
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.75, 2.9, 1.6, 4]} />
            <meshStandardMaterial {...materialProps('#5a2f22', isSelected, 0.72)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.62, 0]}>
            <boxGeometry args={[4.3, 0.16, 2.9]} />
            <meshStandardMaterial {...materialProps('#7c5440', isSelected, 0.76)} />
          </mesh>
        </group>
      );
    case 'eaves':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[5.6, 0.12, 3.8]} />
            <meshStandardMaterial {...materialProps('#8a5d3f', isSelected, 0.72)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[4.2, 0.08, 4.8]} />
            <meshStandardMaterial {...materialProps('#744e37', isSelected, 0.75)} />
          </mesh>
        </group>
      );
    case 'stairs':
      return (
        <group>
          {[0, 1, 2].map((index) => (
            <mesh
              key={index}
              castShadow
              receiveShadow
              position={[0, -0.18 + index * 0.12, index * 0.42]}
            >
              <boxGeometry args={[2.4 - index * 0.3, 0.2, 0.55]} />
              <meshStandardMaterial {...materialProps('#948069', isSelected, 0.95)} />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}
