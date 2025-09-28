export const sendSlack = async (text: string) => {
  const res = await fetch('/api/slack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const msg = await res.text();
  if (!res.ok) throw new Error(msg);
  return msg;
};
