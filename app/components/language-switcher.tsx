'use client';

import { Tabs, TabsList, TabsTrigger } from '@/app/components';
import { cn, languages } from '@/lib';
import { useParams, usePathname, useRouter } from 'next/navigation';

export const LanguageSwitcher = () => {
  const { lng } = useParams<{ lng: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (val: string) => router.push(pathname.replace(lng, val));

  return (
    <Tabs onValueChange={onChange} value={lng}>
      <TabsList className='w-full'>
        {languages.map((language) => (
          <TabsTrigger
            key={language}
            value={language}
            className={cn('flex-1', {
              'cursor-pointer': language !== lng,
            })}
          >
            {language}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
