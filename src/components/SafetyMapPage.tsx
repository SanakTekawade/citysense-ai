import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  Bell,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Calendar,
  Building,
  Navigation,
  ArrowRight,
  Plus,
  Route,
  Clock,
  Eye,
  Info,
  ChevronRight,
  ThumbsUp,
  X,
  Filter,
} from 'lucide-react';
import {
  SAFETY_INCIDENTS_DATA,
  PRESET_ROUTES,
  SafetyIncidentItem,
  RouteOption,
} from '../data/cityData';
import { SafetyMap } from './SafetyMap';
import { ReportIssueModal } from './ReportIssueModal';

export const SafetyMapPage: React.FC = () => {
  // Incident Data State
  const [incidentsList, setIncidentsList] = useState<SafetyIncidentItem[]>(SAFETY_INCIDENTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'accident' | 'hazard' | 'lighting' | 'alert'>('all');
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncidentItem | null>(null);

  // Route Planner State
  const [startLocation, setStartLocation] = useState('Market St & 4th Hub');
  const [destinationLocation, setDestinationLocation] = useState('Verdant Biome Conservatory');
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(PRESET_ROUTES[0]);
  const [isRoutingActive, setIsRoutingActive] = useState(true);

  // Report Issue Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Mobile View Toggle: 'map' or 'reports'
  const [mobileView, setMobileView] = useState<'map' | 'reports'>('map');

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return incidentsList.filter((item) => {
      if (selectedCategory === 'all') return true;
      return item.categoryId === selectedCategory;
    });
  }, [incidentsList, selectedCategory]);

  // Handle reporting submission
  const handleAddNewReport = (
    newReportData: Omit<SafetyIncidentItem, 'id' | 'timeAgo' | 'date' | 'upvotes'>
  ) => {
    const newReport: SafetyIncidentItem = {
      ...newReportData,
      id: `user-rep-${Date.now()}`,
      timeAgo: 'Just now',
      date: 'Just now · Verified Pending',
      upvotes: 1,
    };
    setIncidentsList((prev) => [newReport, ...prev]);
    setSelectedIncident(newReport);
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIncidentsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
      )
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-20">
      {/* =========================================================================
          HEADER: Title, Subtitle, "Report an Issue" CTA, and Mobile Toggle
          ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>CitySense · Urban Safety Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Know your surroundings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live municipal feeds, street illumination statuses, verified advisories, and corridor navigation
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center">
              <div className="h-10 w-44 rounded-full glass-segmented-container p-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileView('map')}
                  className={`flex-1 h-full rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                    mobileView === 'map'
                      ? 'glass-segmented-blue text-slate-950 shadow-sm'
                      : 'text-slate-300'
                  }`}
                >
                  Map View
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('reports')}
                  className={`flex-1 h-full rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                    mobileView === 'reports'
                      ? 'glass-segmented-white text-slate-950 shadow-sm'
                      : 'text-slate-300'
                  }`}
                >
                  Reports ({filteredIncidents.length})
                </button>
              </div>
            </div>

            {/* "Report an Issue" Button linking to modal flow */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 glass-blue-btn cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>

        {/* Safety Advisory Notice (Mandatory Non-guarantee notice) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white">Safety Advisory Notice:</span>
            <span>
              Reported information, municipal sensor updates, and routing data are advisory only and do not guarantee safety. Conditions on the ground can shift rapidly. Always stay alert and exercise personal judgment.
            </span>
          </div>
        </div>

        {/* Category Filters: Accident Reports, Road Hazards, Street Lighting, Community Alerts */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'glass-blue-btn text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            All Reports ({incidentsList.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('accident')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'accident'
                ? 'glass-blue-btn text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Accident Reports</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('hazard')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'hazard'
                ? 'glass-blue-btn text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Road Hazards</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('lighting')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'lighting'
                ? 'glass-blue-btn text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
            <span>Street Lighting</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('alert')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'alert'
                ? 'glass-blue-btn text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-purple-400" />
            <span>Community Alerts</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN SAFETY INTERFACE: Map (7 cols) + Side Panel (5 cols)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INTERACTIVE MAP */}
        <div
          className={`lg:col-span-7 h-[580px] lg:h-[700px] w-full sticky top-20 ${
            mobileView === 'reports' ? 'hidden lg:block' : 'block'
          }`}
        >
          <SafetyMap
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            activeRoute={isRoutingActive ? activeRoute : null}
            className="h-full shadow-2xl"
          />
        </div>

        {/* SIDE PANEL: Route Planner & Recent Reports Panel */}
        <div
          className={`lg:col-span-5 flex flex-col gap-6 ${
            mobileView === 'map' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* -------------------------------------------------------------
              ROUTE PLANNER WITH ALTERNATIVE ROUTES
              ------------------------------------------------------------- */}
          <div className="rounded-[32px] p-5.5 clay-card flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Urban Route Planner
                </span>
              </div>
              <button
                onClick={() => setIsRoutingActive(!isRoutingActive)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  isRoutingActive
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {isRoutingActive ? 'Route Active' : 'Route Off'}
              </button>
            </div>

            {/* Inputs for start and destination */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs text-slate-400 shrink-0">Start:</span>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full font-medium"
                />
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                <span className="text-xs text-slate-400 shrink-0">Dest:</span>
                <input
                  type="text"
                  value={destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full font-medium"
                />
              </div>
            </div>

            {/* Alternative Routes Options */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Alternative Routing Options
              </span>

              <div className="flex flex-col gap-2">
                {PRESET_ROUTES.map((route) => {
                  const isSelected = activeRoute?.id === route.id && isRoutingActive;

                  return (
                    <div
                      key={route.id}
                      onClick={() => {
                        setActiveRoute(route);
                        setIsRoutingActive(true);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-blue-950/30 border-blue-400/60 shadow-[0_0_15px_rgba(96,165,250,0.2)]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{route.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                              route.safetyRating === 'Recommended Route'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : route.safetyRating === 'Alternative Route'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {route.tag}
                          </span>
                        </span>

                        <span className="text-xs font-mono font-bold text-slate-300">
                          {route.walkTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {route.distance} · {route.bikeTime} by bike
                        </span>
                        <span
                          className={`font-semibold ${
                            route.hazardsEnRoute === 0
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {route.hazardsEnRoute === 0
                            ? '0 hazards reported'
                            : `${route.hazardsEnRoute} active hazard`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RECENT REPORTS PANEL
              Category, location, date, source, and verification status.
              ------------------------------------------------------------- */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recent Incident & Hazard Reports ({filteredIncidents.length})
              </span>
              <span className="text-[11px] text-blue-400">Live Feed</span>
            </div>

            <div className="flex flex-col gap-3.5 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
              {filteredIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;

                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`rounded-[26px] p-4.5 clay-card-interactive flex flex-col gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-400/80 bg-blue-950/20 shadow-[0_0_20px_rgba(96,165,250,0.25)]'
                        : ''
                    }`}
                  >
                    {/* Header: Category Badge + Verification Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          incident.categoryId === 'accident'
                            ? 'bg-red-500/15 text-red-300 border-red-500/30'
                            : incident.categoryId === 'hazard'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : incident.categoryId === 'lighting'
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {incident.category}
                      </span>

                      {/* Verification Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          incident.isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-white/10 text-slate-300 border border-white/15'
                        }`}
                      >
                        {incident.isVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Incident</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-3 h-3 text-slate-400" />
                            <span>Community Report</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-sm text-white leading-snug">
                        {incident.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {incident.description}
                      </p>
                    </div>

                    {/* Location & Reporting Date */}
                    <div className="flex flex-col gap-1 text-[11px] text-slate-400 pt-1 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{incident.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{incident.date}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleUpvote(incident.id, e)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                          title="Confirm report accuracy"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{incident.upvotes}</span>
                        </button>
                      </div>

                      {/* Source attribution */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5 truncate">
                        <Building className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">Source: {incident.source}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Report an Issue Modal Flow */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddNewReport}
      />
    </div>
  );
};
