"use client";

import { useState } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { SvgCardData } from "../types";

interface SvgCardProps {
  card: SvgCardData;
  index: number;
  color: string;
  onDownload: (card: SvgCardData) => void;
}

export default function SvgCard({ card, index, color, onDownload }: SvgCardProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const isLoading = !card.svg && !card.error;
  const isError = !!card.error;
  const hasComparison = !!card.svg && !!card.originalSvg;
  const displaySvg = showOriginal ? card.originalSvg : card.svg;

  return (
    <div
      className={`group flex flex-col rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 animate-fade-up ${
        isError
          ? "border-red-300/40 dark:border-red-500/25 bg-red-50/80 dark:bg-red-950/10 hover:border-red-400/50 dark:hover:border-red-500/40"
          : "border-gray-200 dark:border-white/6 bg-white dark:bg-zinc-900/50 hover:border-gray-300 dark:hover:border-white/12 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30"
      }`}
      style={{
        animationDelay: `${Math.min(index * 50, 600)}ms`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Preview — checkerboard background */}
      <div className="checkerboard aspect-square relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 animate-shimmer-skeleton" />
        )}

        {displaySvg && (
          <div
            className="absolute inset-0 flex items-center justify-center p-4 [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: displaySvg }}
          />
        )}

        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <AlertTriangle className="w-6 h-6 text-red-400/70" />
            <span className="text-xs text-red-500/80 dark:text-red-400/80 text-center font-mono leading-relaxed line-clamp-3">
              {card.error}
            </span>
          </div>
        )}

        {/* Before / After pill — overlaid bottom-center */}
        {hasComparison && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-md text-[10px] font-mono font-medium">
            <button
              onClick={() => setShowOriginal(false)}
              className="px-2.5 py-1 transition-colors duration-150 cursor-pointer"
              style={{
                backgroundColor: !showOriginal ? color : undefined,
                color: !showOriginal ? "#fff" : undefined,
              }}
            >
              <span className={!showOriginal ? "opacity-90" : "text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 inline-block px-2.5 py-1 -mx-2.5 -my-1"}>
                After
              </span>
            </button>
            <button
              onClick={() => setShowOriginal(true)}
              className="px-2.5 py-1 transition-colors duration-150 cursor-pointer"
              style={{
                backgroundColor: showOriginal ? color : undefined,
                color: showOriginal ? "#fff" : undefined,
              }}
            >
              <span className={showOriginal ? "opacity-90" : "text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 inline-block px-2.5 py-1 -mx-2.5 -my-1"}>
                Before
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-white/5">
        <p
          className="text-xs text-gray-500 dark:text-zinc-500 font-mono truncate mb-2.5"
          title={card.filename}
        >
          {card.filename}
        </p>

        {card.svg && (
          <button
            onClick={() => onDownload(card)}
            className="w-full py-1.5 bg-gray-100 dark:bg-zinc-800/60 hover:bg-gray-200 dark:hover:bg-zinc-700/80 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        )}

        {isLoading && (
          <div className="animate-shimmer-skeleton h-6 rounded-lg opacity-60" />
        )}
      </div>
    </div>
  );
}
