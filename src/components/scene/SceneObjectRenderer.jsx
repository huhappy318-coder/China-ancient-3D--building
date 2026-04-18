import * as THREE from 'three';

function materialProps(color, isSelected, roughness = 0.7, metalness = 0.05) {
  const nextColor = new THREE.Color(color);

  if (isSelected) {
    nextColor.offsetHSL(0, 0.02, 0.1);
  }

  return {
    color: nextColor,
    roughness,
    metalness,
    emissive: isSelected ? '#f3c979' : '#000000',
    emissiveIntensity: isSelected ? 0.18 : 0,
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
        <group>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[4.5, 0.78, 4.1]} />
            <meshStandardMaterial {...materialProps('#6f5740', isSelected, 0.92)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
            <boxGeometry args={[4.05, 0.12, 3.65]} />
            <meshStandardMaterial {...materialProps('#8a6c4a', isSelected, 0.88)} />
          </mesh>
        </group>
      );
    case 'column':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, -1.42, 0]}>
            <cylinderGeometry args={[0.34, 0.38, 0.14, 20]} />
            <meshStandardMaterial {...materialProps('#8d7659', isSelected, 0.82)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 3.1, 28]} />
            <meshStandardMaterial {...materialProps('#9f6f3c', isSelected, 0.52)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.63, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 20]} />
            <meshStandardMaterial {...materialProps('#866042', isSelected, 0.66)} />
          </mesh>
        </group>
      );
    case 'beam':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[4.8, 0.28, 0.34]} />
            <meshStandardMaterial {...materialProps('#6f4b33', isSelected, 0.66)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[4.2, 0.08, 0.18]} />
            <meshStandardMaterial {...materialProps('#8a5d40', isSelected, 0.72)} />
          </mesh>
        </group>
      );
    case 'roof':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, -0.92, 0]}>
            <boxGeometry args={[6.95, 0.16, 5.4]} />
            <meshStandardMaterial {...materialProps('#6d4837', isSelected, 0.76)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.08, -1.02]} rotation={[-0.34, 0, 0]}>
            <boxGeometry args={[6.4, 0.18, 2.64]} />
            <meshStandardMaterial {...materialProps('#5a3127', isSelected, 0.68)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.08, 1.02]} rotation={[0.34, 0, 0]}>
            <boxGeometry args={[6.4, 0.18, 2.64]} />
            <meshStandardMaterial {...materialProps('#5a3127', isSelected, 0.68)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.36, -1.92]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[7.28, 0.12, 1.1]} />
            <meshStandardMaterial {...materialProps('#7a4d37', isSelected, 0.72)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.36, 1.92]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[7.28, 0.12, 1.1]} />
            <meshStandardMaterial {...materialProps('#7a4d37', isSelected, 0.72)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
            <boxGeometry args={[6.2, 0.1, 0.16]} />
            <meshStandardMaterial {...materialProps('#b18b63', isSelected, 0.54)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.36, -2.25]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.22, 0.16, 0.62]} />
            <meshStandardMaterial {...materialProps('#bb9766', isSelected, 0.56)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.36, 2.25]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.22, 0.16, 0.62]} />
            <meshStandardMaterial {...materialProps('#bb9766', isSelected, 0.56)} />
          </mesh>
        </group>
      );
    case 'eaves':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, -0.12, 0]}>
            <boxGeometry args={[7.6, 0.1, 5.8]} />
            <meshStandardMaterial {...materialProps('#8f6243', isSelected, 0.72)} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[6.2, 0.08, 6.8]} />
            <meshStandardMaterial {...materialProps('#744e37', isSelected, 0.76)} />
          </mesh>
        </group>
      );
    case 'stairs':
      return (
        <group>
          {[0, 1, 2, 3].map((index) => (
            <mesh
              key={index}
              castShadow
              receiveShadow
              position={[0, -0.27 + index * 0.11, index * 0.34]}
            >
              <boxGeometry args={[2.95 - index * 0.3, 0.18, 0.46]} />
              <meshStandardMaterial {...materialProps('#978169', isSelected, 0.96)} />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}
