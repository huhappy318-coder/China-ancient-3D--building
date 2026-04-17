import { blueprintSteps } from '../../data/blueprintSteps';

const recommendedLayout = [
  '中央 1 个台基',
  '两侧对称立柱',
  '上方横梁',
  '顶部屋面',
  '前侧石阶',
];

export default function BlueprintPanel({
  showSteps,
  showBlueprintOverlay,
  blueprintMode,
  currentStep,
  focusType,
  onToggleSteps,
  onToggleBlueprintOverlay,
  onChangeBlueprintMode,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="panel-heading">图纸辅助</p>
            <h3 className="mt-2 text-lg font-semibold text-white">施工参考卡</h3>
          </div>
          <button
            type="button"
            onClick={onToggleBlueprintOverlay}
            className={`rounded-xl border px-3 py-2 text-xs transition ${
              showBlueprintOverlay
                ? 'border-amber-300/40 bg-amber-200/10 text-amber-100'
                : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            {showBlueprintOverlay ? '关闭图纸叠加' : '打开图纸叠加'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
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

        <div className="mt-4 rounded-[24px] border border-amber-300/20 bg-[radial-gradient(circle_at_top,rgba(231,182,101,0.12),transparent_40%),linear-gradient(180deg,rgba(30,25,22,0.92),rgba(12,9,8,0.96))] p-5">
          <div className="mx-auto flex h-40 max-w-[220px] items-center justify-center">
            <div className="relative h-32 w-36 rounded-[26px] border border-amber-100/35">
              <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-amber-100/65" />
              <div className="absolute top-1/2 h-[2px] w-full -translate-y-1/2 bg-amber-100/20" />
              {['platform', 'column', 'beam', 'roof', 'eaves', 'stairs'].includes(focusType) && (
                <div
                  className={`absolute inset-4 rounded-[18px] border ${
                    focusType === 'roof' || focusType === 'eaves'
                      ? 'border-amber-100/70'
                      : focusType === 'column'
                        ? 'border-sky-100/70'
                        : 'border-amber-100/45'
                  }`}
                />
              )}
            </div>
          </div>
          <p className="text-center text-xs text-stone-400">
            当前推荐关注：{focusType === 'column' ? '柱位参考点' : focusType === 'roof' ? '屋面居中轮廓' : focusType === 'platform' ? '台基承托范围' : '中轴与开间框'}
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="panel-heading">推荐布局</p>
            <h3 className="mt-2 text-lg font-semibold text-white">按顺序更快成型</h3>
          </div>
          <button
            type="button"
            onClick={onToggleSteps}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300 transition hover:bg-white/10"
          >
            {showSteps ? '隐藏步骤卡片' : '显示步骤卡片'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {recommendedLayout.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-200"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="panel-heading">推荐搭建顺序</p>
          <span className="rounded-full border border-amber-300/20 bg-amber-200/10 px-3 py-1 text-xs text-amber-100">
            当前第 {currentStep} 步
          </span>
        </div>
        <div className="space-y-2">
          {blueprintSteps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;

            return (
              <div
                key={step}
                className={`flex gap-3 rounded-2xl border px-3 py-3 text-sm ${
                  isActive
                    ? 'border-amber-300/30 bg-amber-200/10 text-white'
                    : 'border-white/8 bg-black/20 text-stone-200'
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
      className={`rounded-2xl border px-4 py-3 text-sm transition ${
        active
          ? 'border-amber-300/40 bg-amber-200/10 text-amber-100'
          : 'border-white/10 bg-black/20 text-stone-200 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
