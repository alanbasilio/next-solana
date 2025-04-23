'use client';
import Image from 'next/image';

import { Button, LanguageSwitcher } from '@/app/components';
import { useTranslation } from '@/lib';
import { useParams } from 'next/navigation';

export default function Home() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'common');

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />

        <h1 className='text-2xl font-bold'>{t('welcome')}</h1>

        <ol className='list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
          <li className='mb-2 tracking-[-.01em]'>
            {t('edit')}{' '}
            <code className='bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold'>
              app/[lng]/page.tsx
            </code>
          </li>
          <li className='tracking-[-.01em]'>{t('save')}</li>
        </ol>

        <div className='flex gap-4 items-center flex-col sm:flex-row'>
          <Button asChild size='lg'>
            <a
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
          </Button>
          <Button asChild size='lg'>
            <a
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('learn')}
            </a>
          </Button>
        </div>
        <LanguageSwitcher />
      </main>
      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'>
        <Button asChild variant='link' className='px-0'>
          <a
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            {t('learn')}
          </a>
        </Button>
        <Button asChild variant='link' className='px-0'>
          <a
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            {t('examples')}
          </a>
        </Button>
        <Button asChild variant='link' className='px-0'>
          <a
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            {t('footer-text')}
          </a>
        </Button>
      </footer>
    </div>
  );
}
