import ThemeToggle from "./ThemeToggle";

interface AppHeaderProps {
  color: string;
}

export default function AppHeader({ color }: AppHeaderProps) {
  return (
    <header className="relative pt-14 pb-10">
      {/* Glow orbs — no overflow-hidden so they blend freely */}
      <div
        className="absolute -top-24 -left-16 w-120 h-120 rounded-full blur-[130px] pointer-events-none"
        style={{ backgroundColor: color, opacity: 0.06 }}
      />
      <div className="absolute -top-10 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none bg-violet-500/4" />

      <div className="relative z-10">
        {/* Top row: badge + theme toggle */}
        <div
          className="flex items-center justify-between mb-5 animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/90 dark:bg-zinc-900/80 border border-gray-200 dark:border-white/7 text-xs text-gray-500 dark:text-zinc-400 font-mono">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow shrink-0"
              style={{ backgroundColor: color }}
            />
            Batch · Recolor · Export
          </div>
          <ThemeToggle />
        </div>

        {/* Title */}
        <h1
          className="animate-fade-up text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-gray-900 dark:text-white mb-4"
          style={{ animationDelay: "60ms" }}
        >
          SVG Batch{" "}
          <span className="text-gray-400 dark:text-zinc-500">Recolor</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up text-gray-500 dark:text-zinc-500 text-[clamp(0.875rem,2vw,1rem)] max-w-lg leading-relaxed"
          style={{ animationDelay: "120ms" }}
        >
          Paste SVG URLs, pick a target color, and download recolored files
          individually or as a ZIP — all processed server-side.
        </p>
      </div>
    </header>
  );
}
