'use client';

import { languages, useTranslation } from '@/lib';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LanguageSwitcher = ({ lng }: { lng: string }) => {
  const pathname = usePathname();
  const { t } = useTranslation(lng);

  const pathnameWithoutLng = pathname.replace(`/${lng}`, '');

  return (
    <div className='mt-4'>
      <span>{t('change-language')}: </span>
      <ul className='inline-flex gap-3'>
        {languages.map((l) => (
          <li key={l}>
            {l === lng ? (
              <span className='font-bold'>{l}</span>
            ) : (
              <Link href={`/${l}${pathnameWithoutLng}`}>{l}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
