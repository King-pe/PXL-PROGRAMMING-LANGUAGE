import { useMemo, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

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

const EXAMPLES = [
  {
    name: 'Hello PXL',
    pxl: `pxl_node main {\n  flux title = "Hello PXL";\n  quantum_emit("Welcome to PXL Playground");\n}`,
    css: `.pxl-title { color: #ffd7a8; }`,
    js: `console.log('Hello PXL example');`
  },
  {
    name: 'Sensor Demo',
    pxl: `pxl_node sensor {\n  flux title = "Sensor Demo";\n  flux status = "Running";\n  capture(sensor_data) -> pulse {\n    quantum_emit("Pulse captured");\n  }\n}`,
    css: `.pxl-status { color: #60a5fa }`,
    js: `console.log('Sensor demo loaded');`
  }
];

export default function PlaygroundPage() {
  const [pxlCode, setPxlCode] = useState(DEFAULT_PXL);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [runKey, setRunKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'pxl'|'css'|'js'>('pxl');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  function saveFile(name = 'default') {
    try {
      const payload = { pxl: pxlCode, css: cssCode, js: jsCode };
      localStorage.setItem(`pxl_playground_${name}`, JSON.stringify(payload));
      alert(`Saved as ${name}`);
    } catch (e) {
      alert('Save failed: ' + e);
    }
  }

  function loadFile(name = 'default') {
    try {
      const raw = localStorage.getItem(`pxl_playground_${name}`);
      if (!raw) return alert('No saved file with name: ' + name);
      const parsed = JSON.parse(raw);
      setPxlCode(parsed.pxl || '');
      setCssCode(parsed.css || '');
      setJsCode(parsed.js || '');
      alert(`Loaded ${name}`);
    } catch (e) {
      alert('Load failed: ' + e);
    }
  }

  function listSaves() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('pxl_playground_'));
    return keys.map((k) => k.replace('pxl_playground_', ''));
  }

  function downloadHTML() {
    const payload = { pxlCode, cssCode, jsCode };
    const html = `<!doctype html>\n<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssCode}</style></head><body><div id="app"></div><script>(${encodeURIComponent(`(function(){${getRuntimeSource()}
window.PXLRuntime.execute(${JSON.stringify(pxlCode)}, document.getElementById('app'))})()`)});</script><script>try{${jsCode}}catch(e){console.error(e)}</script></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pxl-export.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  function getRuntimeSource() {
    // small embed of runtime (a subset) to make exported HTML self-contained
    return `(${runtimeToString()})();`;
  }

  function runtimeToString() {
    // Minified-ish version of the runtime used in public/pxl-runtime.js
    return `function(){function s(v){return String(v==null?'':v).replace(/</g,'&lt;').replace(/>/g,'&gt;')}function e(raw){const root=document.getElementById('app');if(!root) return;root.innerHTML='';const vars={};const logs=[];const lines=(raw||'').split('\n');let i=0;function evalCond(cond){try{const safe=cond.replace(/([A-Za-z_][A-Za-z0-9_]*)/g,function(m){return typeof vars[m]!=='undefined'?JSON.stringify(vars[m]):m});return Function('return ('+safe+')')()}catch(e){return false}}for(i=0;i<lines.length;i++){const line=lines[i].trim();if(!line||line.startsWith('//')) continue;const flux=line.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);if(flux){vars[flux[1]]=parseValue(flux[2]);continue}const emit=line.match(/quantum_emit\(\s*(['\"])(.*?)\1\s*\);?$/);if(emit){logs.push(emit[2]);continue}const sync=line.match(/sys\.sync_with_founder\(\s*(['\"])(.*?)\1\s*\);?$/);if(sync){logs.push('Founder sync: '+sync[2]);continue}const deploy=line.match(/deploy_to_vercel\(\s*project\s*:\s*(['\"])(.*?)\1\s*\);?$/);if(deploy){logs.push('Deploy to Vercel: '+deploy[2]);continue}const ifMatch=line.match(/^if\s*\((.*)\)\s*{\s*$/);if(ifMatch){const condition=ifMatch[1];const inner=[];let depth=0;i++;while(i<lines.length){const l=lines[i];if(l.includes('{')) depth++; if(l.includes('}')){ if(depth<=0) break; depth--;} inner.push(l); i++;} if(evalCond(condition)){for(const inLine of inner){const ln=inLine.trim();const em=ln.match(/quantum_emit\(\s*(['\"])(.*?)\1\s*\);?$/);if(em) logs.push(em[2]);const fl=ln.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);if(fl){vars[fl[1]]=parseValue(fl[2])}}}continue} }function parseValue(v){v=v.trim();if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) return v.slice(1,-1);if(!Number.isNaN(Number(v))) return Number(v);return v}const container=document.createElement('div');container.className='pxl-runner';const title=document.createElement('h1');title.className='pxl-title';title.textContent=vars.title||'PXL Engine Ready';container.appendChild(title);const status=document.createElement('p');status.className='pxl-status';status.textContent=vars.status||'QUANTUM-READY';container.appendChild(status);if(logs.length>0){const ul=document.createElement('ul');ul.className='pxl-log';for(const entry of logs){const li=document.createElement('li');li.innerHTML=s(entry);ul.appendChild(li)}container.appendChild(ul)}root.appendChild(container)}window.PXLRuntime={installCSS:function(c){const ex=document.getElementById('pxl-runtime-style');if(ex){ex.textContent=c||'';return;}const s=document.createElement('style');s.id='pxl-runtime-style';s.textContent=c||'';document.head.appendChild(s)},execute:e,parseValue:function(v){if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))return v.slice(1,-1);if(!Number.isNaN(Number(v)))return Number(v);return v}}`;
  }

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

  function insertExample(i) {
    const ex = EXAMPLES[i];
    if (!ex) return;
    setPxlCode(ex.pxl);
    setCssCode(ex.css);
    setJsCode(ex.js);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <header className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">PXL Playground</p>
            <h1 className="mt-2 text-3xl font-black text-white">Run index.pxl, pxl.css and pxl.js live</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRunKey((prev) => prev + 1)}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-green-400"
            >
              Run
            </button>
            <button
              type="button"
              onClick={() => saveFile(prompt('Save as (name):', 'default') || 'default')}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Save
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const saves = listSaves();
                  const choice = prompt('Saved files:\n' + saves.join('\n') + '\n\nType name to load:', saves[0] || 'default');
                  if (choice) loadFile(choice);
                }}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Load
              </button>
            </div>
            <button
              type="button"
              onClick={downloadHTML}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Export HTML
            </button>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <nav className="flex gap-2">
            <button onClick={() => setActiveTab('pxl')} className={`px-3 py-2 rounded-md ${activeTab==='pxl'? 'bg-green-600 text-black font-bold' : 'bg-white/5 text-white'}`}>PXL</button>
            <button onClick={() => setActiveTab('css')} className={`px-3 py-2 rounded-md ${activeTab==='css'? 'bg-green-600 text-black font-bold' : 'bg-white/5 text-white'}`}>CSS</button>
            <button onClick={() => setActiveTab('js')} className={`px-3 py-2 rounded-md ${activeTab==='js'? 'bg-green-600 text-black font-bold' : 'bg-white/5 text-white'}`}>JS</button>
          </nav>

          <div className="ml-auto flex gap-2">
            {EXAMPLES.map((ex, i) => (
              <button key={ex.name} onClick={() => insertExample(i)} className="text-xs rounded-md bg-white/5 px-2 py-1">{ex.name}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 shadow-2xl shadow-black/20">
            <CodeMirror
              value={activeTab === 'pxl' ? pxlCode : activeTab === 'css' ? cssCode : jsCode}
              onChange={(value) => {
                if (activeTab === 'pxl') setPxlCode(value);
                if (activeTab === 'css') setCssCode(value);
                if (activeTab === 'js') setJsCode(value);
              }}
              extensions={[javascript({ jsx: true })]}
              height="480px"
            />
          </div>

          <section className="rounded-2xl border border-green-500/20 bg-[#0a0f0c]">
            <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
              <span>Live output</span>
              <span>iframe sandbox</span>
            </div>
            <iframe
              ref={iframeRef}
              key={runKey}
              title="PXL sandbox"
              srcDoc={iframeDocument}
              className="h-[620px] w-full bg-[#050505]"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
