import ImportExportPanel from './ImportExportPanel';
import { getTemplateDefinitions } from '../../utils/templates';

const templateDefinitions = getTemplateDefinitions();

export default function TemplatesPanel({
  currentTemplate,
  onApplyTemplate,
  onClearScene,
  onExportJson,
  onImportJson,
  onExportScreenshot,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <p className="panel-heading">快速开始</p>
        <h3 className="mt-2 text-xl font-semibold text-white">从模板启动搭建</h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          V3 默认采用“清空后套用模板”的逻辑，让你更快得到规整的古建筑轮廓。
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onClearScene}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-stone-200 transition hover:bg-white/10"
          >
            新建空白场景
          </button>
          <button
            type="button"
            onClick={() => onApplyTemplate('pavilion')}
            className="rounded-2xl border border-amber-300/25 bg-amber-200/10 px-4 py-3 text-left text-sm text-amber-100 transition hover:bg-amber-200/20"
          >
            一键生成四柱亭
          </button>
          <button
            type="button"
            onClick={() => onApplyTemplate('hall')}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-stone-200 transition hover:bg-white/10"
          >
            一键生成单檐殿阁
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {templateDefinitions.map((template) => {
          const isActive = currentTemplate === template.key;

          return (
            <button
              key={template.key}
              type="button"
              onClick={() => onApplyTemplate(template.key)}
              className={`w-full rounded-[28px] border px-4 py-4 text-left transition ${
                isActive
                  ? 'border-amber-300/40 bg-amber-200/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-white">{template.name}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{template.subtitle}</p>
                </div>
                {isActive && (
                  <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-stone-950">
                    当前模板
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-stone-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <ImportExportPanel
        onExportJson={onExportJson}
        onImportJson={onImportJson}
        onExportScreenshot={onExportScreenshot}
      />
    </div>
  );
}
