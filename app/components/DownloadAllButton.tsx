import { Archive } from "lucide-react";

interface DownloadAllButtonProps {
  count: number;
  color: string;
  onDownload: () => void;
}

export default function DownloadAllButton({
  count,
  color,
  onDownload,
}: DownloadAllButtonProps) {
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4 pointer-events-none animate-slide-up">
      <button
        onClick={onDownload}
        className="pointer-events-auto px-7 py-3.5 rounded-xl font-semibold text-white flex items-center gap-2.5 transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.97] cursor-pointer text-sm"
        style={{
          backgroundColor: color,
          boxShadow: `0 8px 40px ${color}45, 0 2px 8px ${color}30, 0 0 0 1px ${color}20`,
        }}
      >
        <Archive className="w-4 h-4 shrink-0" />
        Download All ({count} {count === 1 ? "SVG" : "SVGs"}) as ZIP
      </button>
    </div>
  );
}
