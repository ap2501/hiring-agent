import React, { useState, useRef, useEffect } from "react";

// Helper component for smooth show/hide transitions
const CollapsibleSection = ({ isVisible, children }) => {
  return (
    <div
      className={`transition-[max-height,padding] duration-500 ease-in-out overflow-hidden`}
      style={{
        maxHeight: isVisible ? '2000px' : '0px',
        paddingTop: isVisible ? '1rem' : '0px',
        paddingBottom: isVisible ? '0px' : '0px',
       }}
    >
      {children}
    </div>
  );
};

// Main Component
const ResultsFullPipeline = ({ data }) => {
  if (!data) return null;

  const [activeTab, setActiveTab] = useState('discovered');
  const [expandedRanked, setExpandedRanked] = useState(null);
  
  const tabsRef = useRef([]);
  const [tabUnderline, setTabUnderline] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const currentTab = tabsRef.current.find(tab => tab.dataset.tabid === activeTab);
    if (currentTab) {
      setTabUnderline({
        width: currentTab.offsetWidth,
        left: currentTab.offsetLeft,
      });
    }
  }, [activeTab]);


  const toggleRankedExpansion = (index) => {
    setExpandedRanked(expandedRanked === index ? null : index);
  };

  const renderContent = () => {
    const animationKey = activeTab; // Change key to trigger re-animation
    return (
      <div key={animationKey} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'discovered' && (
          <div className="space-y-4">
            {data.candidates?.length > 0 ? data.candidates.map((candidate, idx) => (
              <div key={idx} className="bg-gray-900/40 border border-gray-800/50 p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-gray-900/60 group">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 font-bold text-lg">{candidate.name?.charAt(0) || 'C'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        {candidate.name}
                      </a>
                      {candidate.title && (
                        <span className="inline-block bg-gray-800/50 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0">
                          {candidate.title}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-2">
                      {candidate.headline}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Our initial search didn't find any candidates. Try broadening your job description.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'ranked' && (
           <div className="space-y-3">
            {data.scored_candidates?.length > 0 ? data.scored_candidates.map((candidate, idx) => (
              <div key={candidate.linkedin_url} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:bg-gray-900/60 group">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${idx === 0 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-gray-700/20 text-gray-400 border border-gray-700'}`}>
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        {candidate.name}
                      </a>
                      <p className="text-gray-400 text-sm leading-relaxed" title={candidate.headline}>
                        {candidate.headline}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 pl-4">
                      <span className="font-bold text-lg text-white w-12 text-right">{candidate.score.toFixed(2)}</span>
                      <div className="w-24 bg-gray-700/50 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${Math.min(candidate.score * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                    {candidate.breakdown && (
                      <button onClick={() => toggleRankedExpansion(idx)} className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRanked === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <CollapsibleSection isVisible={expandedRanked === idx}>
                  {candidate.breakdown && (
                     <div className="border-t border-gray-800/50 bg-gray-950/30 px-4 pb-4">
                      <h4 className="text-sm font-semibold text-white mb-4 pt-4">How this score was calculated:</h4>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(candidate.breakdown).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className="text-xs font-medium text-white">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                            </div>
                            {typeof value === 'number' && (
                              <div className="w-full bg-gray-800 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(value * 10, 100)}%` }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CollapsibleSection>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-gray-500">The AI didn't rank any candidates for this role.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'outreach' && (
           <div className="space-y-4">
            {data.outreach_messages?.length > 0 ? data.outreach_messages.map((message, idx) => (
              <div 
                key={message.linkedin_url} 
                className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-2xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-gray-900/60 group"
                style={{ animation: `fade-in 0.5s ease-out forwards ${idx * 70}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={message.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                      {message.candidate}
                    </a>
                  </div>
                  <div className="flex-shrink-0 pl-4 font-bold text-white">
                    Fit Score: {message.score.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-950/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm font-sans">{message.message}</pre>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-gray-500">The AI hasn't generated any outreach messages yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <header className="text-center mb-12">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-900/50 p-4 sm:p-6 rounded-3xl">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">Your Analysis Results</h1>
            <p className="text-gray-400">Here's what our AI found for you.</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="relative mb-8 flex justify-center border-b border-gray-800/50">
        <button
          ref={el => tabsRef.current[0] = el}
          data-tabid="discovered"
          onClick={() => setActiveTab('discovered')}
          className={`px-4 py-3 font-semibold transition-colors relative z-10 ${activeTab === 'discovered' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
        >
          Discovered ({data.candidates?.length || 0})
        </button>
        <button
          ref={el => tabsRef.current[1] = el}
          data-tabid="ranked"
          onClick={() => setActiveTab('ranked')}
          className={`px-4 py-3 font-semibold transition-colors relative z-10 ${activeTab === 'ranked' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
        >
          Ranked ({data.scored_candidates?.length || 0})
        </button>
        <button
          ref={el => tabsRef.current[2] = el}
          data-tabid="outreach"
          onClick={() => setActiveTab('outreach')}
          className={`px-4 py-3 font-semibold transition-colors relative z-10 ${activeTab === 'outreach' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
        >
          Outreach ({data.outreach_messages?.length || 0})
        </button>
        <div
          className="absolute bottom-0 h-0.5 bg-emerald-400 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: tabUnderline.width, left: tabUnderline.left }}
        />
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
};

export default ResultsFullPipeline;