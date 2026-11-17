// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import runner from './src/runner.mjs';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Railway Practice',
			description: 'My learning journal: from zero server experience to running apps on Railway.',
			customCss: ['./src/styles/custom.css'],
			// ▶ Run buttons: the script no-ops unless the local dev runner answers.
			head: [{ tag: 'script', attrs: { src: '/runner-client.js', defer: true } }],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/srexta/railway-practice' }],
			sidebar: [
				{ label: 'Start here', link: '/' },
				{ label: 'Days', items: [{ autogenerate: { directory: 'days' } }] },
				{ label: 'Use cases', items: [{ autogenerate: { directory: 'use-cases' } }] },
				{ label: 'Cheatsheets', items: [{ autogenerate: { directory: 'cheatsheet' } }] },
				{ label: 'Projects', items: [{ autogenerate: { directory: 'projects' } }] },
			],
		}),
		runner(),
	],
});
