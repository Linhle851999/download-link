import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TokSave: Download TikTok Video Without Watermark',
  description:
    'TokSave is the fastest tool to download HD TikTok videos without watermark. No registration, free and easy to use.',
  keywords:
    'tiktok download, tiktok video download, download tiktok without watermark, tiktok saver, tải video tiktok, tải video tiktok không logo, tải video, tải tiktok, TokSave, SnapSave, Save Tiktok, download tiktok, tải video tiktok, down tiktok',
  authors: [{ name: 'TokSave' }],
  creator: 'TokSave',
  publisher: 'TokSave',
  metadataBase: new URL('https://toksave.space'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TokSave: Download TikTok Video Without Watermark',
    description:
      'Free TikTok video downloader. Download HD TikTok videos without watermark',
    url: 'https://toksave.space',
    siteName: 'TokSave',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TokSave - TikTok Video Downloader',
      },
    ],
    // locale: 'vi_VN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title: 'TokSave: Download TikTok Video Without Watermark',
    description: 'Free TikTok video downloader',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // TODO: update later
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
