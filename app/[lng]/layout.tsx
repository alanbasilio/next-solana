import '@/app/globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components';
import { languages, QueryClientProvider } from '@/lib';
import { dir } from 'i18next';

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
  return languages.map(lng => ({ lng }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>{children}</QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
