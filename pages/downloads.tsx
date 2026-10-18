import React from 'react';

export default function Downloads() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-black text-white">Downloads</h1>
        </header>

        <section className="grid gap-4">
          <div className="rounded-xl bg-[#0b0f0d] p-6 border border-white/5">
            <h2 className="text-xl font-bold">Exported runtime</h2>
            <p className="text-gray-400 mt-2">You can download a self-contained HTML export from the Playground using the Export button — it bundles a small runtime and your code into a single file.</p>
            <a className="mt-4 inline-block rounded bg-green-500 px-4 py-2 font-bold text-black" href="/pxl-runtime.js" download>Download runtime (pxl-runtime.js)</a>
          </div>
        </section>
      </div>
    </div>
  );
}
