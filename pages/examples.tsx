import Link from 'next/link';
import React from 'react';

const EXAMPLES = [
  {
    name: 'Hello PXL',
    pxl: `pxl_node main {\n  flux title = "Hello PXL";\n  quantum_emit("Welcome to PXL Playground: ${title}");\n}`,
    description: 'Simple title and emit example.'
  },
  {
    name: 'Conditional Emit',
    pxl: `pxl_node demo {\n  flux value = 42;\n  if (value > 10) {\n    quantum_emit("Value is greater than ten");\n  }\n}`,
    description: 'Shows basic conditional execution.'
  },
  {
    name: 'Capture Example',
    pxl: `pxl_node sensor {\n  flux title = "Capture Test";\n  capture(sensor_data) -> pulse {\n    quantum_emit("Pulse captured");\n  }\n}`,
    description: 'Capture block produces logs when active.'
  }
];

export default function Examples() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">Examples</h1>
          <Link href="/playground"><a className="text-sm font-semibold text-green-400">Open Playground</a></Link>
        </header>

        <section className="grid gap-4">
          {EXAMPLES.map((ex) => (
            <article key={ex.name} className="rounded-xl bg-[#0b0f0d] p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white">{ex.name}</h2>
              <p className="text-gray-400 mt-2">{ex.description}</p>
              <pre className="mt-4 rounded bg-black/60 p-4 text-sm overflow-auto text-green-200">{ex.pxl}</pre>
              <div className="mt-4 flex gap-2">
                <Link href="/playground"><a className="rounded px-3 py-2 bg-green-500 text-black font-bold">Open in Playground</a></Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
