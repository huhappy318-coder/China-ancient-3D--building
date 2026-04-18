export default function ViewControls({
  currentView,
  showBlueprintOverlay,
  viewOptions,
  onChangeView,
}) {
  return (
    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 px-4">
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
            className={`rounded-full px-4 py-2 text-sm transition ${
              isActive
                ? 'bg-amber-200 text-stone-950'
                : 'border border-white/10 bg-black/22 text-stone-300 backdrop-blur-md hover:bg-white/8'
            } ${option.key === 'roam' ? 'opacity-70' : ''}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
