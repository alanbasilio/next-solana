import { Metadata } from 'next';

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title = 'Next.js i18n Starter',
  description = 'A modern, production-ready Next.js starter template with internationalization (i18n) support, built with the latest technologies and best practices.',
  image = '/og-image.png',
  url = 'https://your-domain.com',
  locale = 'en',
  type = 'website',
  keywords = [
    'Next.js',
    'React',
    'TypeScript',
    'i18n',
    'internationalization',
    'Tailwind CSS',
    'Radix UI',
    'starter',
    'template',
  ],
  author = 'Your Name',
  publishedTime,
  modifiedTime,
}: MetadataProps = {}): Metadata {
  const siteTitle =
    title === 'Next.js i18n Starter'
      ? title
      : `${title} | Next.js i18n Starter`;

  return {
    title: siteTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
      languages: {
        en: '/en',
        pt: '/pt',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: siteTitle,
      description,
      url,
      siteName: 'Next.js i18n Starter',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description,
      images: [image],
      creator: '@yourusername',
      site: '@yourusername',
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-site-verification',
      yandex: 'your-yandex-verification',
      yahoo: 'your-yahoo-verification',
    },
  };
}

export function generateJsonLd({
  title = 'Next.js i18n Starter',
  description = 'A modern, production-ready Next.js starter template with internationalization (i18n) support.',
  url = 'https://your-domain.com',
  author = 'Your Name',
  publishedTime,
  modifiedTime,
}: MetadataProps = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    description,
    url,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: title,
    },
    inLanguage: ['en', 'pt'],
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  };
}
