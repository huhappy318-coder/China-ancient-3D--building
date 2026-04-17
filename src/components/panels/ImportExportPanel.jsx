export default function ImportExportPanel({
  onExportJson,
  onImportJson,
  onExportScreenshot,
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <p className="panel-heading">导入导出</p>
      <h3 className="mt-2 text-lg font-semibold text-white">方案复用</h3>
      <p className="mt-2 text-sm leading-6 text-stone-300">
        可以把当前方案导出为 JSON 或截图，也可以导回之前保存的布局继续编辑。
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <ActionButton label="导出 JSON" onClick={onExportJson} />
        <ActionButton label="导入 JSON" onClick={onImportJson} />
        <ActionButton label="导出截图" onClick={onExportScreenshot} accent />
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, accent = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm transition ${
        accent
          ? 'border-amber-300/30 bg-amber-200/10 text-amber-100 hover:bg-amber-200/20'
          : 'border-white/10 bg-black/20 text-stone-200 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
