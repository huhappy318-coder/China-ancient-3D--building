export default function ViewControls({
  currentView,
  showBlueprintOverlay,
  viewOptions,
  onChangeView,
}) {
  return (
    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 px-4">
      {viewOptions.map((option) => {
        const isActive =
          option.key === 'blueprint'
            ? showBlueprintOverlay
            : option.key === currentView;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChangeView(option.key)}
            className={`rounded-2xl px-4 py-3 text-sm transition ${
              isActive
                ? 'bg-amber-300 text-stone-950 shadow-amber'
                : 'border border-white/10 bg-black/35 text-stone-200 backdrop-blur-xl hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
