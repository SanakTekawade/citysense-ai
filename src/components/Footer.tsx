import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            CitySense AI
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          </span>
          <p className="text-xs text-slate-400">
            Intelligent urban exploration, verified local insights, and real-time safety navigation.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
          <span>Discover Places</span>
          <span>·</span>
          <span>Safety Map</span>
          <span>·</span>
          <span>AI Assistant</span>
          <span>·</span>
          <span>Community Reports</span>
        </div>
      </div>
    </footer>
  );
};
