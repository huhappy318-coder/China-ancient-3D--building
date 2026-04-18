import { useMemo, useState } from 'react';
import ObjectListPanel from './ObjectListPanel';
import { formatNumber } from '../../utils/snap';

export default function PropertiesPanel({
  selectedObjects,
  selectedObjectIds,
  sceneObjects,
  evaluationSummary,
  canUndo,
  canRedo,
  onSelectObject,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onDuplicateObject,
  onToggleVisibility,
  onDeleteObject,
  onMirrorObject,
  onArrayCopy,
  onUndo,
  onRedo,
  onSaveScheme,
  onLoadScheme,
  onExportJson,
  onImportJson,
  onExportScreenshot,
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
      <PanelBlock title="对象">
        <h3 className="panel-title mt-0">
          {selectedObjects.length === 0
            ? '未选择对象'
            : isMultiSelect
              ? `已选中 ${selectedObjects.length} 个对象`
              : primarySelectedObject.meta.label}
        </h3>
        <p className="panel-copy">
          编辑、反馈和导出都收在这里，主场景保持干净，操作按需要再展开。
        </p>
      </PanelBlock>

      {selectedObjects.length === 0 ? (
        <PanelHint text="先点击场景中的对象，或在对象列表里按住 Shift 连续选择多个对象。" />
      ) : isMultiSelect ? (
        <>
          <PanelBlock title="批量编辑">
            <div className="grid grid-cols-2 gap-3 text-sm text-stone-300">
              <MetaLine label="模式" value="批量编辑" />
              <MetaLine label="对象数" value={`${selectedObjects.length}`} />
              <MetaLine label="平均 X" value={formatNumber(selectionSummary.averageX)} />
              <MetaLine label="平均 Z" value={formatNumber(selectionSummary.averageZ)} />
              <MetaLine label="平均缩放" value={`${formatNumber(selectionSummary.averageScale)}x`} />
              <MetaLine label="可见状态" value={selectionSummary.allVisible ? '全部显示' : '部分隐藏'} />
            </div>
          </PanelBlock>

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

          <ActionRow>
            <ActionButton onClick={() => onToggleVisibility(selectedObjectIds)}>
              {selectionSummary.allVisible ? '批量隐藏' : '批量显示'}
            </ActionButton>
            <DangerButton onClick={() => onDeleteObject(selectedObjectIds)}>批量删除</DangerButton>
          </ActionRow>
        </>
      ) : (
        <>
          <PanelBlock title="当前信息">
            <div className="grid grid-cols-2 gap-3 text-sm text-stone-300">
              <MetaLine label="ID" value={primarySelectedObject.id} />
              <MetaLine label="类型" value={primarySelectedObject.meta.label} />
              <MetaLine label="可见" value={primarySelectedObject.visible ? '是' : '否'} />
              <MetaLine label="旋转" value={`${formatNumber(primarySelectedObject.rotation[1])}°`} />
              <MetaLine
                label="位置"
                value={`x ${formatNumber(primarySelectedObject.position[0])} / y ${formatNumber(primarySelectedObject.position[1])} / z ${formatNumber(primarySelectedObject.position[2])}`}
              />
              <MetaLine label="缩放" value={`${formatNumber(primarySelectedObject.scale[0])}x`} />
            </div>
          </PanelBlock>

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

          <ActionRow>
            <ActionButton onClick={() => onDuplicateObject(primarySelectedObject.id)}>复制</ActionButton>
            <ActionButton onClick={() => onToggleVisibility([primarySelectedObject.id])}>
              {primarySelectedObject.visible ? '隐藏' : '显示'}
            </ActionButton>
            <DangerButton onClick={() => onDeleteObject([primarySelectedObject.id])}>删除</DangerButton>
          </ActionRow>

          <PanelBlock title="对称 / 阵列">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="panel-title mt-0">规则辅助</h3>
                <p className="panel-copy">
                  适合做中轴镜像和立柱阵列，帮助快速搭出更有秩序感的轮廓。
                </p>
              </div>
              <ActionButton onClick={() => onMirrorObject(primarySelectedObject.id)}>
                沿 X 轴镜像
              </ActionButton>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
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

            <ActionButton
              className="mt-3 w-full"
              onClick={() => onArrayCopy(primarySelectedObject.id, arrayCount, arraySpacing)}
            >
              生成阵列复制
            </ActionButton>
          </PanelBlock>
        </>
      )}

      <PanelBlock title="反馈">
        <div className="grid grid-cols-3 gap-3">
          <MetaLine label="完整度" value={`${evaluationSummary.completeness}%`} />
          <MetaLine label="美观评分" value={evaluationSummary.beautyScore} />
          <MetaLine label="匠心值" value={`+${evaluationSummary.craftsmanship}`} />
        </div>
        <div className="mt-3 space-y-2">
          {evaluationSummary.suggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-3 text-[13px] leading-6 text-stone-300"
            >
              {suggestion}
            </div>
          ))}
        </div>
      </PanelBlock>

      <PanelBlock title="更多操作">
        <div className="grid grid-cols-2 gap-3">
          <ActionButton onClick={onUndo} disabled={!canUndo}>撤销</ActionButton>
          <ActionButton onClick={onRedo} disabled={!canRedo}>重做</ActionButton>
          <ActionButton onClick={onSaveScheme}>保存方案</ActionButton>
          <ActionButton onClick={onLoadScheme}>读取方案</ActionButton>
          <ActionButton onClick={onExportJson}>导出 JSON</ActionButton>
          <ActionButton onClick={onImportJson}>导入 JSON</ActionButton>
          <ActionButton className="col-span-2" onClick={onExportScreenshot}>导出截图</ActionButton>
        </div>
      </PanelBlock>

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

function PanelBlock({ title, children }) {
  return (
    <div className="panel-shell">
      <p className="panel-heading">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function PanelHint({ text }) {
  return (
    <div className="rounded-[22px] border border-dashed border-white/10 bg-black/15 px-4 py-6 text-[13px] leading-6 text-stone-400">
      {text}
    </div>
  );
}

function ActionRow({ children }) {
  return <div className="grid grid-cols-3 gap-3">{children}</div>;
}

function ActionButton({ children, onClick, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`panel-button disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function DangerButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[18px] border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100 transition hover:bg-red-400/18"
    >
      {children}
    </button>
  );
}

function MetaLine({ label, value }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-3">
      <div className="text-[11px] text-stone-500">{label}</div>
      <div className="mt-1 text-sm text-white">{value}</div>
    </div>
  );
}

function SliderField({ label, value, min, max, step, display, onChange }) {
  return (
    <div className="panel-shell">
      <div className="mb-3 flex items-center justify-between gap-3">
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
    <label className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-200">
      <div className="mb-2 text-[11px] text-stone-500">{label}</div>
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
