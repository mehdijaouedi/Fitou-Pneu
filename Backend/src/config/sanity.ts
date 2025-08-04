import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'rsg8mxls',
  dataset: 'production',
  token: 'skaBi5YBEOOa7FPzbLk0pZxD71pTauUVokgEA1dMGoZ4QZJYy9Enl239CeDrD2uUGFf4yghHnJsToCyGZZ44xbLLzFec0eE55I3EpG6h0lBrNKJz7cGfrSa89GJi26wkvGFWc8FzdZuZSlIxZQaYksE6I2m4YAhaxSgK9fxSenor7ILMb9Qg',
  useCdn: false,
  apiVersion: '2024-03-19',
});

export default sanityClient; 