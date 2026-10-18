import { useMemo, useState } from 'react';

const DEFAULT_PXL = `pxl_node main {
  flux title = "Tanzania Digital Future";
  flux status = "Quantum-ready";

  quantum_emit("PXL engine initialized");
  sys.sync_with_founder("Peter Joram");
  deploy_to_vercel(project: "pxl-next-gen");
}`;

const DEFAULT_CSS = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: radial-gradient(circle at top, #092d1a, #050505 60%);
  color: #e5ffe9;
}

#app {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.pxl-runner {
  width: min(720px, 100%);
  border: 1px solid rgba(34, 197, 94, 0.35);
  background: rgba(10, 15, 12, 0.85);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 0 40px rgba(34, 197, 94, 0.14);
}

.pxl-title {
  margin: 0 0 8px;
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 900;
  color: #8ff7a6;
}

.pxl-status {
  margin: 0 0 16px;
  font-size: 0.9rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #84cc16;
}

.pxl-log {
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  display: grid;
  gap: 10px;
}

.pxl-log li {
  background: rgba(22, 30, 25, 0.9);
  border-left: 3px solid #22c55e;
  padding: 10px 12px;
  border-radius: 8px;
  color: #d1fae5;
}`;

const DEFAULT_JS = `const banner = document.createElement('div');
banner.textContent = 'Custom JS loaded by user';
banner.style.marginTop = '18px';
banner.style.padding = '12px 14px';
banner.style.borderRadius = '10px';
banner.style.background = '#052e16';
banner.style.color = '#bbf7d0';
const app = document.getElementById('app');
if (app) app.appendChild(banner);`;

export default function PlaygroundPage() {
  const [pxlCode, setPxlCode] = useState(DEFAULT_PXL);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [runKey, setRunKey] = useState(0);

  const iframeDocument = useMemo(() => {
    const payload = {
      pxlCode,
      cssCode,
      jsCode,
    };

    return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>${cssCode}</style>
        </head>
        <body>
          <div id="app"></div>
          <script src="/pxl-runtime.js"></script>
          <script>
            const bootstrap = ${JSON.stringify(payload)};
            window.addEventListener('DOMContentLoaded', () => {
              const root = document.getElementById('app');
              if (window.PXLRuntime) {
                window.PXLRuntime.installCSS(bootstrap.cssCode);
                window.PXLRuntime.execute(bootstrap.pxlCode, root);
              }

              try {
                const userScript = bootstrap.jsCode || '';
                new Function(userScript)();
              } catch (error) {
                const wrapper = document.createElement('pre');
                wrapper.style.color = '#fca5a5';
                wrapper.style.padding = '14px';
                wrapper.textContent = 'JavaScript error: ' + error.message;
                root.appendChild(wrapper);
              }
            });
          </script>
        </body>
      </html>`;
  }, [cssCode, jsCode, pxlCode, runKey]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <header className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">PXL Playground</p>
            <h1 className="mt-2 text-3xl font-black text-white">Run index.pxl, pxl.css and pxl.js live</h1>
          </div>
          <button
            type="button"
            onClick={() => setRunKey((prev) => prev + 1)}
            className="rounded-lg bg-green-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-green-400"
          >
            Run code
          </button>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.1fr_1.1fr]">
          <label className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 shadow-2xl shadow-black/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">index.pxl</span>
              <span className="text-xs text-gray-500">PXL script</span>
            </div>
            <textarea
              value={pxlCode}
              onChange={(event) => setPxlCode(event.target.value)}
              className="h-[340px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-sm text-green-200 outline-none ring-0"
            />
          </label>

          <label className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 shadow-2xl shadow-black/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">pxl.css</span>
              <span className="text-xs text-gray-500">Styles</span>
            </div>
            <textarea
              value={cssCode}
              onChange={(event) => setCssCode(event.target.value)}
              className="h-[340px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-sm text-blue-200 outline-none ring-0"
            />
          </label>

          <label className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 shadow-2xl shadow-black/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">pxl.js</span>
              <span className="text-xs text-gray-500">Behaviour</span>
            </div>
            <textarea
              value={jsCode}
              onChange={(event) => setJsCode(event.target.value)}
              className="h-[340px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-sm text-purple-200 outline-none ring-0"
            />
          </label>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-green-500/20 bg-[#0a0f0c]">
          <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
            <span>Live output</span>
            <span>iframe sandbox</span>
          </div>
          <iframe
            key={runKey}
            title="PXL sandbox"
            srcDoc={iframeDocument}
            className="h-[620px] w-full bg-[#050505]"
          />
        </section>
      </div>
    </div>
  );
}

