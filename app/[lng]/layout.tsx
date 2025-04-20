import '@/app/globals.css';
import { languages } from '@/lib';
import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { use } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js i18n Starter',
  description: 'Next.js i18n with app directory',
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) {
  const resolvedParams = use(params);
  const { lng } = resolvedParams;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
