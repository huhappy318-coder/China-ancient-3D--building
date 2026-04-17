function guideMaterial(opacity, color) {
  return <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />;
}

export default function PlacementGuides({ blueprintMode, focusType }) {
  const platformOpacity = focusType === 'platform' ? 0.48 : 0.18;
  const columnOpacity = focusType === 'column' ? 0.7 : 0.28;
  const beamOpacity = focusType === 'beam' ? 0.62 : 0.22;
  const roofOpacity = focusType === 'roof' || focusType === 'eaves' ? 0.48 : 0.16;

  return (
    <group position={[0, 0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} visible={blueprintMode === 'plan'}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#dcb882" transparent opacity={0.04} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[8.4, 0.04, 6.2]} />
        {guideMaterial(platformOpacity, '#d5ae71')}
      </mesh>

      {[
        [-3, 1.5, -2.2],
        [0, 1.5, -2.2],
        [3, 1.5, -2.2],
        [-3, 1.5, 0],
        [0, 1.5, 0],
        [3, 1.5, 0],
        [-3, 1.5, 2.2],
        [0, 1.5, 2.2],
        [3, 1.5, 2.2],
      ].map((position, index) => (
        <mesh
          key={index}
          position={position}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={blueprintMode === 'plan'}
        >
          <ringGeometry args={[0.18, 0.3, 24]} />
          {guideMaterial(columnOpacity, '#f4cf93')}
        </mesh>
      ))}

      {[
        [0, 3.2, -2.2, 8.6, 0.08, 0.18],
        [0, 3.2, 0, 8.6, 0.08, 0.18],
        [0, 3.2, 2.2, 8.6, 0.08, 0.18],
      ].map(([x, y, z, w, h, d], index) => (
        <mesh key={index} position={[x, y, z]} visible={blueprintMode === 'structure'}>
          <boxGeometry args={[w, h, d]} />
          {guideMaterial(beamOpacity, '#b7d5f1')}
        </mesh>
      ))}

      <mesh position={[0, 4.7, 0]} visible={blueprintMode === 'structure'}>
        <boxGeometry args={[7.2, 1.6, 5.8]} />
        {guideMaterial(roofOpacity, '#e8bd76')}
      </mesh>
    </group>
  );
}
