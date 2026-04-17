export default function AxisGuide() {
  return (
    <group position={[0, 0.03, 0]}>
      <mesh receiveShadow position={[0, 0, 0]} renderOrder={3}>
        <boxGeometry args={[0.08, 0.02, 28]} />
        <meshBasicMaterial color="#d4ad73" transparent opacity={0.75} />
      </mesh>

      <mesh receiveShadow position={[0, 0, 0]} renderOrder={3}>
        <boxGeometry args={[18, 0.015, 0.06]} />
        <meshBasicMaterial color="#8f7758" transparent opacity={0.35} />
      </mesh>

      {[-6, -3, 3, 6].map((z) => (
        <mesh key={z} receiveShadow position={[0, 0, z]} renderOrder={3}>
          <boxGeometry args={[5.5, 0.012, 0.04]} />
          <meshBasicMaterial color="#c7a371" transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}
