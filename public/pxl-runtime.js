(() => {
  function safeText(value) {
    return String(value ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function evaluateValue(raw) {
    const value = (raw || '').trim();
    if (!value) return '';
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  function ensureRoot(root) {
    if (!root) return null;
    if (root.id !== 'app') {
      const app = document.getElementById('app') || document.createElement('div');
      app.id = 'app';
      if (!app.parentElement) {
        root.appendChild(app);
      }
      return app;
    }
    return root;
  }

  function installCSS(cssText) {
    const existing = document.getElementById('pxl-runtime-style');
    if (existing) {
      existing.textContent = cssText || '';
      return;
    }

    const style = document.createElement('style');
    style.id = 'pxl-runtime-style';
    style.textContent = cssText || '';
    document.head.appendChild(style);
  }

  function evalCondition(condition, variables) {
    // Replace variable names with their JSON values, then evaluate safely
    try {
      const replaced = condition.replace(/([A-Za-z_][A-Za-z0-9_]*)/g, function (m) {
        if (Object.prototype.hasOwnProperty.call(variables, m)) return JSON.stringify(variables[m]);
        return m;
      });
      // eslint-disable-next-line no-new-func
      return Function('return (' + replaced + ')')();
    } catch (e) {
      return false;
    }
  }

  function execute(code, root) {
    const appRoot = ensureRoot(root);
    if (!appRoot) return;

    appRoot.innerHTML = '';

    const variables = {};
    const logEntries = [];
    const lines = (code || '').split(/\n/);

    // Simple parser that understands: flux assignments, quantum_emit, sys.sync_with_founder, deploy_to_vercel, if(condition) { ... }
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();
      if (!line || line.startsWith('//')) continue;

      const fluxMatch = line.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);
      if (fluxMatch) {
        const [, name, valueText] = fluxMatch;
        variables[name] = evaluateValue(valueText);
        continue;
      }

      const emitMatch = line.match(/quantum_emit\(\s*(['\"])(.*?)\1\s*\);?$/);
      if (emitMatch) {
        logEntries.push(emitMatch[2]);
        continue;
      }

      const syncMatch = line.match(/sys\.sync_with_founder\(\s*(['\"])(.*?)\1\s*\);?$/);
      if (syncMatch) {
        logEntries.push(`Founder sync: ${syncMatch[2]}`);
        continue;
      }

      const deployMatch = line.match(/deploy_to_vercel\(\s*project\s*:\s*(['\"])(.*?)\1\s*\);?$/);
      if (deployMatch) {
        logEntries.push(`Deploy to Vercel: ${deployMatch[2]}`);
        continue;
      }

      const ifStart = line.match(/^if\s*\((.*)\)\s*{\s*$/);
      if (ifStart) {
        const condition = ifStart[1];
        // collect inner block
        const inner = [];
        let depth = 0;
        i++;
        for (; i < lines.length; i++) {
          const cur = lines[i];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) {
            if (depth <= 0) break;
            depth--;
          }
          inner.push(cur);
        }

        const condResult = evalCondition(condition, variables);
        if (condResult) {
          // execute inner lines
          inner.forEach((ln) => {
            const l = ln.trim();
            const em = l.match(/quantum_emit\(\s*(['\"])(.*?)\1\s*\);?$/);
            if (em) logEntries.push(em[2]);
            const fl = l.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);
            if (fl) variables[fl[1]] = evaluateValue(fl[2]);
          });
        }
        continue;
      }

      // support simple capture(...) -> name { ... } pattern by treating inner emits
      const captureStart = line.match(/^capture\s*\(.*\)\s*->\s*([A-Za-z_][A-Za-z0-9_]*)\s*{\s*$/);
      if (captureStart) {
        const inner = [];
        let depth = 0;
        i++;
        for (; i < lines.length; i++) {
          const cur = lines[i];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) {
            if (depth <= 0) break;
            depth--;
          }
          inner.push(cur);
        }
        // for now, just record inner emits as logs
        inner.forEach((ln) => {
          const l = ln.trim();
          const em = l.match(/quantum_emit\(\s*(['\"])(.*?)\1\s*\);?$/);
          if (em) logEntries.push(em[2]);
        });
        continue;
      }
    }

    const container = document.createElement('div');
    container.className = 'pxl-runner';

    const title = document.createElement('h1');
    title.className = 'pxl-title';
    title.textContent = variables.title || 'PXL Engine Ready';
    container.appendChild(title);

    const status = document.createElement('p');
    status.className = 'pxl-status';
    status.textContent = variables.status || 'QUANTUM-READY';
    container.appendChild(status);

    if (logEntries.length > 0) {
      const list = document.createElement('ul');
      list.className = 'pxl-log';

      for (const entry of logEntries) {
        const item = document.createElement('li');
        item.innerHTML = safeText(entry);
        list.appendChild(item);
      }

      container.appendChild(list);
    }

    appRoot.appendChild(container);
  }

  window.PXLRuntime = {
    installCSS,
    execute,
  };
})();
