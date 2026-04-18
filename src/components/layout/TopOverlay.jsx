export default function TopOverlay({ isRailHidden }) {
  return (
    <header
      className={`absolute top-5 z-20 transition-all duration-300 ${
        isRailHidden ? 'left-5' : 'left-[86px]'
      }`}
    >
      <div className="rounded-[18px] border border-white/8 bg-black/14 px-4 py-3 backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-[0.28em] text-amber-100/76">
          中国古建筑自由搭建
        </div>
        <h1 className="mt-1 font-display text-[18px] tracking-[0.01em] text-white md:text-[20px]">
          沉浸式古建筑搭建页
        </h1>
        <p className="mt-1 text-[12px] text-stone-400">
          先看建筑，再决定何时展开工具。
        </p>
      </div>
    </header>
  );
}
