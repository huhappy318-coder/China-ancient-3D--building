export default function SidePanel({ isOpen, title, description, onClose, children }) {
  return (
    <aside
      className={`h-full w-[320px] border-r border-white/10 bg-black/30 shadow-glow backdrop-blur-xl transition-all duration-300 ${
        isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-8 opacity-0'
      }`}
    >
      <div className="flex h-full flex-col px-4 py-4">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="panel-heading">左侧弹出功能面板</p>
            <h2 className="mt-2 font-display text-2xl text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-300">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300 transition hover:bg-white/10"
          >
            收起
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </aside>
  );
}
