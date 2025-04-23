/* eslint-disable react/jsx-pascal-case */
import Link from 'next/link';

// @ts-ignore
import {siteConfig} from '@/config/site';
import {cn} from '@/lib/utils';
// @ts-ignore
import {Icons} from '@/components/icons';
// @ts-ignore
import type {MainNavItem} from '@/types';

interface MainNavProps {
  items?: MainNavItem[]
}

export const MainNav = ({items}: MainNavProps) => {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item, index) =>
            item.href ? (
              <Link
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                href={item.href}
                className={cn(
                    'flex items-center text-sm font-medium transition-colors hover:text-foreground/80 sm:text-base',
                    item.disabled && 'cursor-not-allowed opacity-80',
                )}
              >
                {item.title}
              </Link>
            ) : null,
          )}
        </nav>
      ) : null}
    </div>
  );
};
