const lightingOptions = [
  { key: 'dawn', label: '晨光', desc: '低角度斜射，强调清晨层次。' },
  { key: 'noon', label: '午照', desc: '高亮直照，结构最清楚。' },
  { key: 'sunset', label: '夕照', desc: '偏暖长阴影，更有戏剧感。' },
  { key: 'lantern', label: '夜灯', desc: '模拟夜间人工照明。' },
  { key: 'soft', label: '柔光', desc: '降低对比，适合整体观察。' },
];

export default function LightingPanel({ currentLighting, onSelectLighting }) {
  return (
    <div className="space-y-3">
      {lightingOptions.map((option) => {
        const isActive = currentLighting === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onSelectLighting(option.key)}
            className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
              isActive
                ? 'border-amber-300/40 bg-amber-200/10'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-white">{option.label}</p>
                <p className="mt-1 text-sm text-stone-300">{option.desc}</p>
              </div>
              {isActive && (
                <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-stone-950">
                  当前
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
