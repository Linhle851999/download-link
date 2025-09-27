'use client';

import { useState, useEffect } from 'react';

const DownLoad = () => {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [adVisible, setAdVisible] = useState(true);

  useEffect(() => {
    setDownloadCount(12487);

    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openSystemDownloadSameTab = (rawUrl: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = rawUrl;
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 60_000);
  };

  const handleDownload = async () => {
    if (!url || busy) return;
    setBusy(true);
    try {
      const apiUrl = `/api/download-video?url=${encodeURIComponent(url)}`;
      openSystemDownloadSameTab(apiUrl);

      // Track conversion for ads
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'download', {
          event_category: 'engagement',
          event_label: 'tiktok_download',
        });
      }
    } finally {
      setTimeout(() => setBusy(false), 1500);
    }
  };

  const onButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    handleDownload();
  };

  // Ad spaces configuration
  const adSpaces = [
    {
      id: 1,
      type: 'banner',
      code: `<!-- Google AdSense Banner -->
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-XXXXXXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
      description: 'Sponsored',
    },
    {
      id: 2,
      type: 'native',
      title: "🔥 Editors' Choice",
      subtitle: 'Top Video Editor App',
      description: 'Create amazing videos easily',
      cta: 'Download Now',
      url: '#',
      sponsored: true,
    },
  ];

  return (
    <main>
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm sm:px-40 py-3 flex items-center justify-center sm:justify-start z-50">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <span className="text-2xl">📥</span>
          <span>TokSave</span>
        </div>

        {/* Trust badges */}
        <div className="hidden sm:flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>100% Free</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>No Watermark</span>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 pt-20">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Download Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {/* Social Proof */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                <span className="text-lg">🎉</span>
                <span>
                  <strong>{downloadCount.toLocaleString()}+</strong> videos
                  downloaded today
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
              Download TikTok
            </h1>
            <p className="text-center text-gray-600 mb-6">
              No watermark • HD quality • 100% free forever
            </p>

            <form onSubmit={onButtonClick} className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  placeholder="Paste TikTok URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black text-lg"
                />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!url || busy}
                className={`w-full py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-lg ${
                  !url || busy
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transform hover:scale-105 shadow-lg'
                }`}
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Downloading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">⬇️</span>
                    DOWNLOAD FREE NOW
                  </span>
                )}
              </button>
            </form>

            {/* Small Banner Ad */}
            <div className="mt-6 text-center">
              <div className="text-xs text-gray-500 mb-2">ADVERTISEMENT</div>
              <div className="bg-gray-100 rounded-lg p-4 min-h-[90px] flex items-center justify-center">
                {adVisible ? (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Loading ad...</div>
                    {/* Google AdSense sẽ hiển thị ở đây */}
                    <div
                    // dangerouslySetInnerHTML={{ __html: adSpaces[0].code }}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Ad space</div>
                )}
              </div>
            </div>
          </div>

          {/* Ad Sidebar Section */}
          <div className="space-y-4">
            {/* Google AdSense Square */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-2">ADVERTISEMENT</div>
              <div className="min-h-[250px] flex items-center justify-center">
                {adVisible ? (
                  // <div
                  //   dangerouslySetInnerHTML={{
                  //     __html: `
                  //   <!-- Google AdSense Square -->
                  //   <ins class="adsbygoogle"
                  //        style="display:block"
                  //        data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                  //        data-ad-slot="XXXXXXXXXX"
                  //        data-ad-format="rectangle"
                  //        data-full-width-responsive="true"></ins>
                  //   <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                  // `,
                  //   }}
                  // />
                  <></>
                ) : (
                  <div className="text-sm text-gray-400">Ad loading...</div>
                )}
              </div>
            </div>
          </div>

          {/* How it works section */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 mt-4">
            <h3 className="text-xl text-black font-bold text-center mb-6">
              How to Download TikTok Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="text-black mb-2 text-black">Copy TikTok URL</h4>
                <p className="text-sm text-gray-600">
                  Copy the link from TikTok app or website
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="text-black mb-2 text-black">Paste & Download</h4>
                <p className="text-sm text-gray-600">
                  Paste the URL and click download button
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="text-black mb-2">Save Video</h4>
                <p className="text-sm text-gray-600">
                  Your video will download instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with more ad space */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="bg-gray-700 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
              <div className="text-sm text-gray-300">
                Partner advertisement space
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Google AdSense Script */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXX"
        crossOrigin="anonymous"
      />
    </main>
  );
};

export default DownLoad;
