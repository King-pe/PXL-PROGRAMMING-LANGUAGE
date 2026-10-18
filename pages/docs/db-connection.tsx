import React from 'react';

export default function DBConnectionDocs() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-black">Kuunganisha Database na PXL Site</h1>
          <p className="mt-2 subtitle">Mwongozo wa hatua kwa hatua (elimu) juu ya jinsi ya kuunganisha database na tovuti yako ya PXL, aina za makosa, na jinsi ya kuzitatua.</p>
        </header>

        <article className="prose max-w-none">
          <h2>1. Muhtasari</h2>
          <p>Kwa tovuti inayoweka snippets au data za watumiaji (k.m. index.pxl, pxl.css, pxl.js), tunapendekeza kila muamala wa kuhifadhi ufanywe server-side kupitia API ya Next.js (pages/api/*). Hii inalinda siri (API keys) na inazuia ufunuo wa credentials kwa browser.</p>

          <h2>2. Njia za kuunganisha</h2>
          <h3>2.1 Cobase (REST)</h3>
          <p>Kwa Cobase unatuma HTTP requests kwa endpoints ya Cobase ukiwa na vichwa vya Authorization. Hapa ni mfano wa server-side proxy (Next.js) unaotuma data kwa Cobase:</p>
          <pre>{`// pages/api/saveSnippet.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, pxl, css, js } = req.body;
  const API_URL = process.env.COBASE_API_URL; // e.g. https://.../api/v1/projects/{projectId}/tables/{table}/records
  const API_KEY = process.env.COBASE_API_KEY;
  if (!API_URL || !API_KEY) return res.status(500).json({ error: 'COBASE not configured' });

  try {
    const payload = { field1: name, field2: pxl, field3: css, field4: js };
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'x-api-key': API_KEY },
      body: JSON.stringify(payload),
    });
    const json = await r.json();
    if (!r.ok) return res.status(502).json({ error: 'Cobase error', details: json });
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ error: 'Network or code error', message: String(err) });
  }
}
`}</pre>

          <h3>2.2 PostgreSQL (Server-side)</h3>
          <p>Kwa PostgreSQL au MySQL, inashauriwa kutumia server-side connection (not from browser). Mfano wa Node/pg:</p>
          <pre>{`// pages/api/saveSnippetPg.ts
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, pxl, css, js } = req.body;
  try {
    const result = await pool.query('INSERT INTO snippets(name, pxl, css, js) VALUES($1,$2,$3,$4) RETURNING id, created_at', [name, pxl, css, js]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'DB error', message: e.message });
  }
}
`}</pre>

          <h3>2.3 File-based / LocalStorage (Client-side)</h3>
          <p>Kwa demo au bila DB, tumetumia <code>localStorage</code> kama njia ya kuhifadhi snippets ya mteja. Hii ni rahisi lakini haifai kwa kushirikiana kwa watumiaji au kwa scalability.</p>

          <h2>3. Usalama na settings</h2>
          <ul>
            <li>Usiweke API keys kwenye client/browser.</li>
            <li>Tumia env variables: <code>COBASE_API_KEY</code>, <code>DATABASE_URL</code>, <code>COBASE_API_URL</code>.</li>
            <li>Set up CORS kwa API yako endapo itatumiwa na domain tofauti.</li>
            <li>Ufikiaji: tumia authentication (JWT, session) kabla ya kuruhusu ku-save kwa cloud.</li>
          </ul>

          <h2>4. Aina za makosa (Common Errors) na ufumbuzi</h2>
          <h3>4.1 401 Unauthorized</h3>
          <p>Chanzo: API key si sahihi au haijatolewa. && Ufunguo hawezi kuonekana client-side.</p>
          <pre>{`// Nafasi ya kutatua:
- Hakikisha process.env.COBASE_API_KEY imewekwa kwenye server/Vercel secrets.
- Anzisha test request kutoka server (curl) ili kuthibitisha header Authorization.`}</pre>

          <h3>4.2 403 Forbidden</h3>
          <p>Chanzo: API key haikubaliki kwa project au inakataa kwa sababu ya permissions. Suluhisho: angalia project id, table name, na ruhusa.</p>

          <h3>4.3 404 Not Found</h3>
          <p>Chanzo: endpoint sio sahihi (wrong projectId/table). Suluhisho: thibitisha API URL na path.</p>

          <h3>4.4 502 / 503 Bad Gateway / Service Unavailable</h3>
          <p>Chanzo: Cobase/remote DB inashindwa. Suluhisho: retry logic, backoff, au caching.</p>

          <h3>4.5 Validation errors / 422</h3>
          <p>Chanzo: payload format si sawa. Suluhisho: tuma JSON kama Cobase inavyotarajiwa (field names) au tumia schema validation (zod/yup) server-side.</p>

          <h3>4.6 Local storage issues</h3>
          <p>Chanzo: quota imejaa au private browsing inazuia localStorage. Suluhisho: toa message kwa mtumiaji, tumia download export kama fallback.</p>

          <h2>5. Tipps za testing</h2>
          <ol>
            <li>Tumia Postman/HTTPie kwa kujaribu API yako ya server-side kabla ya kujaribu client.</li>
            <li>Tumia env vars za test na production tofauti.</li>
            <li>Gundua logs za server (Vercel logs / Cloud provider logs) kwa stack traces.</li>
          </ol>

          <h2>6. Mfano: Client -> Server -> Cobase flow</h2>
          <p>1) Client (browser) anaituma POST /api/snippets kwa Next.js API route. 2) Next.js API inasoma body, kuongeza metadata (owner, timestamp) na kuituma Cobase kwa HTTP POST ikitumia process.env.COBASE_API_KEY. 3) Next.js inarudisha response kwa browser kama success/failure.</p>

          <h2>7. Mambo ya ziada</h2>
          <ul>
            <li>Backup: schedule export to cloud storage (S3) or create nightly dumps.</li>
            <li>Rate limits: tumia throttling na queue (BullMQ) ikiwa una traffic nyingi.</li>
            <li>Scalability: store blobs (large css/js) in object storage and store reference in DB.</li>
          </ul>

          <h2>8. Mahali pa kuweka hizi maelezo kwenye site</h2>
          <p>Nimetengeneza ukurasa huu kama <code>/docs/db-connection</code> ndani ya project — unaweza kuhariri au kuongeza mfano mpya kwa urahisi. Pia ningeweza kuunda Markdown version (docs/db-connection.md) ikiwa unapendelea kwa Git-based docs.</p>
        </article>
      </div>
    </div>
  );
}
