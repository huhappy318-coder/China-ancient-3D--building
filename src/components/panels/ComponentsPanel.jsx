import { componentCatalog } from '../../data/componentCatalog';

export default function ComponentsPanel({
  focusedType,
  sceneObjectCount,
  onAddComponent,
  onClearScene,
}) {
  return (
    <div className="space-y-4">
      <div className="panel-shell">
        <p className="panel-heading">搭建</p>
        <h3 className="panel-title">从这里继续搭建</h3>
        <p className="panel-copy">
          点击任意构件，就会直接加入场景。当前场景共有 {sceneObjectCount} 个对象。
        </p>
      </div>

      <div className="panel-shell">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="panel-heading">选择组件</p>
            <h3 className="panel-title">
              {componentCatalog.find((item) => item.objectType === focusedType)?.label ?? '立柱'}
            </h3>
          </div>
          <button type="button" onClick={onClearScene} className="panel-button px-3 py-2 text-xs">
            清空场景
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {componentCatalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAddComponent(item)}
              className={`rounded-[20px] border px-4 py-4 text-left transition ${
                focusedType === item.objectType
                  ? 'border-amber-300/25 bg-amber-200/10 text-white'
                  : 'border-white/8 bg-stone-950/60 text-stone-200 hover:bg-white/8'
              }`}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-stone-500">{item.groupLabel}</p>
              <p className="mt-3 text-[12px] leading-5 text-stone-400">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
