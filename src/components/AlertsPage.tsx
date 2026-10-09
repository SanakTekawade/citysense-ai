import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, MapPin, Bell, Radio } from 'lucide-react';
import { CITY_INSIGHTS_DATA } from '../data/cityData';

export const AlertsPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Safety & Municipal Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real-time safety monitors, transit advisories, and civic emergency broadcasts
        </p>
      </div>

      {/* Safety Score Overview */}
      <div className="rounded-[36px] p-6 sm:p-8 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-black border border-white/15 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl glass-blue-btn flex items-center justify-center text-slate-950 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              City Safety Index
            </span>
            <h3 className="text-2xl font-bold text-white">96 / 100 · High Safety Tier</h3>
            <span className="text-xs text-slate-300">
              Corridors monitored 24/7 by municipal sensor nodes and transit dispatch
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>All Sectors Operational</span>
        </div>
      </div>

      {/* Live Feed Reports */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-white">Active Community & Transit Reports</h2>
        <div className="flex flex-col gap-3">
          {CITY_INSIGHTS_DATA.communityReports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-[24px] clay-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-400/20 mt-0.5">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{report.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                      {report.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{report.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>{report.location}</span>
                    <span>·</span>
                    <span>{report.timeAgo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 shrink-0 self-start sm:self-center">
                <span>{report.upvotes} Confirmations</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
