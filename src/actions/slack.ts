'use server';

export async function sendSlack(text: string) {
  if (!text) throw new Error('`text` is required');

  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) throw new Error('Missing SLACK_WEBHOOK_URL');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    cache: 'no-store',
  });

  const body = await res.text();
  if (!res.ok) throw new Error(`Slack error ${res.status}: ${body}`);
  return body; // "ok"
}
