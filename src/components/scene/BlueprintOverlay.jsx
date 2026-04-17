export default function BlueprintOverlay({ blueprintMode }) {
  const columnMarks = [
    [-2.5, 0.03, -1.8],
    [2.5, 0.03, -1.8],
    [-2.5, 0.03, 1.8],
    [2.5, 0.03, 1.8],
  ];

  return (
    <group position={[0, 0.04, 0]} visible={blueprintMode === 'plan'}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#d8b178" transparent opacity={0.08} depthWrite={false} />
      </mesh>

      <RectFrame size={[7.2, 5.2]} color="#e3bb7b" opacity={0.5} />
      <RectFrame size={[5.2, 3.8]} color="#efca91" opacity={0.38} />
      <RectFrame size={[3.2, 1.6]} position={[0, 0, 3.2]} color="#b8d7ef" opacity={0.35} />

      {columnMarks.map((position, index) => (
        <mesh key={index} position={position} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
          <ringGeometry args={[0.2, 0.34, 24]} />
          <meshBasicMaterial color="#f3cf95" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function RectFrame({ size, position = [0, 0, 0], color, opacity }) {
  const [width, depth] = size;
  const thickness = 0.04;

  return (
    <group position={position}>
      <mesh position={[0, 0, depth / 2]} renderOrder={3}>
        <boxGeometry args={[width, 0.02, thickness]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, -depth / 2]} renderOrder={3}>
        <boxGeometry args={[width, 0.02, thickness]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[width / 2, 0, 0]} renderOrder={3}>
        <boxGeometry args={[thickness, 0.02, depth]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-width / 2, 0, 0]} renderOrder={3}>
        <boxGeometry args={[thickness, 0.02, depth]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
