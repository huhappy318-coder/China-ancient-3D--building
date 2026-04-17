import { sideNavItems } from '../../data/sideNav';

export default function LeftRail({ activeNav, onSelectNav, onHideRail }) {
  return (
    <aside className="flex h-full w-[88px] flex-col justify-between border-r border-white/10 bg-black/35 px-3 py-4 shadow-glow backdrop-blur-xl transition-all duration-300">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-amber-300 to-orange-400 font-display text-lg font-semibold text-stone-950 shadow-amber">
          筑
        </div>

        {sideNavItems.map((item) => {
          const isActive = activeNav === item.key;

          return (
            <button
              key={item.key}
              type="button"
              title={item.description}
              onClick={() => onSelectNav(item.key)}
              className={`flex w-full flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs transition ${
                isActive
                  ? 'border-amber-300/50 bg-amber-200/15 text-amber-100 shadow-amber'
                  : 'border-white/10 bg-white/5 text-stone-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-sm">
                {item.shortLabel}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onHideRail}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-xs text-stone-300 transition hover:bg-white/10"
        >
          隐藏边框
        </button>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-200/85">灵感</p>
          <p className="mt-1 text-xs text-white">中轴先行</p>
        </div>
      </div>
    </aside>
  );
}
