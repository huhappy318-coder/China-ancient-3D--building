const WEATHER_LIGHT = {
  sunny: { ambient: 1.35, dir: 2.2, fill: 0.8, color: '#ffe1ae', fillColor: '#c7d9ff' },
  rainMist: { ambient: 0.9, dir: 1.2, fill: 0.7, color: '#d9e2f2', fillColor: '#8ea4bf' },
  snow: { ambient: 1.5, dir: 2.0, fill: 0.95, color: '#f4fbff', fillColor: '#c9d9e7' },
  dusk: { ambient: 0.85, dir: 1.7, fill: 0.55, color: '#ffbd7d', fillColor: '#7769a3' },
  night: { ambient: 0.35, dir: 0.55, fill: 0.85, color: '#88a8d8', fillColor: '#ffcb82' },
};

const LIGHTING_PRESET = {
  dawn: { ambientFactor: 0.9, dirFactor: 1.0, fillFactor: 0.7, dirPos: [8, 6, 4], dirColor: '#ffd29e' },
  noon: { ambientFactor: 1.1, dirFactor: 1.2, fillFactor: 0.75, dirPos: [4, 11, 3], dirColor: '#fff0cc' },
  sunset: { ambientFactor: 0.85, dirFactor: 1.05, fillFactor: 0.65, dirPos: [-8, 5, 5], dirColor: '#ffb06b' },
  lantern: { ambientFactor: 0.45, dirFactor: 0.55, fillFactor: 1.0, dirPos: [2, 5, 2], dirColor: '#f9d27c' },
  soft: { ambientFactor: 1.0, dirFactor: 0.8, fillFactor: 0.9, dirPos: [5, 7, 6], dirColor: '#f2eadf' },
};

export default function SceneLights({ currentWeather, currentLighting }) {
  const weather = WEATHER_LIGHT[currentWeather];
  const lighting = LIGHTING_PRESET[currentLighting];

  return (
    <>
      <ambientLight intensity={weather.ambient * lighting.ambientFactor} />

      <directionalLight
        castShadow
        intensity={weather.dir * lighting.dirFactor}
        position={lighting.dirPos}
        color={lighting.dirColor ?? weather.color}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      <directionalLight
        intensity={weather.fill * lighting.fillFactor}
        position={[-6, 4, -7]}
        color={weather.fillColor}
      />

      {currentLighting === 'lantern' && (
        <>
          <pointLight position={[2.8, 2.5, 2]} intensity={18} color="#ffbf7d" distance={12} />
          <pointLight position={[-2.8, 2.5, 2]} intensity={18} color="#ffbf7d" distance={12} />
        </>
      )}
    </>
  );
}
