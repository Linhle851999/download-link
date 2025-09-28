// app/api/slack/route.ts
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response('`text` is required', { status: 400 });
    }
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
      return new Response('Missing SLACK_WEBHOOK_URL', { status: 500 });
    }

    const slackRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      // optional: timeout
      cache: 'no-store',
    });

    const body = await slackRes.text();
    if (!slackRes.ok) {
      return new Response(`Slack error ${slackRes.status}: ${body}`, {
        status: slackRes.status,
      });
    }

    return new Response(body, { status: 200 }); // usually "ok"
  } catch (e: any) {
    return new Response(`Server error: ${e?.message ?? 'unknown'}`, {
      status: 500,
    });
  }
}
