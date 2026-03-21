'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/** Maps old SPA anchor hashes to new route-based paths */
const HASH_ROUTE_MAP: Record<string, string> = {
  '#pricing': '/pricing',
  '#contact': '/contact',
  '#team': '/about',
};

/** Hashes that should scroll to an element on the current page */
const SCROLL_HASHES = ['#faq', '#modules', '#features', '#about'];

export function LegacyHashHandler(): null {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    // Extract locale from current path (e.g., /he or /en)
    const locale = pathname.split('/')[1] || 'he';

    // Check if hash maps to a new route
    const routeRedirect = HASH_ROUTE_MAP[hash];
    if (routeRedirect) {
      router.replace(`/${locale}${routeRedirect}`);
      return;
    }

    // Check if hash is an in-page anchor
    if (SCROLL_HASHES.includes(hash)) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [router, pathname]);

  return null;
}
