'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n/client';
import { languages } from '../../../lib/i18n/settings';

export const LanguageSwitcher = ({ lng }: { lng: string }) => {
  const pathname = usePathname();
  const { t } = useTranslation(lng, 'common');

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
