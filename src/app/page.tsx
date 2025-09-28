'use client';

import { useState, useEffect } from 'react';

import { sendSlack } from '@/actions/slack';

const DownLoad = () => {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setDownloadCount(12487);

    // Intersection Observer để theo dõi section active
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
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

      sendSlack(
        `🚀 A new user just visited the website at ${new Date().toLocaleString()}`
      );
    } finally {
      setTimeout(() => setBusy(false), 1500);
    }
  };

  const onButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    handleDownload();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <main>
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm px-4 sm:px-40 py-3 flex items-center justify-between z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg sm:text-xl">
          <span className="text-xl sm:text-2xl">📥</span>
          <span>TokSave</span>
        </div>

        {/* Navigation - Ẩn trên mobile */}
        <nav className="hidden sm:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('home')}
            className={`font-medium transition-colors duration-200 ${
              activeSection === 'home'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className={`font-medium transition-colors duration-200 ${
              activeSection === 'how-it-works'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className={`font-medium transition-colors duration-200 ${
              activeSection === 'features'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className={`font-medium transition-colors duration-200 ${
              activeSection === 'faq'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Trust badges - Ẩn trên mobile */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>100% Free</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>No Watermark</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="sm:hidden text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Home Section */}
      <section
        id="home"
        className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-20 sm:py-32"
      >
        <div className="w-full max-w-4xl">
          {/* Social Proof */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium shadow-sm">
              <span className="text-base sm:text-lg">🎉</span>
              <span>
                <strong>{downloadCount.toLocaleString()}+</strong> videos
                downloaded today
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-center text-blue-700 mb-3 sm:mb-4">
              Download TikTok Videos
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-lg mb-6 sm:mb-8">
              Free, fast, and secure • No watermark • No registration required
            </p>

            <form
              onSubmit={onButtonClick}
              className="space-y-4 sm:space-y-6 max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="url"
                  placeholder="Paste TikTok URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 pr-10 sm:pr-12 border-2 border-blue-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-black text-base sm:text-lg transition-all duration-200"
                />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg sm:text-xl transition-colors duration-200"
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!url || busy}
                className={`w-full py-3 px-6 sm:py-4 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 font-bold text-base sm:text-lg ${
                  !url || busy
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-2 sm:border-3 border-white border-t-transparent"></div>
                    <span className="text-sm sm:text-base">
                      Downloading Your Video...
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">⬇️</span>
                    <span className="text-sm sm:text-base">
                      DOWNLOAD FREE NOW
                    </span>
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-30 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              How to Download TikTok Videos
            </h2>
            <p className="text-gray-600 text-sm sm:text-lg">
              Simple steps to save your favorite TikTok videos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Copy TikTok URL
              </h3>
              <p className="text-gray-600 text-xs sm:text-base">
                Open TikTok app, find the video you want to download, and copy
                the share link
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Paste & Download
              </h3>
              <p className="text-gray-600 text-xs sm:text-base">
                Paste the copied URL into the input field above and click the
                download button
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Save & Enjoy
              </h3>
              <p className="text-gray-600 text-xs sm:text-base">
                Your video will download in HD quality without watermark. Save
                it to your device
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Why Choose TokSave?
            </h2>
            <p className="text-gray-600 text-sm sm:text-lg">
              The best TikTok video downloader with amazing features
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Mobile-friendly layout với 2 cột trên mobile */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
              {[
                {
                  icon: '⚡',
                  title: 'Fast Download',
                  desc: 'High-speed processing',
                  bgColor: 'bg-yellow-50',
                  iconColor: 'text-yellow-600',
                },
                {
                  icon: '🔒',
                  title: '100% Safe',
                  desc: 'No viruses or malware',
                  bgColor: 'bg-green-50',
                  iconColor: 'text-green-600',
                },
                {
                  icon: '💧',
                  title: 'No Watermark',
                  desc: 'Clean videos without logo',
                  bgColor: 'bg-blue-50',
                  iconColor: 'text-blue-600',
                },
                {
                  icon: '📱',
                  title: 'HD Quality',
                  desc: 'High definition videos',
                  bgColor: 'bg-purple-50',
                  iconColor: 'text-purple-600',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto`}
                  >
                    <span className={`text-lg sm:text-xl ${feature.iconColor}`}>
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm text-center leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs text-center leading-tight">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Hàng thứ 2 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mt-3 sm:mt-6">
              {[
                {
                  icon: '🆓',
                  title: 'Completely Free',
                  desc: 'No hidden charges',
                  bgColor: 'bg-green-50',
                  iconColor: 'text-green-600',
                },
                {
                  icon: '🌐',
                  title: 'Works Worldwide',
                  desc: 'Access from any country',
                  bgColor: 'bg-indigo-50',
                  iconColor: 'text-indigo-600',
                },
                {
                  icon: '⚙️',
                  title: 'No Installation',
                  desc: 'Use directly in browser',
                  bgColor: 'bg-orange-50',
                  iconColor: 'text-orange-600',
                },
                {
                  icon: '🚀',
                  title: 'Unlimited Downloads',
                  desc: 'Download as many as you want',
                  bgColor: 'bg-red-50',
                  iconColor: 'text-red-600',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto`}
                  >
                    <span className={`text-lg sm:text-xl ${feature.iconColor}`}>
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm text-center leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs text-center leading-tight">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Call-to-Action */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Ready to Download?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base mb-4">
                Join thousands of satisfied users downloading TikTok videos
                every day
              </p>
              <button
                onClick={() => scrollToSection('home')}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
              >
                Start Downloading Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-sm sm:text-lg">
              Find answers to common questions about TokSave
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: 'Is TokSave really free?',
                answer:
                  'Yes! TokSave is completely free to use. There are no hidden fees or subscription charges.',
              },
              {
                question: 'Does it work on mobile devices?',
                answer:
                  'Absolutely! TokSave works on all devices including smartphones, tablets, and computers.',
              },
              {
                question: 'Are the downloaded videos watermarked?',
                answer:
                  'No, all videos are downloaded without the TikTok watermark for a clean viewing experience.',
              },
              {
                question: 'Is it legal to download TikTok videos?',
                answer:
                  'Yes, for personal use. However, please respect copyright and only download videos you have permission to use.',
              },
              {
                question: 'How long does it take to download a video?',
                answer:
                  'Usually just a few seconds! The speed depends on your internet connection and video length.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-xs sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-4 md:mb-0">
              <span>📥</span>
              <span>TokSave</span>
            </div>
            <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
              <button
                onClick={() => scrollToSection('home')}
                className="hover:text-blue-300 transition-colors text-sm sm:text-base"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-blue-300 transition-colors text-sm sm:text-base"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-blue-300 transition-colors text-sm sm:text-base"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:text-blue-300 transition-colors text-sm sm:text-base"
              >
                FAQ
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-base">
            © 2025 TokSave. All rights reserved. | Free TikTok Video Downloader
          </p>
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
