import React from 'react';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center font-black">P</div>
            </div>
            <nav className="flex gap-4">
              <Link href="/playground"><a className="text-sm font-bold text-green-400">Playground</a></Link>
              <Link href="/docs"><a className="text-sm font-bold text-white/80">Docs</a></Link>
              <Link href="/examples"><a className="text-sm font-bold text-white/80">Examples</a></Link>
              <Link href="/downloads"><a className="text-sm font-bold text-white/80">Downloads</a></Link>
            </nav>
          </div>
        </header>

        <main className="grid gap-8">
          <h1 className="text-5xl font-black text-white leading-tight">PXL — Quantum-State Scripting for the next generation</h1>
          <p className="text-lg text-gray-400">A concise experimental language and runtime focusing on hardware-adjacent expressive primitives. Built by Peter Joram — start with the interactive playground, explore examples, or download the runtime.</p>

          <div className="flex gap-3 mt-6">
            <Link href="/playground"><a className="rounded-md bg-green-500 px-5 py-3 font-bold text-black">Open Playground</a></Link>
            <Link href="/docs"><a className="rounded-md bg-white/5 px-5 py-3 font-bold text-white">Read Docs</a></Link>
          </div>

          <section className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-[#0b0f0d] p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white">Interactive Playground</h3>
              <p className="mt-2 text-gray-400">Write index.pxl, pxl.css and pxl.js and run them immediately in a sandboxed iframe.</p>
              <div className="mt-4">
                <Link href="/playground"><a className="text-sm font-semibold text-green-400">Try the Playground →</a></Link>
              </div>
            </div>

            <div className="rounded-xl bg-[#0b0f0d] p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white">Documentation & Examples</h3>
              <p className="mt-2 text-gray-400">Explore the language primitives, examples, and download runnable HTML exports.</p>
              <div className="mt-4">
                <Link href="/examples"><a className="text-sm font-semibold text-green-400">Browse examples →</a></Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
