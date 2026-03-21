import { createClient, type ContentfulClientApi } from 'contentful';

export const isContentfulConfigured = !!(
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
);

let client: ContentfulClientApi<undefined> | null = null;

if (isContentfulConfigured) {
  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  });
}

export { client };
