interface ProgressBarProps {
  processed: number;
  total: number;
  pct: number;
  color: string;
}

export default function ProgressBar({ processed, total, pct, color }: ProgressBarProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 dark:text-zinc-500 font-mono">
          <span className="text-gray-800 dark:text-zinc-200">{processed}</span>
          <span className="text-gray-400 dark:text-zinc-600"> / </span>
          <span className="text-gray-500 dark:text-zinc-400">{total}</span>
          <span className="text-gray-400 dark:text-zinc-600"> processed</span>
        </span>
        <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono tabular-nums">{pct}%</span>
      </div>

      <div className="w-full h-0.75 bg-gray-200 dark:bg-zinc-800/80 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: pct > 0 ? `0 0 8px ${color}90, 0 0 2px ${color}` : "none",
          }}
        />
      </div>
    </div>
  );
}
