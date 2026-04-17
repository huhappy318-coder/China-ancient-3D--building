const weatherOptions = [
  { key: 'sunny', label: '晴光', desc: '明亮暖色，视野通透。' },
  { key: 'rainMist', label: '雨雾', desc: '低饱和、冷雾感更重。' },
  { key: 'snow', label: '雪景', desc: '明净清冷，反差更高。' },
  { key: 'dusk', label: '黄昏', desc: '琥珀色夕照，气氛感更强。' },
  { key: 'night', label: '夜色', desc: '压暗环境，突出人工光感。' },
];

export default function WeatherPanel({ currentWeather, onSelectWeather }) {
  return (
    <div className="space-y-3">
      {weatherOptions.map((option) => {
        const isActive = currentWeather === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onSelectWeather(option.key)}
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
