import { redirect } from 'next/navigation';

/**
 * Root page redirects to default locale.
 * The middleware handles this for most cases, but this is a belt-and-suspenders fallback.
 */
export default function RootPage(): never {
  redirect('/he');
}
