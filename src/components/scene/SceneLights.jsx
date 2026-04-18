const WEATHER_LIGHT = {
  sunny: { ambient: 0.95, dir: 1.7, fill: 0.45, color: '#ffe1af', fillColor: '#cfc0a4' },
  dusk: { ambient: 0.68, dir: 1.35, fill: 0.38, color: '#ffbe74', fillColor: '#8a6a53' },
  night: { ambient: 0.24, dir: 0.45, fill: 0.55, color: '#89a9d3', fillColor: '#ffc07b' },
};

const LIGHTING_PRESET = {
  dawn: { ambientFactor: 0.92, dirFactor: 0.95, fillFactor: 0.82, dirPos: [9, 7, 5], dirColor: '#ffd3a2' },
  sunset: { ambientFactor: 0.86, dirFactor: 1.08, fillFactor: 0.7, dirPos: [-11, 7, 8], dirColor: '#ffaf6a' },
  soft: { ambientFactor: 1.0, dirFactor: 0.78, fillFactor: 0.92, dirPos: [6, 8, 7], dirColor: '#f1e0c6' },
  noon: { ambientFactor: 1.04, dirFactor: 1.15, fillFactor: 0.72, dirPos: [4, 12, 3], dirColor: '#fff0cf' },
  lantern: { ambientFactor: 0.38, dirFactor: 0.52, fillFactor: 0.92, dirPos: [2, 5, 3], dirColor: '#f8d07b' },
};

export default function SceneLights({ currentWeather, currentLighting }) {
  const weather = WEATHER_LIGHT[currentWeather];
  const lighting = LIGHTING_PRESET[currentLighting];

  return (
    <>
      <ambientLight intensity={weather.ambient * lighting.ambientFactor} />
      <hemisphereLight intensity={0.22} color="#f9e7c9" groundColor="#1b1410" />

      <directionalLight
        castShadow
        intensity={weather.dir * lighting.dirFactor}
        position={lighting.dirPos}
        color={lighting.dirColor ?? weather.color}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={42}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      <directionalLight
        intensity={weather.fill * lighting.fillFactor}
        position={[7, 4, -9]}
        color={weather.fillColor}
      />

      {currentLighting === 'lantern' && (
        <>
          <pointLight position={[2.8, 2.9, 2.2]} intensity={14} color="#ffbf7d" distance={12} />
          <pointLight position={[-2.8, 2.9, 2.2]} intensity={14} color="#ffbf7d" distance={12} />
        </>
      )}
    </>
  );
}
