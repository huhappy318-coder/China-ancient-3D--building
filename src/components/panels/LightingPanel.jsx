const weatherOptions = [
  { key: 'sunny', label: '晴光', desc: '通透明亮，适合看结构。' },
  { key: 'dusk', label: '黄昏', desc: '暖金夕照，更适合展示主场景。' },
  { key: 'night', label: '夜色', desc: '压暗环境，让轮廓更静。' },
];

const lightingOptions = [
  { key: 'dawn', label: '晨光', desc: '清晨斜射，层次更清楚。' },
  { key: 'sunset', label: '夕照', desc: '偏暖长阴影，更有东方气质。' },
  { key: 'soft', label: '柔光', desc: '对比更轻，适合整体观看。' },
];

export default function LightingPanel({
  currentWeather,
  currentLighting,
  onSelectWeather,
  onSelectLighting,
}) {
  return (
    <div className="space-y-4">
      <div className="panel-shell">
        <p className="panel-heading">光影</p>
        <h3 className="panel-title">调整场景气氛</h3>
        <p className="panel-copy">只保留最常用的天气与光照切换，让页面更干净。</p>
      </div>

      <div className="panel-shell">
        <p className="panel-heading">天气</p>
        <div className="mt-4 space-y-3">
          {weatherOptions.map((option) => (
            <OptionCard
              key={option.key}
              active={currentWeather === option.key}
              label={option.label}
              desc={option.desc}
              onClick={() => onSelectWeather(option.key)}
            />
          ))}
        </div>
      </div>

      <div className="panel-shell">
        <p className="panel-heading">时段</p>
        <div className="mt-4 space-y-3">
          {lightingOptions.map((option) => (
            <OptionCard
              key={option.key}
              active={currentLighting === option.key}
              label={option.label}
              desc={option.desc}
              onClick={() => onSelectLighting(option.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OptionCard({ active, label, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[18px] border px-4 py-4 text-left transition ${
        active
          ? 'border-amber-300/30 bg-amber-200/10'
          : 'border-white/8 bg-black/20 hover:bg-white/8'
      }`}
    >
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-[13px] leading-6 text-stone-400">{desc}</p>
    </button>
  );
}
