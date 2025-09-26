import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

function bad(status: number, message: string, extra?: any) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

function isShortTikTok(u: URL) {
  return (
    /(^|\.)((vm|vt)\.tiktok\.com)$/i.test(u.hostname) ||
    u.pathname.startsWith('/t/')
  );
}

async function expandIfShort(input: string): Promise<string> {
  const u = new URL(input);
  if (!isShortTikTok(u)) return input;

  const r = await fetch(input, {
    redirect: 'follow',
    headers: { 'User-Agent': UA, Referer: 'https://www.tiktok.com/' },
  });
  if (!r.ok) throw new Error(`Short link expand failed: ${r.status}`);
  return r.url;
}

function cleanTiktokUrl(input: string): string {
  try {
    const u = new URL(input);
    return `https://www.tiktok.com${u.pathname}`;
  } catch {
    return input;
  }
}

function firstHttp(xs: any): string | null {
  if (!xs) return null;
  if (Array.isArray(xs))
    return (
      (xs.find(
        (s) => typeof s === 'string' && s.startsWith('http')
      ) as string) || null
    );
  if (typeof xs === 'string' && xs.startsWith('http')) return xs;
  return null;
}

function pickFromTikwm(json: any): string | null {
  const d = json?.data ?? {};
  return firstHttp([d.hdplay, d.play, d.wmplay]);
}

function pickFromGeneric(json: any): string | null {
  const d = json?.data ?? json;
  const c = firstHttp([
    d?.no_watermark,
    d?.nowm,
    d?.hdplay,
    d?.play,
    d?.wmplay,
    d?.url,
  ]);
  if (c) return c;

  const arrs = [d?.url_list, d?.links, json?.url_list, json?.links].filter(
    Boolean
  );
  for (const arr of arrs) {
    const got = firstHttp(arr);
    if (got) return got;
  }

  const raw = JSON.stringify(json);
  const m = raw.match(/https?:\\?\/\\?\/[^"\\]+\.mp4/gi);
  return m?.length ? m[0].replace(/\\\//g, '/') : null;
}

async function providerTikwm(tiktokUrl: string) {
  const url = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`tikwm failed ${res.status}`);
  const j = await res.json();
  return {
    provider: 'tikwm' as const,
    raw: j,
    videoUrl: pickFromTikwm(j) || pickFromGeneric(j),
  };
}

async function providerRapid(tiktokUrl: string) {
  const key = process.env.RAPIDAPI_KEY;
  const host =
    process.env.RAPIDAPI_HOST || 'tiktok-video-no-watermark2.p.rapidapi.com';
  const endpoint = process.env.RAPIDAPI_ENDPOINT || `https://${host}/`;
  if (!key) throw new Error('RAPIDAPI_KEY not configured');

  const url = `${endpoint}?url=${encodeURIComponent(tiktokUrl)}`;
  const res = await fetch(url, {
    headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': host },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`rapidapi failed ${res.status}`);
  const j = await res.json();
  return {
    provider: 'rapidapi' as const,
    raw: j,
    videoUrl: pickFromGeneric(j),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get('url');
  const wantRedirect = searchParams.get('redirect') === '1';
  const wantJson = searchParams.get('json') === '1';
  if (!rawUrl) return bad(400, 'Missing ?url');

  const input = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  let expanded = input;
  try {
    expanded = await expandIfShort(input);
  } catch {}

  const tiktokUrl = cleanTiktokUrl(expanded);

  const tried: any[] = [];
  let result: {
    provider: 'tikwm' | 'rapidapi';
    raw: any;
    videoUrl: string | null;
  } | null = null;

  try {
    result = await providerTikwm(tiktokUrl);
    tried.push({ provider: 'tikwm', ok: true });
  } catch (e: any) {
    tried.push({ provider: 'tikwm', ok: false, err: e?.message });
  }

  if ((!result || !result.videoUrl) && process.env.RAPIDAPI_KEY) {
    try {
      result = await providerRapid(tiktokUrl);
      tried.push({ provider: 'rapidapi', ok: true });
    } catch (e: any) {
      tried.push({ provider: 'rapidapi', ok: false, err: e?.message });
    }
  }

  if (!result || !result.videoUrl) {
    return bad(502, 'No downloadable URL from providers', {
      tried,
      input,
      expanded,
      tiktokUrl,
    });
  }

  if (wantJson) {
    return NextResponse.json({
      provider: result.provider,
      videoUrl: result.videoUrl,
      tried,
      expanded,
      tiktokUrl,
      raw: result.raw,
    });
  }

  if (wantRedirect) {
    return NextResponse.redirect(result.videoUrl, { status: 302 });
  }

  const videoRes = await fetch(result.videoUrl, {
    headers: { 'User-Agent': UA, Referer: 'https://www.tiktok.com/' },
    redirect: 'follow',
  });
  if (!videoRes.ok || !videoRes.body) {
    return bad(502, `Fetch video failed (${videoRes.status})`, {
      provider: result.provider,
    });
  }

  const resp = new Response(videoRes.body, {
    status: 200,
    headers: {
      'content-type': videoRes.headers.get('content-type') || 'video/mp4',
      'content-disposition': `attachment; filename="tiktok.mp4"`,
      'cache-control': 'no-store',
    },
  });
  return new NextResponse(resp.body, { headers: resp.headers });
}
