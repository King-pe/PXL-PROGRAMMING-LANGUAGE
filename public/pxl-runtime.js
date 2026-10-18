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

  function execute(code, root) {
    const appRoot = ensureRoot(root);
    if (!appRoot) return;

    appRoot.innerHTML = '';

    const variables = {};
    const logEntries = [];
    const lines = (code || '').split(/\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//')) continue;

      const fluxMatch = line.match(/^(?:flux|pxl_flux|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);
      if (fluxMatch) {
        const [, name, valueText] = fluxMatch;
        variables[name] = evaluateValue(valueText);
        continue;
      }

      const emitMatch = line.match(/quantum_emit\(\s*(['"])(.*?)\1\s*\);?$/);
      if (emitMatch) {
        logEntries.push(emitMatch[2]);
        continue;
      }

      const syncMatch = line.match(/sys\.sync_with_founder\(\s*(['"])(.*?)\1\s*\);?$/);
      if (syncMatch) {
        logEntries.push(`Founder sync: ${syncMatch[2]}`);
        continue;
      }

      const deployMatch = line.match(/deploy_to_vercel\(\s*project\s*:\s*(['"])(.*?)\1\s*\);?$/);
      if (deployMatch) {
        logEntries.push(`Deploy to Vercel: ${deployMatch[2]}`);
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

