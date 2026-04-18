export default function AxisGuide() {
  return (
    <group position={[0, 0.03, 0]}>
      <mesh position={[0, 0, 0]} renderOrder={3}>
        <boxGeometry args={[0.05, 0.01, 28]} />
        <meshBasicMaterial color="#d9b783" transparent opacity={0.42} />
      </mesh>

      {[-6, -3, 3, 6].map((z) => (
        <mesh key={z} position={[0, 0, z]} renderOrder={3}>
          <boxGeometry args={[5.5, 0.01, 0.02]} />
          <meshBasicMaterial color="#c7a371" transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}
