export default function SidePanel({ isOpen, title, description, onClose, children }) {
  return (
    <aside
      className={`h-full w-[304px] border-r border-white/8 bg-black/24 backdrop-blur-xl transition-all duration-300 ${
        isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-8 opacity-0'
      }`}
    >
      <div className="flex h-full flex-col px-4 py-4">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <p className="panel-heading">功能面板</p>
            <h2 className="panel-title">{title}</h2>
            <p className="panel-copy max-w-[228px]">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-[11px] text-stone-300 transition hover:bg-white/10"
          >
            收起
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </aside>
  );
}
