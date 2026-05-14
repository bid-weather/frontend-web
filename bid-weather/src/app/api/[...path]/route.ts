import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = `${API_BASE}${url.pathname}${url.search}`;

  try {
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.set("Content-Type", "application/json");

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseData = await response.text();

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy Request Failed:", error);
    return new NextResponse(
      JSON.stringify({ message: "백엔드 서버와 통신할 수 없습니다." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
