// Adds "▶ Run" to bash code blocks — only when the local dev runner answers (npm run dev on this machine).
(async () => {
	if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;
	const H = { 'x-runner': '1' };
	try { if (!(await fetch('/__run', { headers: H })).ok) return; } catch { return; }

	const day = (location.pathname.match(/day-(\d+)/) || [])[1];
	const dayDir = day ? `day${day}` : '';

	for (const pre of document.querySelectorAll('pre[data-language="bash"]')) {
		const figure = pre.closest('figure');
		const code = figure?.querySelector('.copy button[data-code]')?.dataset.code.replace(/\u007f/g, '\n');
		if (!code) continue;
		// Type comes from the AI-prompt notice right after the block (🔴 = ai-delete).
		const notice = figure.closest('.expressive-code')?.nextElementSibling;
		const danger = notice?.classList.contains('ai-delete');

		const bar = document.createElement('div');
		bar.className = 'run-bar not-content';
		const btn = document.createElement('button');
		btn.className = 'run-btn' + (danger ? ' run-danger' : '');
		btn.textContent = '▶ Run';
		const out = document.createElement('pre');
		out.className = 'run-output not-content';
		out.hidden = true;
		bar.append(btn);
		figure.closest('.expressive-code').after(bar, out);

		let ctrl = null, armed = false;
		const reset = () => { ctrl = null; armed = false; btn.textContent = '▶ Run'; btn.classList.remove('run-armed'); };

		btn.onclick = async () => {
			if (ctrl) return ctrl.abort(); // Stop
			if (danger && !armed) { // client-side first click: arm
				armed = true; btn.textContent = '⚠️ 🔴 Destructive: click again to run'; btn.classList.add('run-armed');
				return setTimeout(() => armed && !ctrl && reset(), 5000);
			}
			out.hidden = false; out.textContent = '';
			ctrl = new AbortController();
			btn.textContent = '■ Stop';
			try {
				let res = await send(armed);
				if (res.status === 409) { // server's guard says destructive
					out.textContent = '⚠️ ' + (await res.text()) + '\nClick ▶ Run again to confirm.\n';
					ctrl = null; armed = true; btn.textContent = '⚠️ 🔴 Confirm run'; btn.classList.add('run-armed');
					return;
				}
				const reader = res.body.getReader(), dec = new TextDecoder();
				for (;;) { const { done, value } = await reader.read(); if (done) break; out.textContent += dec.decode(value, { stream: true }); out.scrollTop = out.scrollHeight; }
			} catch (e) { out.textContent += e.name === 'AbortError' ? '\n[stopped]\n' : `\n[error: ${e.message}]\n`; }
			reset();
		};
		const send = (confirmed) => fetch('/__run', {
			method: 'POST', signal: ctrl.signal,
			headers: { ...H, 'Content-Type': 'application/json' },
			body: JSON.stringify({ command: code, day: dayDir, confirmed }),
		});
	}
})();
