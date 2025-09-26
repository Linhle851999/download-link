'use client';

import { useState } from 'react';

const DownLoad = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return alert('Url invalid');

    window.location.href = `/api/download-video?url=${encodeURIComponent(url)}`;
  };

  return (
    <main style={{ maxWidth: 560, margin: '48px auto', padding: 16 }}>
      <h1>Download TikTok (Public)</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="url"
          required
          placeholder="Paste TikTok URL (e.g., https://www.tiktok.com/@user/video/123...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: '10px 12px' }}
        />
        <button type="submit">Download</button>
      </form>
      <p style={{ marginTop: 12, fontSize: 14, opacity: 0.75 }}>
        Works for public videos. If parsing fails, open the TikTok link in a
        desktop browser and try again.
      </p>
    </main>
  );
};

export default DownLoad;
