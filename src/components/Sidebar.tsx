import React from 'react';
import { Home, Compass, Bookmark, ShieldAlert, Sparkles, MapPin, X } from 'lucide-react';

interface SidebarProps {
  activePage: 'home' | 'explore' | 'assistant' | 'saved' | 'alerts' | 'place-details';
  onNavigate: (page: 'home' | 'explore' | 'assistant' | 'saved' | 'alerts' | 'place-details') => void;
  savedCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  savedCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, badge: null },
    { id: 'explore' as const, label: 'Explore', icon: Compass, badge: '240+' },
    { id: 'assistant' as const, label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { id: 'saved' as const, label: 'Saved Places', icon: Bookmark, badge: savedCount > 0 ? `${savedCount}` : null },
    { id: 'alerts' as const, label: 'Safety Map', icon: ShieldAlert, badge: 'Live' },
  ];

  const handleItemClick = (id: 'home' | 'explore' | 'assistant' | 'saved' | 'alerts') => {
    onNavigate(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-black/65 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl glass-blue-btn flex items-center justify-center text-slate-950 font-extrabold text-base shadow-lg group-hover:scale-105 transition-transform">
                CS
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  CitySense AI
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </span>
                <span className="text-[11px] font-medium text-slate-400">Urban Intelligence</span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  type="button"
                  className={`w-full h-12 rounded-2xl px-4 flex items-center justify-between text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'glass-tube text-white border-white/40 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom City Status Capsule */}
        <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full glass-segmented-blue flex items-center justify-center text-slate-950 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-xs min-w-0">
              <span className="font-semibold text-white truncate">Metro District</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Sensor Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
