"use client";

import { useState, useCallback, useMemo } from "react";
import JSZip from "jszip";
import AppHeader from "./components/AppHeader";
import InputPanel from "./components/InputPanel";
import ProgressBar from "./components/ProgressBar";
import ResultsGrid from "./components/ResultsGrid";
import DownloadAllButton from "./components/DownloadAllButton";
import { SvgCardData } from "./types";
import { isValidHex, recolorSvg, urlToFilename } from "./utils";

export default function Home() {
  const [urlsText, setUrlsText] = useState("");
  const [color, setColor] = useState("#06b6d4");
  const [hexInput, setHexInput] = useState("#06b6d4");
  const [cards, setCards] = useState<SvgCardData[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const handleColorPickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setColor(e.target.value);
      setHexInput(e.target.value);
    },
    []
  );

  const handleHexInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHexInput(val);
      if (isValidHex(val)) setColor(val);
    },
    []
  );

  const handleHexBlur = useCallback(() => {
    if (!isValidHex(hexInput)) setHexInput(color);
  }, [hexInput, color]);

  const handleFetch = useCallback(async () => {
    const urls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      setValidationMsg("Please enter at least one SVG URL.");
      return;
    }
    if (!isValidHex(hexInput)) {
      setValidationMsg("Please enter a valid hex color (e.g. #ff0000).");
      return;
    }

    setValidationMsg("");
    setDone(false);
    setProcessed(0);
    setTotal(urls.length);
    setProcessing(true);
    setCards(
      urls.map((url, i) => ({
        url,
        filename: urlToFilename(url, i),
        svg: null,
        originalSvg: null,
        error: null,
      }))
    );

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const res = await fetch("/api/fetch-svg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({ message: "Failed" }));
          setCards((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], error: data.message || "Failed to fetch" };
            return next;
          });
        } else {
          const rawSvg = await res.text();
          const recolored = recolorSvg(rawSvg, hexInput);
          setCards((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], svg: recolored, originalSvg: rawSvg };
            return next;
          });
        }
      } catch {
        setCards((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], error: "Network error" };
          return next;
        });
      }

      setProcessed((p) => p + 1);
    }

    setProcessing(false);
    setDone(true);
  }, [urlsText, hexInput]);

  const downloadSingle = useCallback((card: SvgCardData) => {
    if (!card.svg) return;
    const blob = new Blob([card.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = card.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadAll = useCallback(async () => {
    const zip = new JSZip();
    const successCards = cards.filter((c) => c.svg);
    if (successCards.length === 0) return;
    successCards.forEach((card) => zip.file(card.filename, card.svg!));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recolored-svgs.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const progressPct = useMemo(
    () => (total > 0 ? Math.round((processed / total) * 100) : 0),
    [processed, total]
  );
  const successCount = useMemo(
    () => cards.filter((c) => c.svg).length,
    [cards]
  );

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-zinc-950 noise-overlay"
      style={{ "--user-color": color } as React.CSSProperties}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-36">
        <AppHeader color={color} />

        <InputPanel
          urlsText={urlsText}
          setUrlsText={setUrlsText}
          color={color}
          hexInput={hexInput}
          onColorPickerChange={handleColorPickerChange}
          onHexInputChange={handleHexInputChange}
          onHexBlur={handleHexBlur}
          onFetch={handleFetch}
          processing={processing}
          validationMsg={validationMsg}
        />

        {(processing || (done && total > 0)) && (
          <ProgressBar
            processed={processed}
            total={total}
            pct={progressPct}
            color={color}
          />
        )}

        <ResultsGrid
          cards={cards}
          onDownloadSingle={downloadSingle}
          color={color}
        />
      </div>

      {done && successCount > 0 && (
        <DownloadAllButton
          count={successCount}
          color={color}
          onDownload={downloadAll}
        />
      )}

      <footer className="text-center text-gray-400 dark:text-zinc-700 text-xs pt-8 pb-24 font-mono tracking-wide flex flex-col items-center gap-1.5">
        <span>Built with Next.js · SVG Batch Recolor Tool</span>
        <a
          href="https://www.devanshuverma.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 dark:text-zinc-600 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors duration-150 underline underline-offset-2"
        >
          Need help? Contact me →
        </a>
      </footer>
    </div>
  );
}
