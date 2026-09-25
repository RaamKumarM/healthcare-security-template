import { readDb } from "../../../../dashboard/components/lib/store.js";

/**
 * GET /api/events/stream — Server-Sent Events pushing threat scan updates.
 * Events: `threats` (snapshot on connect + on change), `: heartbeat` comments.
 */
export async function GET() {
  const enc = new TextEncoder();
  let lastBlocked = -1;
  let poll;
  let heartbeat;

  const snapshot = () => {
    const db = readDb();
    return {
      threatsBlocked: db.metrics.threatsBlocked,
      endpointHealth: db.metrics.endpointHealth,
      events: db.metrics.timeseries.slice(-6),
    };
  };

  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          const snap = snapshot();
          if (snap.threatsBlocked !== lastBlocked) {
            lastBlocked = snap.threatsBlocked;
            controller.enqueue(
              enc.encode(`event: threats\ndata: ${JSON.stringify(snap)}\n\n`)
            );
          }
        } catch {
          /* client gone — cleanup runs on cancel */
        }
      };
      send();
      poll = setInterval(send, 5000);
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(enc.encode(`: heartbeat\n\n`));
        } catch {
          /* noop */
        }
      }, 15000);
    },
    cancel() {
      clearInterval(poll);
      clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
