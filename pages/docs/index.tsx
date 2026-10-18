import Link from 'next/link';
import React from 'react';

export default function DocsHome() {
  const topics = [
    { title: 'Quantum Variables (flux)', slug: 'quantum-variables', description: 'Variables that can hold strings, numbers and be used in expressions.' },
    { title: 'Injection Protocol', slug: 'injection-protocol', description: 'Control blocks and how PXL maps to runtime behaviors.' },
    { title: 'Logic Branching (if)', slug: 'logic-branching', description: 'Conditional blocks with simple expression support.' },
    { title: 'Capture blocks', slug: 'capture-blocks', description: 'Event-like capture blocks that can emit logs.' },
    { title: 'Database Connection', slug: 'db-connection', description: 'How to connect your site to a database (Cobase, PostgreSQL) securely.' }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-black text-black">PXL Documentation</h1>
          <Link href="/playground"><a className="text-sm font-semibold text-blue-600">Try in Playground</a></Link>
        </header>

        <section className="grid gap-4">
          {topics.map((t) => (
            <article key={t.slug} className="rounded-xl bg-white p-6 border border-black/5">
              <h2 className="text-xl font-bold text-black">{t.title}</h2>
              <p className="text-gray-700 mt-2">{t.description}</p>
              <div className="mt-3">
                <Link href={`/docs/${t.slug}`}><a className="text-sm font-semibold text-blue-600">Read →</a></Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
