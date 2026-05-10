import { NextRequest, NextResponse } from "next/server";
import https from "https";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

function proxyFetch(targetUrl: string, method: string, headers: Record<string, string>, body?: string): Promise<{ status: number; contentType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method,
      headers,
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({
          status: res.statusCode || 500,
          contentType: res.headers["content-type"] || "application/json",
          data,
        });
      });
    });

    req.on("error", reject);

    if (body) req.write(body);
    req.end();
  });
}

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = `${API_BASE}${url.pathname}${url.search}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text();
  }

  const response = await proxyFetch(targetUrl, req.method, headers, body);

  return new NextResponse(response.data, {
    status: response.status,
    headers: { "Content-Type": response.contentType },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
