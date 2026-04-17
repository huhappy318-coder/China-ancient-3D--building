export default function ReopenRailButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white shadow-glow backdrop-blur-xl transition hover:bg-white/10"
    >
      展开边框
    </button>
  );
}
