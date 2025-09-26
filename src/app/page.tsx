'use client';

import { useState } from 'react';

const DownLoad = () => {
  const [url, setUrl] = useState('');

  const handleDownload = () => {
    if (!url) return alert('Url invalid');

    window.location.href = `/api/download-video?url=${encodeURIComponent(url)}`;
  };

  const onButtonClick = (e: React.FormEvent) => {
    e.preventDefault();

    handleDownload();
  };

  return (
    <main>
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm sm:px-40 py-3 flex items-center justify-center sm:justify-start z-50">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <span className="text-2xl">📥</span>
          <span>TokSave</span>
        </div>
      </header>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
            Download TikTok
          </h1>
          <form
            onSubmit={onButtonClick}
            className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
          >
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="Paste TikTok URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear input"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!url}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-200 ${
                !url
                  ? 'bg-blue-300 text-white opacity-60 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Download
            </button>
          </form>
          <p className="mt-3 text-sm text-gray-500 text-center">
            Works for public videos. If parsing fails, open the TikTok link in a
            desktop browser and try again.
          </p>
        </div>
      </div>
    </main>
  );
};

export default DownLoad;
