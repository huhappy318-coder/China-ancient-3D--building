export default function GroundPlane({ groundColor, accentColor }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color={groundColor} roughness={0.97} metalness={0.03} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[5.6, 10.8, 80]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.08} depthWrite={false} />
      </mesh>

      <gridHelper args={[34, 34, '#4c3b2f', '#2b221c']} position={[0, 0.015, 0]} />
    </group>
  );
}
