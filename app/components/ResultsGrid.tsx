import { Layers } from "lucide-react";
import SvgCard from "./SvgCard";
import { SvgCardData } from "../types";

interface ResultsGridProps {
  cards: SvgCardData[];
  onDownloadSingle: (card: SvgCardData) => void;
  color: string;
}

export default function ResultsGrid({ cards, onDownloadSingle, color }: ResultsGridProps) {
  if (cards.length === 0) {
    return (
      <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
        <div className="border border-dashed border-gray-300 dark:border-zinc-800/80 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-900/60 border border-gray-200 dark:border-white/5 flex items-center justify-center">
            <Layers className="w-6 h-6 text-gray-400 dark:text-zinc-600" />
          </div>
          <div>
            <p className="text-gray-600 dark:text-zinc-400 text-sm font-medium mb-1.5">
              No SVGs yet
            </p>
            <p className="text-gray-400 dark:text-zinc-600 text-xs max-w-xs leading-relaxed">
              Paste SVG URLs above and pick a color to get started
            </p>
          </div>
          <div
            className="w-1.5 h-1.5 rounded-full opacity-40 animate-pulse-glow"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <SvgCard
          key={i}
          card={card}
          index={i}
          color={color}
          onDownload={onDownloadSingle}
        />
      ))}
    </div>
  );
}
