export default function GroundPlane({ groundColor, accentColor }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[4.2, 11.6, 64]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.12} />
      </mesh>

      <gridHelper args={[40, 80, '#8b6f53', '#4b392a']} position={[0, 0.02, 0]} />
    </group>
  );
}
