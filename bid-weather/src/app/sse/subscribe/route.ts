import { NextResponse } from "next/server";
import https from "https";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function GET() {
  const url = new URL(`${API_BASE}/sse/subscribe`);

  const stream = new ReadableStream({
    start(controller) {
      const req = https.request(
        {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: "GET",
          headers: { Accept: "text/event-stream" },
          rejectUnauthorized: false,
        },
        (res) => {
          res.on("data", (chunk) => {
            controller.enqueue(chunk);
          });
          res.on("end", () => {
            controller.close();
          });
        },
      );

      req.on("error", () => {
        controller.close();
      });

      req.end();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
