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
  title: 'TokSave - Download TikTok Video Without Watermark',
  description:
    'Free TikTok video downloader. Download HD TikTok videos without watermark quickly and easily. No registration required.',
  keywords:
    'tiktok download, tiktok video download, download tiktok without watermark, tiktok saver, tải video tiktok, tải video tiktok không logo, tải video',
  authors: [{ name: 'TokSave' }],
  creator: 'TokSave',
  publisher: 'TokSave',
  metadataBase: new URL('https://yoursite.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TokSave - Download TikTok Video Without Watermark',
    description:
      'Free TikTok video downloader. Download HD TikTok videos without watermark',
    url: 'https://yoursite.com',
    siteName: 'TokSave',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TokSave - TikTok Video Downloader',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TokSave - Download TikTok Video Without Watermark',
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
  verification: {
    google: 'your-google-verification-code',
  },
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
