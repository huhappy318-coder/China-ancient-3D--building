export default function ReopenRailButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-5 top-5 rounded-full border border-white/8 bg-black/20 px-3 py-2 text-[11px] text-stone-300 backdrop-blur-md transition hover:bg-white/8 hover:text-white"
    >
      展开
    </button>
  );
}
