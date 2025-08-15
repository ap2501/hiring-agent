import React from 'react';

const ResultSearch = ({ data }) => {
  if (!data) return null;

  // `data` is an array directly
  const results = Array.isArray(data) ? data : data.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span className="text-orange-400 text-sm font-medium">Search Complete</span>
        </div>
        <p className="text-sm text-gray-400 mt-3">
          {results.length} candidate{results.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-800/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-100">{item.name || `Candidate ${idx + 1}`}</h4>
                  <p className="text-sm text-gray-400">{item.title || 'Software Developer'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg font-medium">
                    Found
                  </span>
                </div>
              </div>

              {/* LinkedIn Link */}
              {item.linkedin_url && (
                <div className="mt-3 pt-3 border-t border-gray-700/30">
                  <a
                    href={item.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>View Profile</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">No Results Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            We couldn't find any candidates matching your search criteria. Try adjusting your job description.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultSearch;