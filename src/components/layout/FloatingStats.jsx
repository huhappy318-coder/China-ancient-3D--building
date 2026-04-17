export default function FloatingStats({ stats, isRailHidden }) {
  return (
    <div
      className={`absolute top-32 z-10 flex flex-col gap-3 transition-all duration-300 ${
        isRailHidden ? 'left-5' : 'left-5 md:left-[424px]'
      }`}
    >
      {stats.map((item) => (
        <div
          key={item.label}
          className="min-w-[148px] rounded-2xl border border-white/10 bg-black/35 px-4 py-3 shadow-glow backdrop-blur-xl"
        >
          <p className="text-xs text-stone-400">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
