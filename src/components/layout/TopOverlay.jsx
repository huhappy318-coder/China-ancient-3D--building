export default function TopOverlay({
  isRailHidden,
  currentWeather,
  currentLighting,
  currentFocus,
  sceneObjectCount,
  selectedCount,
  statusMessage,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSaveScheme,
  onLoadScheme,
  onExportJson,
  onImportJson,
  onExportScreenshot,
}) {
  return (
    <header
      className={`pointer-events-auto absolute top-5 right-5 rounded-[28px] border border-white/10 bg-black/35 px-5 py-4 shadow-glow backdrop-blur-xl transition-all duration-300 ${
        isRailHidden ? 'left-5 md:left-16' : 'left-5 md:left-[420px]'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-amber-300/25 bg-amber-200/10 px-3 py-1 text-[11px] tracking-[0.28em] text-amber-100">
            中国古建筑自由搭建 · 网页原型 V3
          </div>
          <h1 className="mt-3 font-display text-2xl text-white md:text-3xl">
            更像真正可用的搭建工具与作品集成品
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
            V3 在保留 V2 轻编辑器体验的基础上，新增了撤销重做、模板、对称阵列、多选、导入导出和智能反馈。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StatusPill label="天气" value={currentWeather} />
          <StatusPill label="光影" value={currentLighting} />
          <StatusPill label="当前焦点" value={currentFocus} accent />
          <StatusPill label="对象数" value={String(sceneObjectCount)} />
          <StatusPill label="已选中" value={String(selectedCount)} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
          状态：{statusMessage}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton label="撤销" onClick={onUndo} disabled={!canUndo} />
          <ActionButton label="重做" onClick={onRedo} disabled={!canRedo} />
          <ActionButton label="保存" onClick={onSaveScheme} accent />
          <ActionButton label="读取" onClick={onLoadScheme} />
          <ActionButton label="导出 JSON" onClick={onExportJson} />
          <ActionButton label="导入 JSON" onClick={onImportJson} />
          <ActionButton label="导出截图" onClick={onExportScreenshot} />
        </div>
      </div>
    </header>
  );
}

function ActionButton({ label, onClick, disabled = false, accent = false }) {
  let className = 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10';

  if (accent) {
    className = 'border-amber-300/30 bg-amber-200/10 text-amber-100 hover:bg-amber-200/20';
  }

  if (disabled) {
    className = 'border-white/10 bg-white/5 text-stone-500 opacity-55 cursor-not-allowed';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border px-4 py-2 text-sm transition ${className}`}
    >
      {label}
    </button>
  );
}

function StatusPill({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-2xl border px-3 py-2 ${
        accent
          ? 'border-amber-300/30 bg-amber-200/10 text-amber-100'
          : 'border-white/10 bg-white/5 text-stone-200'
      }`}
    >
      <span className="text-stone-400">{label}</span>
      <span className="ml-2 text-white">{value}</span>
    </div>
  );
}
