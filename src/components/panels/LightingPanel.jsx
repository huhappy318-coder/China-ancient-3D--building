const weatherOptions = [
  { key: 'sunny', label: '晴光', desc: '通透明亮，适合观察结构。' },
  { key: 'dusk', label: '黄昏', desc: '暖金夕照，最适合作为首屏展示。' },
  { key: 'night', label: '夜色', desc: '压暗环境，突出人工光感。' },
];

const lightingOptions = [
  { key: 'dawn', label: '晨光', desc: '低角度斜射，层次更清楚。' },
  { key: 'sunset', label: '夕照', desc: '偏暖长阴影，更有东方气质。' },
  { key: 'soft', label: '柔光', desc: '对比更克制，适合整体观赏。' },
];

export default function LightingPanel({
  currentWeather,
  currentLighting,
  onSelectWeather,
  onSelectLighting,
}) {
  return (
    <div className="space-y-4">
      <PanelGroup title="天气" subtitle="先改变场景气氛，再决定是否切到更强的工具状态。">
        {weatherOptions.map((option) => (
          <OptionCard
            key={option.key}
            active={currentWeather === option.key}
            label={option.label}
            desc={option.desc}
            onClick={() => onSelectWeather(option.key)}
          />
        ))}
      </PanelGroup>

      <PanelGroup title="光影" subtitle="让建筑自己立住，不靠密集信息来撑满页面。">
        {lightingOptions.map((option) => (
          <OptionCard
            key={option.key}
            active={currentLighting === option.key}
            label={option.label}
            desc={option.desc}
            onClick={() => onSelectLighting(option.key)}
          />
        ))}
      </PanelGroup>
    </div>
  );
}

function PanelGroup({ title, subtitle, children }) {
  return (
    <div className="panel-shell">
      <p className="panel-heading">{title}</p>
      <h3 className="panel-title">{title}控制</h3>
      <p className="panel-copy">{subtitle}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function OptionCard({ active, label, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
        active
          ? 'border-amber-300/25 bg-amber-200/10'
          : 'border-white/8 bg-black/20 hover:bg-white/8'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-white">{label}</p>
          <p className="mt-1 text-[13px] leading-6 text-stone-400">{desc}</p>
        </div>
        {active && <span className="panel-chip text-amber-100">当前</span>}
      </div>
    </button>
  );
}
