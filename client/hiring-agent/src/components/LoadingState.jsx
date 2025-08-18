import React from "react";

// --- Shimmer Placeholder Sub-Components ---

const ShimmerBlock = ({ className }) => (
  <div className={`bg-gray-800/50 rounded-lg animate-pulse ${className}`}></div>
);

const SidebarSkeleton = () => (
  <aside className="fixed z-50 top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800/50 hidden lg:flex flex-col">
    <header className="p-6 border-b border-gray-800/50">
      <div className="flex items-center gap-3">
        <ShimmerBlock className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="w-3/4 h-4" />
          <ShimmerBlock className="w-1/2 h-3" />
        </div>
      </div>
    </header>
    <div className="p-6 flex-grow">
      <ShimmerBlock className="w-full h-24 rounded-2xl" />
    </div>
    <footer className="p-6 border-t border-gray-800/50 space-y-3">
      <ShimmerBlock className="w-full h-12 rounded-lg" />
      <ShimmerBlock className="w-full h-12 rounded-lg" />
    </footer>
  </aside>
);

const MainContentSkeleton = () => (
  <main className="lg:ml-80">
    <div className="max-w-4xl mx-auto p-6 lg:p-12">
      <header className="mb-12 text-center">
        <ShimmerBlock className="w-3/4 h-12 mx-auto mb-4" />
        <ShimmerBlock className="w-full max-w-lg h-6 mx-auto" />
      </header>
      <div>
        <ShimmerBlock className="w-full h-72 rounded-2xl" />
        <div className="flex justify-center mt-6">
          <ShimmerBlock className="w-32 h-8 rounded-full" />
        </div>
      </div>
    </div>
  </main>
);


// --- Main Loading State Component ---

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      <SidebarSkeleton />
      <MainContentSkeleton />
    </div>
  );
};

export default LoadingState;