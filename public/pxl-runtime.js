// Enhanced runtime: improved expression evaluation and interpolation
(() => {
  function safeText(value) {
    return String(value ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function parseValue(raw, variables) {
    if (!raw) return '';
    const v = raw.trim();
    // string literal
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
    // arithmetic / expression: try to evaluate replacing vars
    try {
      const replaced = v.replace(/([A-Za-z_][A-Za-z0-9_]*)/g, function (m) {
        if (Object.prototype.hasOwnProperty.call(variables, m)) return JSON.stringify(variables[m]);
        return m;
      });
      // eslint-disable-next-line no-new-func
      const result = Function('return (' + replaced + ')')();
      return result;
    } catch (e) {
      // fallback: as-is
      return v;
    }
  }

  function interpolate(msg, variables) {
    return msg.replace(/\$\{([^}]+)\}/g, function (_, expr) {
      try {
        const replaced = expr.replace(/([A-Za-z_][A-Za-z0-9_]*)/g, function (m) {
          if (Object.prototype.hasOwnProperty.call(variables, m)) return JSON.stringify(variables[m]);
          return m;
        });
        // eslint-disable-next-line no-new-func
        return Function('return (' + replaced + ')')();
      } catch (e) {
        return '';
      }
    });
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

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();
      if (!line || line.startsWith('//')) continue;

      const fluxMatch = line.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);
      if (fluxMatch) {
        const [, name, valueText] = fluxMatch;
        variables[name] = parseValue(valueText, variables);
        continue;
      }

      const emitMatch = line.match(/quantum_emit\(\s*(['\"])([\s\S]*?)\1\s*\);?$/);
      if (emitMatch) {
        const rawMsg = emitMatch[2];
        const msg = interpolate(rawMsg, variables);
        logEntries.push(msg);
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
          inner.forEach((ln) => {
            const l = ln.trim();
            const em = l.match(/quantum_emit\(\s*(['\"])([\s\S]*?)\1\s*\);?$/);
            if (em) logEntries.push(interpolate(em[2], variables));
            const fl = l.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);
            if (fl) variables[fl[1]] = parseValue(fl[2], variables);
          });
        }
        continue;
      }

      const captureStart = line.match(/^capture\s*\((.*)\)\s*->\s*([A-Za-z_][A-Za-z0-9_]*)\s*{\s*$/);
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
        inner.forEach((ln) => {
          const l = ln.trim();
          const em = l.match(/quantum_emit\(\s*(['\"])([\s\S]*?)\1\s*\);?$/);
          if (em) logEntries.push(interpolate(em[2], variables));
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
