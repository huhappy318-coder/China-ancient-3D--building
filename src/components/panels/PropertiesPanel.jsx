import { useMemo, useState } from 'react';
import ObjectListPanel from './ObjectListPanel';
import { formatNumber } from '../../utils/snap';

export default function PropertiesPanel({
  selectedObjects,
  selectedObjectIds,
  sceneObjects,
  onSelectObject,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onDuplicateObject,
  onToggleVisibility,
  onDeleteObject,
  onMirrorObject,
  onArrayCopy,
}) {
  const [arrayCount, setArrayCount] = useState(5);
  const [arraySpacing, setArraySpacing] = useState(1.5);
  const isMultiSelect = selectedObjects.length > 1;
  const primarySelectedObject = selectedObjects[selectedObjects.length - 1] ?? null;

  const selectionSummary = useMemo(() => {
    if (!selectedObjects.length) {
      return {
        averageX: 0,
        averageZ: 0,
        averageScale: 1,
        allVisible: true,
      };
    }

    return {
      averageX:
        selectedObjects.reduce((sum, object) => sum + object.position[0], 0) / selectedObjects.length,
      averageZ:
        selectedObjects.reduce((sum, object) => sum + object.position[2], 0) / selectedObjects.length,
      averageScale:
        selectedObjects.reduce((sum, object) => sum + object.scale[0], 0) / selectedObjects.length,
      allVisible: selectedObjects.every((object) => object.visible),
    };
  }, [selectedObjects]);

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <p className="panel-heading">当前对象</p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          {selectedObjects.length === 0
            ? '未选择对象'
            : isMultiSelect
              ? `已选中 ${selectedObjects.length} 个对象`
              : primarySelectedObject.meta.label}
        </h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          单选时可精确编辑对象；多选时进入批量编辑模式，支持统一移动、缩放、显隐与删除。
        </p>
      </div>

      {selectedObjects.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-white/10 bg-black/15 px-4 py-6 text-sm text-stone-400">
          点击场景中的构件，或在对象列表中按住 Shift 连点多个对象，即可进入编辑状态。
        </div>
      ) : isMultiSelect ? (
        <>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm text-stone-300">
              <MetaLine label="模式" value="批量编辑" />
              <MetaLine label="对象数" value={`${selectedObjects.length}`} />
              <MetaLine label="平均 X" value={formatNumber(selectionSummary.averageX)} />
              <MetaLine label="平均 Z" value={formatNumber(selectionSummary.averageZ)} />
              <MetaLine label="平均缩放" value={`${formatNumber(selectionSummary.averageScale)}x`} />
              <MetaLine label="可见状态" value={selectionSummary.allVisible ? '全部显示' : '部分隐藏'} />
            </div>
          </div>

          <SliderField
            label="批量移动 X"
            value={selectionSummary.averageX}
            min={-8}
            max={8}
            step={0.5}
            display={formatNumber(selectionSummary.averageX)}
            onChange={(value) => onPositionChange(0, value, true)}
          />

          <SliderField
            label="批量移动 Z"
            value={selectionSummary.averageZ}
            min={-8}
            max={8}
            step={0.5}
            display={formatNumber(selectionSummary.averageZ)}
            onChange={(value) => onPositionChange(2, value, true)}
          />

          <SliderField
            label="统一缩放"
            value={selectionSummary.averageScale}
            min={0.5}
            max={2}
            step={0.1}
            display={`${formatNumber(selectionSummary.averageScale)}x`}
            onChange={(value) => onScaleChange(value, true)}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onToggleVisibility(selectedObjectIds)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
            >
              {selectionSummary.allVisible ? '批量隐藏' : '批量显示'}
            </button>
            <button
              type="button"
              onClick={() => onDeleteObject(selectedObjectIds)}
              className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100 transition hover:bg-red-400/20"
            >
              批量删除
            </button>
          </div>
        </>
      ) : (
        <>
          <ObjectMetaCard selectedObject={primarySelectedObject} />

          <SliderField
            label="X 方向位置"
            value={primarySelectedObject.position[0]}
            min={-8}
            max={8}
            step={0.5}
            display={formatNumber(primarySelectedObject.position[0])}
            onChange={(value) => onPositionChange(0, value, false)}
          />

          <SliderField
            label="Z 方向位置"
            value={primarySelectedObject.position[2]}
            min={-8}
            max={8}
            step={0.5}
            display={formatNumber(primarySelectedObject.position[2])}
            onChange={(value) => onPositionChange(2, value, false)}
          />

          <SliderField
            label="Y 高度"
            value={primarySelectedObject.position[1]}
            min={0}
            max={8}
            step={0.5}
            display={formatNumber(primarySelectedObject.position[1])}
            onChange={(value) => onPositionChange(1, value, false)}
          />

          <SliderField
            label="旋转"
            value={primarySelectedObject.rotation[1]}
            min={-180}
            max={180}
            step={15}
            display={`${formatNumber(primarySelectedObject.rotation[1])}°`}
            onChange={(value) => onRotationChange(value)}
          />

          <SliderField
            label="缩放"
            value={primarySelectedObject.scale[0]}
            min={0.5}
            max={2}
            step={0.1}
            display={`${formatNumber(primarySelectedObject.scale[0])}x`}
            onChange={(value) => onScaleChange(value, false)}
          />

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onDuplicateObject(primarySelectedObject.id)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
            >
              复制
            </button>
            <button
              type="button"
              onClick={() => onToggleVisibility([primarySelectedObject.id])}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
            >
              {primarySelectedObject.visible ? '隐藏' : '显示'}
            </button>
            <button
              type="button"
              onClick={() => onDeleteObject([primarySelectedObject.id])}
              className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100 transition hover:bg-red-400/20"
            >
              删除
            </button>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="panel-heading">对称 / 阵列</p>
                <h3 className="mt-2 text-lg font-semibold text-white">规则感辅助</h3>
              </div>
              <button
                type="button"
                onClick={() => onMirrorObject(primarySelectedObject.id)}
                className="rounded-2xl border border-amber-300/25 bg-amber-200/10 px-4 py-3 text-sm text-amber-100 transition hover:bg-amber-200/20"
              >
                沿 X 轴镜像复制
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="阵列数量"
                value={arrayCount}
                options={[3, 5, 7]}
                onChange={(value) => setArrayCount(Number(value))}
              />
              <SelectField
                label="间距"
                value={arraySpacing}
                options={[1, 1.5, 2]}
                onChange={(value) => setArraySpacing(Number(value))}
              />
            </div>

            <button
              type="button"
              onClick={() => onArrayCopy(primarySelectedObject.id, arrayCount, arraySpacing)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
            >
              生成阵列复制
            </button>
          </div>
        </>
      )}

      <ObjectListPanel
        sceneObjects={sceneObjects}
        selectedObjectIds={selectedObjectIds}
        onSelectObject={onSelectObject}
        onToggleVisibility={onToggleVisibility}
        onDeleteObject={onDeleteObject}
      />
    </div>
  );
}

function ObjectMetaCard({ selectedObject }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="grid grid-cols-2 gap-3 text-sm text-stone-300">
        <MetaLine label="ID" value={selectedObject.id} />
        <MetaLine label="类型" value={selectedObject.meta.label} />
        <MetaLine label="可见" value={selectedObject.visible ? '是' : '否'} />
        <MetaLine label="旋转" value={`${formatNumber(selectedObject.rotation[1])}°`} />
        <MetaLine
          label="位置"
          value={`x ${formatNumber(selectedObject.position[0])} / y ${formatNumber(selectedObject.position[1])} / z ${formatNumber(selectedObject.position[2])}`}
        />
        <MetaLine label="缩放" value={`${formatNumber(selectedObject.scale[0])}x`} />
      </div>
    </div>
  );
}

function MetaLine({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
      <div className="text-xs text-stone-400">{label}</div>
      <div className="mt-1 text-sm text-white">{value}</div>
    </div>
  );
}

function SliderField({ label, value, min, max, step, display, onChange }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-stone-200">{label}</span>
        <span className="text-sm text-amber-100">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-300"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-stone-200">
      <div className="mb-2 text-xs text-stone-400">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
