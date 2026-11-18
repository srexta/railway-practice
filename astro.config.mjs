// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Railway Practice',
			description: 'My learning journal: from zero server experience to running apps on Railway.',
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/srexta/railway-practice' }],
			sidebar: [
				{ label: 'Start here', link: '/' },
				{ label: 'Railway week (plan)', items: [{ autogenerate: { directory: 'plan' } }] },
				{ label: 'Days', items: [{ autogenerate: { directory: 'days' } }] },
				{ label: 'Use cases', items: [{ autogenerate: { directory: 'use-cases' } }] },
				{ label: 'Cheatsheets', items: [{ autogenerate: { directory: 'cheatsheet' } }] },
				{ label: 'Projects', items: [{ autogenerate: { directory: 'projects' } }] },
			],
		}),
	],
});
