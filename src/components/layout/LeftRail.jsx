import { sideNavItems } from '../../data/sideNav';

export default function LeftRail({ activeNav, onSelectNav, onHideRail }) {
  return (
    <aside className="flex h-full w-[72px] flex-col justify-between border-r border-white/8 bg-black/18 px-2 py-4 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-200/8 text-sm text-amber-100/85">
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
              className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] transition ${
                isActive
                  ? 'bg-white/8 text-amber-100'
                  : 'text-stone-400 hover:bg-white/6 hover:text-stone-200'
              }`}
            >
              <span className="text-sm">{item.shortLabel}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onHideRail}
        className="mx-auto rounded-full border border-white/8 bg-white/5 px-3 py-2 text-[11px] text-stone-400 transition hover:bg-white/8 hover:text-stone-200"
      >
        收
      </button>
    </aside>
  );
}
