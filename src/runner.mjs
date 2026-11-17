// Local "▶ Run" for bash code blocks. Exists ONLY inside `astro dev` (never in the built/deployed site).
// Commands run in ~/playground/<dayNN>, never in this repo. Destructive commands need confirm (via .claude/hooks/guard.sh).
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const GUARD = new URL('../.claude/hooks/guard.sh', import.meta.url).pathname;
const TIMEOUT_MS = 120_000; // ponytail: hard cap so forgotten servers/tail -f don't run forever; raise if needed

// Reuse Claude's safety hook: "ask" = destructive (needs confirm), "deny" = refuse.
function guard(command) {
	const r = spawnSync(GUARD, { input: JSON.stringify({ tool_input: { command } }), encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: process.cwd() } });
	try { return JSON.parse(r.stdout).hookSpecificOutput; } catch { return null; }
}

function handler(req, res) {
	// Only this dev server, on this machine: block other websites (Origin) and DNS-rebinding tricks (Host).
	const host = (req.headers.host || '').replace(/:\d+$/, '');
	const sameOrigin = !req.headers.origin || new URL(req.headers.origin).host === req.headers.host;
	if (!['localhost', '127.0.0.1', '[::1]'].includes(host) || !sameOrigin || req.headers['x-runner'] !== '1') {
		res.statusCode = 403; return res.end('forbidden');
	}
	if (req.method === 'GET') return res.end('ok'); // ping: lets the page know Run is available
	if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }

	let body = '';
	req.on('data', (c) => (body += c));
	req.on('end', () => {
		let command, day, confirmed;
		try { ({ command, day, confirmed } = JSON.parse(body)); } catch { res.statusCode = 400; return res.end('bad json'); }
		if (typeof command !== 'string' || !command.trim()) { res.statusCode = 400; return res.end('no command'); }

		const g = guard(command);
		if (g?.permissionDecision === 'deny') { res.statusCode = 403; return res.end(`Blocked: ${g.permissionDecisionReason}`); }
		if (g?.permissionDecision === 'ask' && !confirmed) { res.statusCode = 409; return res.end(g.permissionDecisionReason); }

		const cwd = join(homedir(), 'playground', /^day\d+$/.test(day) ? day : '');
		mkdirSync(cwd, { recursive: true });
		res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
		res.write(`$ cd ${cwd.replace(homedir(), '~')}\n`);

		// -l loads my shell profile (PATH for brew, node, docker…). detached → can kill the whole process group.
		const p = spawn(process.env.SHELL || '/bin/zsh', ['-lc', command], { cwd, detached: true });
		const kill = () => { try { process.kill(-p.pid, 'SIGTERM'); } catch {} };
		const timer = setTimeout(() => { res.write(`\n[stopped after ${TIMEOUT_MS / 1000}s]\n`); kill(); }, TIMEOUT_MS);
		p.stdout.on('data', (d) => res.write(d));
		p.stderr.on('data', (d) => res.write(d));
		p.on('close', (code) => { clearTimeout(timer); res.end(`\n[exit code ${code ?? 'killed'}]\n`); });
		res.on('close', () => { if (p.exitCode === null) kill(); }); // Stop button / tab closed
	});
}

export default function runner() {
	return {
		name: 'local-runner',
		hooks: {
			'astro:server:setup': ({ server }) => server.middlewares.use('/__run', handler),
		},
	};
}
