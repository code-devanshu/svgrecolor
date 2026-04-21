import { NextRequest, NextResponse } from "next/server";
import https from "https";
import http from "http";
import { URL } from "url";

function fetchWithRedirects(
  urlStr: string,
  redirectCount = 0
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) {
      return reject(new Error("Too many redirects"));
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlStr);
    } catch {
      return reject(new Error("Invalid URL"));
    }

    const lib = parsedUrl.protocol === "https:" ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/svg+xml,*/*",
      },
    };

    const req = lib.get(options, (res) => {
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        const redirectUrl = new URL(res.headers.location, urlStr).toString();
        resolve(fetchWithRedirects(redirectUrl, redirectCount + 1));
        return;
      }

      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ message: "Missing url" }, { status: 400 });
  }

  try {
    const svg = await fetchWithRedirects(url.trim());
    if (!svg.includes("<svg")) {
      return NextResponse.json(
        { message: "Response does not appear to be an SVG" },
        { status: 400 }
      );
    }
    return new NextResponse(svg, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
