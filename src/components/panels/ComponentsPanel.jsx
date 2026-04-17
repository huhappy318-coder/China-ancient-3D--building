import { componentCatalog } from '../../data/componentCatalog';

export default function ComponentsPanel({
  focusedType,
  sceneObjectCount,
  onAddComponent,
  onOpenTemplates,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="panel-heading">构件库</p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {componentCatalog.find((item) => item.objectType === focusedType)?.label ?? '立柱'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              点击构件即可向场景新增对象。当前场景共有 {sceneObjectCount} 个对象，位置会自动吸附到网格。
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTemplates}
            className="rounded-2xl border border-amber-300/25 bg-amber-200/10 px-4 py-3 text-sm text-amber-100 transition hover:bg-amber-200/20"
          >
            打开模板
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {componentCatalog.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddComponent(item)}
            className={`rounded-[22px] border px-4 py-4 text-left transition ${
              focusedType === item.objectType
                ? 'border-amber-300/40 bg-amber-200/10 text-white'
                : 'border-white/10 bg-stone-950/70 text-stone-200 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-xs text-stone-400">{item.groupLabel}</p>
            <p className="mt-3 text-xs leading-5 text-stone-400">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
