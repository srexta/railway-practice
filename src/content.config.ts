import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// Extra frontmatter used by journal pages.
		schema: docsSchema({
			extend: z.object({
				date: z.coerce.date().optional(),
				stage: z.number().optional(),
				tags: z.array(z.string()).optional(),
			}),
		}),
	}),
};
