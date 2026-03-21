import Link from 'next/link';

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <h1 className="mb-4 text-6xl font-bold text-neutral-900">404</h1>
      <p className="mb-2 text-xl text-neutral-600">Page not found</p>
      <p className="mb-2 text-xl text-neutral-600">הדף לא נמצא</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/he"
          className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          דף הבית
        </Link>
        <Link
          href="/en"
          className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
