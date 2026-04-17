export default function EvaluationBadge({ isRailHidden, evaluationSummary }) {
  return (
    <div
      className={`absolute top-[18.5rem] z-10 w-[min(320px,calc(100vw-2rem))] rounded-[24px] border border-white/10 bg-black/35 p-4 shadow-glow backdrop-blur-xl transition-all duration-300 ${
        isRailHidden ? 'left-5' : 'left-5 md:left-[424px]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="panel-heading">搭建反馈</p>
          <h3 className="mt-2 text-lg font-semibold text-white">规则感提示</h3>
        </div>
        <div className="rounded-full border border-amber-300/20 bg-amber-200/10 px-3 py-1 text-xs text-amber-100">
          对称度 {Math.round(evaluationSummary.symmetryRatio * 100)}%
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {evaluationSummary.suggestions.map((suggestion) => (
          <div
            key={suggestion}
            className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-sm leading-6 text-stone-200"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}
