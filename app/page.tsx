'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Wand2, ArrowRight, Zap, Grip } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<"humanize" | "seo" | "faq" | "meta">('seo');
  const [tone, setTone] = useState('Professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedTones = ['Professional', 'Friendly', 'Marketing', 'Storyteller', 'Authoritative'];

  const handleOptimize = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, keyword, mode, tone }),
      });
      const data = await res.json();
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setOutput(data.result);
      }
    } catch (e) {
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const original = btn.innerHTML;
      btn.innerText = 'Copied!';
      setTimeout(() => btn.innerHTML = original, 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Grip className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              HumanRank AI
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Next.js 14 • Mistral-7B
            </span>
            <a href="https://github.com" target="_blank" className="hover:text-blue-600 transition-colors">
              {/* GitHub Icon or similar if needed */}
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-[calc(100vh-5rem)]">

        {/* Left Column: Input */}
        <section className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden flex-1">
          <div className="flex-none space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mode</label>
                <div className="flex bg-slate-100 p-1 rounded-xl flex-wrap gap-1">
                  {['humanize', 'seo', 'faq', 'meta'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m as any)}
                      className={`flex-1 py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${mode === m ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className={`hidden sm:inline-block w-1.5 h-1.5 rounded-full ${mode === m ? 'opacity-100' : 'opacity-0'} ${m === 'humanize' ? 'bg-blue-400' : m === 'seo' ? 'bg-green-400' : m === 'faq' ? 'bg-purple-400' : 'bg-orange-400'} transition-opacity`}></span>
                      {m === 'seo' ? 'SEO' : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tone</label>
                <div className="relative">
                  <select
                    title="Tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full h-[46px] px-4 appearance-none rounded-xl border border-slate-200 bg-white text-sm font-medium hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    {predefinedTones.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${mode === 'seo' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Keyword</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Zap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Best Marketing Strategies 2024"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source Content</label>
            <textarea
              placeholder="Paste your AI-generated blog draft here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-700 leading-relaxed font-mono text-sm shadow-inner bg-slate-50/50"
            />
            <div className="flex justify-between items-center mt-2 text-xs font-medium text-slate-400">
              <span>{input.split(/\s+/).filter(w => w).length} words</span>
              <span>Markdown Helper</span>
            </div>
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading || !input}
            className="flex-none w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {loading ? 'Optimizing Content...' : 'Generate Humanized Post'}
          </button>
        </section>

        {/* Right Column: Output */}
        <section className="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden relative group">
          <div className="flex justify-between items-center mb-4 flex-none">
            <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              Optimized Result
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">
                {output ? output.split(/\s+/).filter(w => w).length : 0} words
              </span>
              <button
                id="copy-btn"
                onClick={copyToClipboard}
                title="Copy to clipboard"
                disabled={!output}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
            {output ? (
              <article className="prose prose-sm lg:prose-base prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-blue-600 prose-li:text-slate-600">
                <div className="whitespace-pre-wrap font-sans">
                  {output}
                </div>
              </article>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <Wand2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium text-lg text-slate-400">Ready to transform your content</p>
                <p className="text-sm mt-2 max-w-xs text-center text-slate-400">Select a mode and paste your text to get started.</p>
              </div>
            )}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center z-20">
              <div className="flex flex-col items-center animate-pulse">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-slate-100 rounded-full mb-4"></div>
                  <div className="absolute top-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                </div>
                <p className="text-blue-600 font-bold bg-blue-50 px-4 py-1 rounded-full text-sm">Refining nuances...</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
