import React, { useState, useRef } from "react";
import ResultsFullPipeline from "./ResultsFullPipeline";
import ResultSearch from "./ResultSearch";
import { runFullPipeline, findCandidates } from "../services/aiService";

// --- Data for Examples ---
const exampleJDs = [
  {
    title: "React Developer",
    description: `Job Title: Senior React Developer

We are seeking an experienced Senior React Developer to join our dynamic team. You will be responsible for developing and implementing user interface components using React.js concepts and workflows such as Redux, Flux, and Webpack.

Responsibilities:
- Developing new user-facing features using React.js
- Building reusable components and front-end libraries for future use
- Translating designs and wireframes into high-quality code
- Optimizing components for maximum performance across a vast array of web-capable devices and browsers

Requirements:
- 5+ years of experience with React.js and its core principles
- Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model
- Experience with popular React.js workflows (such as Flux or Redux)
- Familiarity with newer specifications of EcmaScript
- Experience with data structure libraries (e.g., Immutable.js)
- Knowledge of modern authorization mechanisms, such as JSON Web Token
- Familiarity with modern front-end build pipelines and tools`
  },
  {
    title: "Data Scientist",
    description: `Job Title: Data Scientist, Machine Learning

We are looking for a Data Scientist to analyze large amounts of raw information to find patterns and build machine learning models. You will be responsible for creating predictive models and using data to drive business decisions.

Responsibilities:
- Undertake preprocessing of structured and unstructured data
- Build predictive models and machine-learning algorithms
- Analyze large amounts of information to discover trends and patterns
- Present information using data visualization techniques
- Propose solutions and strategies to business challenges

Requirements:
- Proven experience as a Data Scientist or Data Analyst
- Experience in data mining and machine learning
- Strong knowledge of SQL and Python; familiarity with Scala, Java or C++ is an asset
- Experience using business intelligence tools (e.g., Tableau) and data frameworks (e.g., Hadoop)
- Strong math skills (e.g., statistics, algebra)
- Ph.D. or Master’s in Computer Science, Data Science, or a related field`
  },
];


// --- Helper & Sub-Components ---
const Spinner = ({ className }) => (
  <div className={`w-5 h-5 border-2 rounded-full animate-spin ${className}`}></div>
);

const Sidebar = ({ isSidePanelOpen, setIsSidePanelOpen }) => (
  <aside
    className={`fixed z-50 top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800/50 transform transition-transform duration-300 ease-in-out ${
      isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 flex flex-col`}
  >
    <header className="p-6 border-b border-gray-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Hiring Agent</h1>
            <p className="text-xs text-gray-400">Your AI Recruiting Assistant</p>
          </div>
        </div>
        <button className="lg:hidden p-2" onClick={() => setIsSidePanelOpen(false)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </header>

    <div className="p-6 flex-grow">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
        <h3 className="font-semibold text-amber-400 mb-1">Welcome to Guest Mode!</h3>
        <p className="text-sm text-amber-300/80 leading-relaxed">
          We are still working on Login/SignUp features, you can still explore the app freely.
        </p>
      </div>
    </div>

    <footer className="p-6 border-t border-gray-800/50 space-y-3">
      <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white py-3 px-4 rounded-lg font-semibold transition-opacity duration-300">
        Create a Free Account
      </button>
      <button className="w-full bg-gray-800/50 hover:bg-gray-800 text-gray-200 py-3 px-4 rounded-lg font-medium transition-colors duration-300">
        Sign In
      </button>
    </footer>
  </aside>
);

const Hero = () => (
  <header className="mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
      Find Your Next Great <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Hire</span>
    </h1>
    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
      Just paste a job description below. Our AI will instantly find, score, and even write outreach messages for top candidates.
    </p>
  </header>
);

const ExampleJDs = ({ onSelect }) => (
  <div className="text-center mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
    <p className="text-sm text-gray-500 mb-3">Not sure where to start? Try an example:</p>
    <div className="flex flex-wrap justify-center gap-2">
      {exampleJDs.map((example) => (
        <button
          key={example.title}
          onClick={() => onSelect(example.description)}
          className="px-3 py-1 bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 rounded-full text-xs text-gray-300 transition-colors"
        >
          {example.title}
        </button>
      ))}
    </div>
  </div>
);


// --- Main Page Component ---

const LoggedOutPage = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [mode, setMode] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const handleSearch = async (searchFn, searchMode) => {
    if (!jd.trim() || loading) return;
    setLoading(searchMode);
    setError(null);
    setMode(searchMode);
    setResults(null);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      const res = await searchFn({ description: jd, num_candidates: 6 });
      setResults(res);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || `Failed to run ${searchMode}`);
      setMode(null);
    } finally {
      setLoading(null);
    }
  };

  const handleRunFullPipeline = () => handleSearch(runFullPipeline, "full");
  const handleRunSimpleSearch = () => handleSearch(findCandidates, "search");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {isSidePanelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}

      <Sidebar isSidePanelOpen={isSidePanelOpen} setIsSidePanelOpen={setIsSidePanelOpen} />

      <main className="lg:ml-80">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          <button
            className="lg:hidden mb-8 bg-gray-900/80 hover:bg-gray-800 px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
            onClick={() => setIsSidePanelOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span className="font-medium">Menu</span>
          </button>
          
          <Hero />

          {/* Input Section */}
          <div>
            <div className="relative">
              <div className={`transition-all duration-500 ${loading ? 'filter blur-sm scale-[0.98] opacity-50' : 'filter-none scale-100 opacity-100'}`}>
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Let's find some candidates! Paste your job description here to begin..."
                  className="w-full h-72 p-6 bg-gray-900/70 border border-gray-800/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-200 placeholder-gray-500 text-base leading-relaxed transition-all duration-300"
                />
                <div
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] transition-all duration-300 ease-in-out ${
                    jd.trim() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full p-2 flex items-center gap-4 shadow-2xl shadow-black/50">
                    <div className="flex items-center gap-2 flex-grow pl-2">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm text-gray-400 hidden md:inline">
                        Ready to analyze
                      </span>
                      <span className="text-sm text-gray-500">{jd.length.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleRunSimpleSearch} disabled={loading} className="bg-gray-700/50 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 px-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <span className="hidden sm:inline">Quick Search</span>
                      </button>
                      <button onClick={handleRunFullPipeline} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 px-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="hidden sm:inline">Full Pipeline</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
                  <Spinner className="w-8 h-8 border-emerald-400/50 border-t-emerald-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white">
                    {loading === 'full' ? 'Running Our Full Analysis...' : 'Finding Candidates...'}
                  </h3>
                  <p className="text-gray-400">Our AI is on the job. This might take a moment.</p>
                </div>
              )}
            </div>

            <ExampleJDs onSelect={(description) => setJd(description)} />
          </div>

          {/* Results Section */}
          <div ref={resultsRef} className="mt-16">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3 animate-in fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <h3 className="font-semibold mb-1">Oops, something went wrong.</h3>
                  <p className="text-red-400/80 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {!loading && results && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {mode === "full" && <ResultsFullPipeline data={results} />}
                {mode === "search" && <ResultSearch data={results} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoggedOutPage;