export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function recolorSvg(svg: string, hex: string): string {
  let result = svg.replace(/fill="(?!none")[^"]*"/gi, `fill="${hex}"`);
  result = result.replace(/stroke="(?!none")[^"]*"/gi, `stroke="${hex}"`);
  result = result.replace(/(fill|stroke|color)\s*:\s*[^;}"']+/gi, `$1:${hex}`);
  return result;
}

export function urlToFilename(url: string, index: number): string {
  try {
    const path = new URL(url).pathname;
    const name = path.split("/").pop() || `svg-${index + 1}.svg`;
    return name.endsWith(".svg") ? name : `${name}.svg`;
  } catch {
    return `svg-${index + 1}.svg`;
  }
}
