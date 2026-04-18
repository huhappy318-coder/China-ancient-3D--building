import { componentCatalog } from '../../data/componentCatalog';
import { getTemplateDefinitions } from '../../utils/templates';

const templateDefinitions = getTemplateDefinitions();

export default function ComponentsPanel({
  focusedType,
  currentTemplate,
  sceneObjectCount,
  onAddComponent,
  onApplyTemplate,
  onClearScene,
}) {
  return (
    <div className="space-y-4">
      <div className="panel-shell">
        <p className="panel-heading">快速开始</p>
        <h3 className="panel-title">从模板或构件进入</h3>
        <p className="panel-copy">
          当前场景有 {sceneObjectCount} 个对象。你可以保持现有构图继续细搭，也可以换一个模板重新开始。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button type="button" onClick={onClearScene} className="panel-button text-left">
          新建空白场景
        </button>

        {templateDefinitions.map((template) => {
          const isActive = currentTemplate === template.key;

          return (
            <button
              key={template.key}
              type="button"
              onClick={() => onApplyTemplate(template.key)}
              className={`rounded-[22px] border px-4 py-4 text-left transition ${
                isActive
                  ? 'border-amber-300/25 bg-amber-200/10'
                  : 'border-white/8 bg-black/20 hover:bg-white/8'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-white">{template.name}</p>
                  <p className="mt-2 text-[13px] leading-6 text-stone-400">{template.subtitle}</p>
                </div>
                {isActive && <span className="panel-chip text-amber-100">当前</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="panel-shell">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="panel-heading">构件库</p>
            <h3 className="panel-title">
              {componentCatalog.find((item) => item.objectType === focusedType)?.label ?? '立柱'}
            </h3>
          </div>
          <span className="panel-chip">网格吸附</span>
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
