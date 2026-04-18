import { useMemo } from 'react';
import { getObjectCategoryLabel, getObjectLabel } from '../../utils/sceneObjectFactory';

export default function ObjectListPanel({
  sceneObjects,
  selectedObjectIds,
  onSelectObject,
  onToggleVisibility,
  onDeleteObject,
}) {
  const groups = useMemo(() => {
    const grouped = new Map();

    sceneObjects.forEach((object) => {
      const categoryLabel = object.meta?.categoryLabel ?? getObjectCategoryLabel(object.type);

      if (!grouped.has(categoryLabel)) {
        grouped.set(categoryLabel, []);
      }

      grouped.get(categoryLabel).push(object);
    });

    return Array.from(grouped.entries());
  }, [sceneObjects]);

  return (
    <div className="panel-shell">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="panel-heading">对象列表</p>
          <h3 className="panel-title">场景图层</h3>
        </div>
        <div className="panel-chip">共 {sceneObjects.length} 个对象</div>
      </div>

      {sceneObjects.length === 0 ? (
        <div className="mt-4 rounded-[20px] border border-dashed border-white/10 bg-black/15 px-4 py-6 text-[13px] leading-6 text-stone-400">
          场景里还没有构件，请从左侧构件库添加，或直接套用一个模板开始搭建。
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {groups.map(([groupLabel, objects]) => (
            <div key={groupLabel}>
              <div className="mb-2 text-[11px] tracking-[0.22em] text-stone-400">{groupLabel}</div>
              <div className="space-y-2">
                {objects.map((object) => {
                  const isSelected = selectedObjectIds.includes(object.id);

                  return (
                    <div
                      key={object.id}
                      onClick={(event) => onSelectObject(object.id, { append: event.shiftKey })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onSelectObject(object.id, { append: event.shiftKey });
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`flex w-full items-center justify-between gap-3 rounded-[18px] border px-3 py-3 text-left transition ${
                        isSelected
                          ? 'border-amber-300/40 bg-amber-200/10'
                          : 'border-white/8 bg-black/20 hover:border-white/15 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{getObjectLabel(object.type)}</div>
                        <div className="mt-1 text-xs text-stone-400">
                          {object.id.slice(0, 12)}
                          {!object.visible && <span className="ml-2 text-amber-200">已隐藏</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleVisibility([object.id]);
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-stone-300 transition hover:bg-white/10"
                        >
                          {object.visible ? '隐藏' : '显示'}
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteObject([object.id]);
                          }}
                          className="rounded-xl border border-red-400/20 bg-red-400/10 px-2 py-1 text-xs text-red-100 transition hover:bg-red-400/20"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
