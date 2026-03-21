import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const LOCALES = ['he', 'en'];

export async function POST(request: Request): Promise<NextResponse> {
  const secret = request.headers.get('x-contentful-webhook-secret');
  if (secret !== process.env.CONTENTFUL_REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const contentType: string | undefined = body?.sys?.contentType?.sys?.id;
    const slug: string | undefined = body?.fields?.slug?.['en-US'];
    const paths: string[] = [];

    switch (contentType) {
      case 'siteSettings':
      case 'announcementBar':
        LOCALES.forEach((l) => paths.push(`/${l}`));
        break;
      case 'testimonial':
      case 'faqItem':
      case 'pricingPlan':
      case 'module':
        LOCALES.forEach((l) => paths.push(`/${l}`));
        break;
      case 'teamMember':
        LOCALES.forEach((l) => {
          paths.push(`/${l}`);
          paths.push(`/${l}/about`);
        });
        break;
      case 'blogPost':
        LOCALES.forEach((l) => {
          paths.push(`/${l}/blog`);
          if (slug) paths.push(`/${l}/blog/${slug}`);
        });
        break;
      case 'landingPage':
        if (slug) LOCALES.forEach((l) => paths.push(`/${l}/lp/${slug}`));
        break;
      case 'caseStudy':
        LOCALES.forEach((l) => {
          paths.push(`/${l}/case-studies`);
          if (slug) paths.push(`/${l}/case-studies/${slug}`);
        });
        break;
      case 'persona':
        if (slug) LOCALES.forEach((l) => paths.push(`/${l}/solutions/${slug}`));
        break;
      default:
        // Unknown content type - revalidate homepage as fallback
        break;
    }

    const results: Array<{ path: string; success: boolean; error?: string }> = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, success: true });
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error';
        results.push({ path, success: false, error });
        console.error(`[Revalidate] Failed for ${path}:`, error);
      }
    }

    const allSucceeded = results.every((r) => r.success);
    return NextResponse.json(
      {
        revalidated: results.filter((r) => r.success).map((r) => r.path),
        failed: results.filter((r) => !r.success),
      },
      { status: allSucceeded ? 200 : 207 },
    );
  } catch (error) {
    console.error('[Revalidate] Failed to parse webhook:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
