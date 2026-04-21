import { Loader2, Wand2, AlertCircle } from "lucide-react";
import { isValidHex } from "../utils";

interface InputPanelProps {
  urlsText: string;
  setUrlsText: (v: string) => void;
  color: string;
  hexInput: string;
  onColorPickerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHexBlur: () => void;
  onFetch: () => void;
  processing: boolean;
  validationMsg: string;
}

export default function InputPanel({
  urlsText,
  setUrlsText,
  color,
  hexInput,
  onColorPickerChange,
  onHexInputChange,
  onHexBlur,
  onFetch,
  processing,
  validationMsg,
}: InputPanelProps) {
  const buttonBg = isValidHex(hexInput) ? hexInput : color;

  return (
    <div
      className="animate-fade-up rounded-2xl bg-white/80 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/6 backdrop-blur-xl p-6 mb-8"
      style={{ animationDelay: "180ms" }}
    >
      {/* URL textarea */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-400 dark:text-zinc-400 tracking-widest uppercase mb-2 font-mono">
          SVG URLs — one per line
        </label>
        <textarea
          className="w-full min-h-[148px] bg-gray-50 dark:bg-zinc-950/70 border border-gray-200 dark:border-white/6 rounded-xl p-4 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-700 resize-y font-mono leading-relaxed focus:outline-none transition-all duration-200"
          style={{
            boxShadow: urlsText ? `inset 0 0 0 1px ${color}30` : undefined,
          }}
          placeholder={
            "https://example.com/icon.svg\nhttps://example.com/logo.svg\nhttps://example.com/arrow.svg"
          }
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Color row */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-400 dark:text-zinc-400 tracking-widest uppercase mb-2 font-mono">
          Target Color
        </label>
        <div className="flex items-center gap-3">
          {/* Swatch circle — native color input hidden underneath */}
          <label className="relative w-10 h-10 cursor-pointer shrink-0 group">
            <div
              className="w-10 h-10 rounded-full border-2 border-black/10 dark:border-white/15 transition-transform duration-200 group-hover:scale-110 active:scale-95 animate-pulse-glow"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 16px ${color}50, inset 0 2px 4px rgba(0,0,0,0.2)`,
              }}
            />
            <input
              type="color"
              value={color}
              onChange={onColorPickerChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Hex text input */}
          <input
            type="text"
            value={hexInput}
            onChange={onHexInputChange}
            onBlur={onHexBlur}
            maxLength={7}
            placeholder="#06b6d4"
            className="w-32 bg-gray-50 dark:bg-zinc-950/70 border border-gray-200 dark:border-white/6 rounded-xl py-2.5 px-3 text-sm font-mono text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none transition-all duration-200"
            style={{
              boxShadow: isValidHex(hexInput)
                ? `inset 0 0 0 1px ${color}40`
                : undefined,
            }}
          />

          {/* Live preview swatch */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-600 font-mono">
            <div
              className="w-5 h-5 rounded-md border border-black/10 dark:border-white/10 shrink-0 transition-colors duration-200"
              style={{ backgroundColor: isValidHex(hexInput) ? hexInput : color }}
            />
            <span className="hidden sm:block">preview</span>
          </div>
        </div>
      </div>

      {/* Validation error */}
      {validationMsg && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {validationMsg}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={onFetch}
        disabled={processing}
        className="relative w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2.5 overflow-hidden group cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
        style={{
          backgroundColor: processing ? `${buttonBg}55` : buttonBg,
          boxShadow: processing
            ? "none"
            : `0 4px 28px ${buttonBg}35, 0 0 0 1px ${buttonBg}25`,
        }}
      >
        {/* Shimmer sweep on hover */}
        {!processing && (
          <span
            className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ animation: "shimmer-sweep 0.7s ease forwards" }}
          />
        )}

        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Fetch &amp; Recolor
          </>
        )}
      </button>
    </div>
  );
}
