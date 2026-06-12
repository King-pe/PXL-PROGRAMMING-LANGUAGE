import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { BookOpen, Code, Terminal, Zap, Globe, Shield, User, Cpu } from 'lucide-react';

const PXL_DOCS = [
  {
    title: "Quantum Variables",
    syntax: "pxl_flux name :: value;",
    description: "Unlike standard variables, PXL variables exist in a superposition. They only collapse to a fixed value when called by the execution stack."
  },
  {
    title: "The Injection Protocol",
    syntax: "inject_into(target) { logic }",
    description: "Used to bypass traditional OS kernels. PXL communicates directly with silicon logic gates for 0.0001ms execution speeds."
  },
  {
    title: "Logic Branching",
    syntax: "λ_gate (condition) ? execute : collapse;",
    description: "Replaces traditional IF/ELSE. It uses Lambda calculus to determine the most energy-efficient path of execution."
  }
];

export default function PXLDocumentation() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-green-500 selection:text-black">
      <Head>
        <title>PXL Language | Official Docs - Founded by Peter Joram</title>
      </Head>

      {/* Hero Section */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-sm flex items-center justify-center font-black text-black">P</div>
            <span className="text-xl font-bold tracking-tighter text-white">PXL <span className="text-green-500 underline decoration-2">CORE</span></span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium uppercase text-gray-400">
            <span className="flex items-center gap-1"><Globe size={14}/> Network: Global</span>
            <span className="flex items-center gap-1 text-green-500"><Shield size={14}/> Dev: Peter Joram</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Sidebar - Navigation */}
          <aside className="lg:col-span-3 space-y-8 hidden lg:block">
            <section>
              <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Introduction</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-green-500 font-semibold cursor-pointer">What is PXL?</li>
                <li className="hover:text-white cursor-pointer transition-colors">Vision & Origin</li>
                <li className="hover:text-white cursor-pointer transition-colors">Installation</li>
              </ul>
            </section>
            <section>
              <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Core Syntax</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-white cursor-pointer">Variables (Flux)</li>
                <li className="hover:text-white cursor-pointer">Injection Logic</li>
                <li className="hover:text-white cursor-pointer">Lambda Gates</li>
                <li className="hover:text-white cursor-pointer">Multidimensional Loops</li>
              </ul>
            </section>
          </aside>

          {/* Center Content - Documentation */}
          <div className="lg:col-span-9">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <h1 className="text-5xl font-black text-white mb-6 tracking-tight">PXL: The Future of Syntax.</h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                PXL is a breakthrough programming language designed by <strong>Peter Joram</strong> in Mbeya, Tanzania. 
                It moves away from traditional binary logic into <strong>Quantum-State Scripting</strong>, allowing 
                developers to write code that is invisible to hackers and optimized for hardware-level execution.
              </p>

              <div className="bg-gradient-to-r from-green-900/20 to-transparent p-6 border-l-4 border-green-600 rounded-r-lg">
                <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                  <User size={18} className="text-green-500"/> Founder Note:
                </h4>
                <p className="italic text-gray-300 transform">
                  "I created PXL to prove that the next evolution of logic comes from Africa. We don't just use tech; we invent it." 
                  <span className="block mt-2 font-bold not-italic">— Peter Joram, Tanzania.</span>
                </p>
              </div>
            </motion.section>

            <section className="space-y-12">
              <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Getting Started</h2>
              
              {P_DOCS.map((doc, index) => (
                <div key={index} className="group">
                  <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
                    <Zap size={18}/> {doc.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{doc.description}</p>
                  <div className="bg-[#0f0f0f] border border-white/5 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-2xl">
                    <span className="text-pink-500">// PXL Implementation</span>
                    <pre className="mt-2 text-green-200"><code>{doc.syntax}</code></pre>
                  </div>
                </div>
              ))}
            </section>

            {/* Unique Code Block Example */}
            <section className="mt-20">
              <h2 className="text-3xl font-bold text-white mb-6">Execution Pattern</h2>
              <div className="bg-[#080808] p-8 border border-green-500/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 bg-green-600/10 text-green-500 text-[10px] font-bold">PXL v1.0.4 - STABLE</div>
                <pre className="text-sm md:text-base leading-relaxed text-blue-300">
                  <code>{`
// UNIQUE PXL SCRIPT BY PETER JORAM
@world_access.init();

pxl_node main {
   flux sensor_data = listen(port: 8080);
   
   capture(sensor_data) -> pulse {
      if(pulse.frequency > 900THz) {
         quantum_emit("Signal Breakthrough Detected");
         sys.sync_with_founder("Peter Joram");
      }
   }

   deploy_to_vercel(project: "pxl-next-gen");
}
                  `}</code>
                </pre>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-32 py-20 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-8 text-gray-500">
            <Cpu size={24} className="hover:text-green-500 cursor-pointer transition-all"/>
            <Terminal size={24} className="hover:text-green-500 cursor-pointer transition-all"/>
            <Code size={24} className="hover:text-green-500 cursor-pointer transition-all"/>
          </div>
          <p className="text-sm font-bold tracking-widest uppercase">
            PXL PROGRAMMING LANGUAGE &copy; 2026
          </p>
          <p className="text-gray-500 mt-2 text-xs">
            Engineered by <span className="text-white">Peter Joram</span>. Born in Mbeya, Tanzania. 🇹🇿
          </p>
        </div>
      </footer>
    </div>
  );
}
