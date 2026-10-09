import React from 'react';
import { Menu, Bell, SunMedium, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onNavigate: (page: 'home' | 'explore' | 'assistant' | 'saved' | 'alerts' | 'place-details') => void;
  activePage: string;
  weatherTemp?: string;
  notificationsActive: boolean;
  onToggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onNavigate,
  activePage,
  weatherTemp = '72°F',
  notificationsActive,
  onToggleNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 lg:hidden cursor-pointer"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white tracking-tight hidden sm:inline">
            CitySense AI
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
            {activePage === 'home' && 'City Dashboard'}
            {activePage === 'explore' && 'Explore Places'}
            {activePage === 'assistant' && 'AI City Assistant'}
            {activePage === 'saved' && 'Saved Stays & Spots'}
            {activePage === 'alerts' && 'Safety Map & Corridors'}
            {activePage === 'place-details' && 'Venue Intelligence & Details'}
          </span>
        </div>
      </div>

      {/* Right Zone: Quick status pills & Actions */}
      <div className="flex items-center gap-3">
        {/* Weather Quick Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
          <SunMedium className="w-3.5 h-3.5 text-amber-300" />
          <span>{weatherTemp} · Mild</span>
        </div>

        {/* Notifications Pill with Liquid Toggle */}
        <button
          onClick={onToggleNotifications}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
            notificationsActive
              ? 'bg-blue-500/15 border-blue-400/40 text-blue-300'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
          title="Toggle alerts"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {notificationsActive ? 'Alerts On' : 'Muted'}
          </span>
        </button>

        {/* Quick Explore Button */}
        <button
          onClick={() => onNavigate('explore')}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 glass-blue-btn transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore</span>
        </button>
      </div>
    </header>
  );
};
