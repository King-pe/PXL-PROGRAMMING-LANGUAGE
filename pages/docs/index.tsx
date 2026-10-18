import Link from 'next/link';
import React from 'react';

export default function DocsHome() {
  const topics = [
    { title: 'Quantum Variables (flux)', slug: 'quantum-variables', description: 'Variables that can hold strings, numbers and be used in expressions.' },
    { title: 'Injection Protocol', slug: 'injection-protocol', description: 'Control blocks and how PXL maps to runtime behaviors.' },
    { title: 'Logic Branching (if)', slug: 'logic-branching', description: 'Conditional blocks with simple expression support.' },
    { title: 'Capture blocks', slug: 'capture-blocks', description: 'Event-like capture blocks that can emit logs.' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">PXL Documentation</h1>
          <Link href="/playground"><a className="text-sm font-semibold text-green-400">Try in Playground</a></Link>
        </header>

        <section className="grid gap-4">
          {topics.map((t) => (
            <article key={t.slug} className="rounded-xl bg-[#0b0f0d] p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
              <p className="text-gray-400 mt-2">{t.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
