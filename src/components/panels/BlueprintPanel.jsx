import { blueprintSteps } from '../../data/blueprintSteps';

const viewOptions = [
  { key: 'perspective', label: '透视' },
  { key: 'top', label: '俯视' },
];

const focusHints = {
  platform: '当前推荐先稳住台基，确定主体落位。',
  column: '当前推荐补齐柱位，先把中轴和开间立起来。',
  beam: '当前推荐连接横梁，形成主要骨架。',
  eaves: '当前推荐补上出檐，增强层次关系。',
  roof: '当前推荐完成屋面，让主体轮廓站住。',
  stairs: '当前推荐补前侧石阶，完善入口关系。',
};

export default function BlueprintPanel({
  currentView,
  currentStep,
  focusType,
  showBlueprintOverlay,
  blueprintMode,
  onChangeView,
  onToggleBlueprintOverlay,
  onChangeBlueprintMode,
}) {
  return (
    <div className="space-y-4">
      <div className="panel-shell">
        <p className="panel-heading">教程</p>
        <h3 className="panel-title">按步骤搭建</h3>
        <p className="panel-copy">{focusHints[focusType] ?? '当前推荐沿中轴继续完善整体轮廓。'}</p>
      </div>

      <div className="panel-shell">
        <p className="panel-heading">视角</p>
        <h3 className="panel-title">查看方式</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {viewOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onChangeView(option.key)}
              className={`rounded-[18px] border px-4 py-3 text-sm transition ${
                currentView === option.key
                  ? 'border-amber-300/30 bg-amber-200/10 text-amber-100'
                  : 'border-white/8 bg-black/20 text-stone-200 hover:bg-white/8'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-shell">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="panel-heading">图纸叠加</p>
            <h3 className="panel-title">辅助参考</h3>
          </div>
          <button
            type="button"
            onClick={onToggleBlueprintOverlay}
            className={`rounded-full border px-3 py-2 text-xs transition ${
              showBlueprintOverlay
                ? 'border-amber-300/30 bg-amber-200/10 text-amber-100'
                : 'border-white/8 bg-black/20 text-stone-300 hover:bg-white/8'
            }`}
          >
            {showBlueprintOverlay ? '已开启' : '开启'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ModeButton
            label="平面辅助"
            active={blueprintMode === 'plan'}
            onClick={() => onChangeBlueprintMode('plan')}
          />
          <ModeButton
            label="结构辅助"
            active={blueprintMode === 'structure'}
            onClick={() => onChangeBlueprintMode('structure')}
          />
        </div>
      </div>

      <div className="panel-shell">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="panel-heading">步骤</p>
            <h3 className="panel-title">当前进行到第 {currentStep} 步</h3>
          </div>
        </div>

        <div className="space-y-2">
          {blueprintSteps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;

            return (
              <div
                key={step}
                className={`flex gap-3 rounded-[18px] border px-3 py-3 text-sm leading-6 ${
                  isActive
                    ? 'border-amber-300/30 bg-amber-200/10 text-white'
                    : 'border-white/8 bg-black/20 text-stone-300'
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-stone-950">
                  {stepNumber}
                </span>
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModeButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[18px] border px-4 py-3 text-sm transition ${
        active
          ? 'border-amber-300/30 bg-amber-200/10 text-amber-100'
          : 'border-white/8 bg-black/20 text-stone-200 hover:bg-white/8'
      }`}
    >
      {label}
    </button>
  );
}
